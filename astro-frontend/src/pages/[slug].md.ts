import type { APIRoute } from 'astro';
import { getPostBySlug, stripHtml } from '@/lib/wordpress';

// Función para convertir HTML a Markdown
function htmlToMarkdown(html: string): string {
  let md = html;

  // Títulos
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
  md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');
  md = md.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n');
  md = md.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n');

  // Párrafos
  md = md.replace(/<p[^>]*>(.*?)<\/p>/gis, '$1\n\n');

  // Negritas
  md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');

  // Cursivas
  md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
  md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');

  // Links
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');

  // Imágenes
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)');
  md = md.replace(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*\/?>/gi, '![$1]($2)');
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '![]($1)');

  // Listas desordenadas
  md = md.replace(/<ul[^>]*>/gi, '\n');
  md = md.replace(/<\/ul>/gi, '\n');
  md = md.replace(/<li[^>]*>(.*?)<\/li>/gis, '- $1\n');

  // Listas ordenadas (simplificado)
  md = md.replace(/<ol[^>]*>/gi, '\n');
  md = md.replace(/<\/ol>/gi, '\n');

  // Blockquotes
  md = md.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, (_, content) => {
    const lines = content.trim().split('\n');
    return lines.map((line: string) => `> ${line.trim()}`).join('\n') + '\n\n';
  });

  // Code blocks
  md = md.replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, '```\n$1\n```\n\n');
  md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');

  // Líneas horizontales
  md = md.replace(/<hr[^>]*\/?>/gi, '\n---\n\n');

  // Line breaks
  md = md.replace(/<br[^>]*\/?>/gi, '\n');

  // Figuras (remover wrapper, mantener contenido)
  md = md.replace(/<figure[^>]*>(.*?)<\/figure>/gis, '$1\n\n');
  md = md.replace(/<figcaption[^>]*>(.*?)<\/figcaption>/gi, '*$1*\n\n');

  // Divs y spans (remover tags, mantener contenido)
  md = md.replace(/<div[^>]*>(.*?)<\/div>/gis, '$1\n');
  md = md.replace(/<span[^>]*>(.*?)<\/span>/gi, '$1');

  // Limpiar tags restantes
  md = md.replace(/<[^>]+>/g, '');

  // Decodificar entidades HTML comunes
  md = md.replace(/&nbsp;/g, ' ');
  md = md.replace(/&amp;/g, '&');
  md = md.replace(/&lt;/g, '<');
  md = md.replace(/&gt;/g, '>');
  md = md.replace(/&quot;/g, '"');
  md = md.replace(/&#8217;/g, "'");
  md = md.replace(/&#8220;/g, '"');
  md = md.replace(/&#8221;/g, '"');
  md = md.replace(/&#8211;/g, '–');
  md = md.replace(/&#8212;/g, '—');

  // Limpiar espacios y líneas múltiples
  md = md.replace(/\n{3,}/g, '\n\n');
  md = md.replace(/[ \t]+\n/g, '\n');

  return md.trim();
}

export const GET: APIRoute = async ({ params, request }) => {
  const { slug } = params;

  if (!slug) {
    return new Response('Slug no proporcionado', { status: 400 });
  }

  try {
    const post = await getPostBySlug(slug);

    if (!post) {
      return new Response('Artículo no encontrado', { status: 404 });
    }

    const title = stripHtml(post.title.rendered);
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    const articleUrl = `${baseUrl}/growth/${slug}/`;

    // Construir el Markdown
    const markdown = `# ${title}

${post.meta_description || stripHtml(post.excerpt.rendered)}

---

${htmlToMarkdown(post.content.rendered)}

---

**Fuente:** [${articleUrl}](${articleUrl})

**Autor:** ${post.author_name}

**Fecha:** ${new Date(post.date).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })}
`;

    return new Response(markdown, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': `inline; filename="${slug}.md"`,
      },
    });
  } catch (error) {
    console.error('Error al generar Markdown:', error);
    return new Response('Error interno del servidor', { status: 500 });
  }
};
