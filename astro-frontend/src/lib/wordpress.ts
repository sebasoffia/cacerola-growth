const WORDPRESS_API_URL = import.meta.env.WORDPRESS_API_URL || 'http://localhost:8080';

export interface WPPost {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  modified: string;
  featured_image_url: string | null;
  author_name: string;
  reading_time: number;
  category_names: Array<{ name: string; slug: string }>;
  meta_title?: string;
  meta_description?: string;
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
