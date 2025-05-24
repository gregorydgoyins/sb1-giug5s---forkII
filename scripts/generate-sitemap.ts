import { writeFileSync } from 'fs';
import { globby } from 'globby';
import prettier from 'prettier';

async function generateSitemap() {
  const prettierConfig = await prettier.resolveConfig('./.prettierrc');
  const pages = await globby([
    'src/app/**/*.tsx',
    '!src/app/**/_*.tsx',
    '!src/app/**/layout.tsx',
    '!src/app/**/loading.tsx',
    '!src/app/**/error.tsx',
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages
        .map((page) => {
          const path = page
            .replace('src/app', '')
            .replace('/page.tsx', '')
            .replace('/index.tsx', '');
          return `
            <url>
              <loc>${siteUrl}${path}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>daily</changefreq>
              <priority>0.7</priority>
            </url>
          `;
        })
        .join('')}
    </urlset>
  `;

  const formatted = prettier.format(sitemap, {
    ...prettierConfig,
    parser: 'html',
  });

  writeFileSync('public/sitemap.xml', formatted);
}

generateSitemap();