// En SSR, process.env está disponible en runtime
const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL || 'http://localhost:8080';

export interface WPPost {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  modified: string;
  featured_image_url: string | null;
  author: number;
  author_name: string;
  reading_time: number;
  category_names: Array<{ name: string; slug: string }>;
  meta_title?: string;
  meta_description?: string;
  _embedded?: {
    author?: WPAuthor[];
  };
}

export interface WPPage {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface WPComment {
  id: number;
  post: number;
  parent: number;
  author: number;
  author_name: string;
  author_url: string;
  date: string;
  content: { rendered: string };
  status: string;
  author_avatar_urls: {
    '24': string;
    '48': string;
    '96': string;
  };
}

export interface WPAuthor {
  id: number;
  name: string;
  slug: string;
  description: string;
  avatar_urls: {
    '24': string;
    '48': string;
    '96': string;
  };
  url: string;
  meta?: {
    linkedin?: string;
    twitter?: string;
    role?: string;
  };
}

async function fetchAPI<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${WORDPRESS_API_URL}/wp-json/wp/v2${endpoint}`);

  if (!response.ok) {
    throw new Error(`WordPress API error: ${response.status}`);
  }

  return response.json();
}

// Posts
export async function getPosts(options: {
  perPage?: number;
  page?: number;
  category?: number;
} = {}): Promise<WPPost[]> {
  const { perPage = 10, page = 1, category } = options;

  let endpoint = `/posts?per_page=${perPage}&page=${page}&_embed`;

  if (category) {
    endpoint += `&categories=${category}`;
  }

  return fetchAPI<WPPost[]>(endpoint);
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const posts = await fetchAPI<WPPost[]>(`/posts?slug=${slug}&_embed`);
  return posts[0] || null;
}

export async function getLatestPosts(count: number = 5): Promise<WPPost[]> {
  return getPosts({ perPage: count });
}

// Pages
export async function getPages(): Promise<WPPage[]> {
  return fetchAPI<WPPage[]>('/pages?_embed');
}

export async function getPageBySlug(slug: string): Promise<WPPage | null> {
  const pages = await fetchAPI<WPPage[]>(`/pages?slug=${slug}&_embed`);
  return pages[0] || null;
}

// Categories
export async function getCategories(): Promise<WPCategory[]> {
  return fetchAPI<WPCategory[]>('/categories');
}

// Search
export async function searchPosts(query: string): Promise<WPPost[]> {
  return fetchAPI<WPPost[]>(`/posts?search=${encodeURIComponent(query)}&_embed`);
}

// Comments
export async function getComments(postId: number): Promise<WPComment[]> {
  return fetchAPI<WPComment[]>(`/comments?post=${postId}&status=approve&per_page=100`);
}

export function getWordPressApiUrl(): string {
  return WORDPRESS_API_URL;
}

// Author helper
export function getAuthorFromPost(post: WPPost): {
  name: string;
  bio: string;
  avatar: string;
  url: string;
  linkedin: string;
  twitter: string;
  role: string;
} {
  const embedded = post._embedded?.author?.[0];

  // Valores por defecto (fallback)
  const defaults = {
    name: 'Sebastián Soffia',
    bio: 'Especialista en growth orgánico y SEO estratégico. Ayudo a empresas a construir autoridad de marca a través de contenido que conecta.',
    avatar: 'https://media.licdn.com/dms/image/v2/C4E03AQGzdCSznShBTw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1614133964933?e=1770249600&v=beta&t=l3SeMkVcOJpV_z7XEAEA59N7wq5HSzESE6QJSh-i9_w',
    url: 'https://cacerola.cl',
    linkedin: 'https://www.linkedin.com/in/sebasoffia/',
    twitter: 'https://twitter.com/sebasoffia',
    role: 'Fundador de Cacerola',
  };

  if (!embedded) {
    return { ...defaults, name: post.author_name || defaults.name };
  }

  return {
    name: embedded.name || post.author_name || defaults.name,
    bio: embedded.description || defaults.bio,
    avatar: embedded.avatar_urls?.['96'] || defaults.avatar,
    url: embedded.url || defaults.url,
    linkedin: embedded.meta?.linkedin || defaults.linkedin,
    twitter: embedded.meta?.twitter || defaults.twitter,
    role: embedded.meta?.role || defaults.role,
  };
}

// Utilities
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function truncateText(text: string, maxLength: number): string {
  const clean = stripHtml(text);
  if (clean.length <= maxLength) return clean;
  return clean.substring(0, maxLength).trim() + '...';
}
