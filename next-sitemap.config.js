/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://sleektools.vercel.app',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ['/admin', '/admin/*'],
  additionalPaths: async config => [
    await config.transform(config, '/'),
    await config.transform(config, '/formatters'),
    await config.transform(config, '/validators'),
    await config.transform(config, '/converters'),
    await config.transform(config, '/generators'),
    await config.transform(config, '/utilities'),
    await config.transform(config, '/tools'),
    await config.transform(config, '/viewers'),
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
  },
  transform: async (config, path) => {
    // Custom priority based on path
    let priority = 0.7;
    let changefreq = 'weekly';

    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (
      path.includes('/formatters') ||
      path.includes('/validators') ||
      path.includes('/converters')
    ) {
      priority = 0.9;
      changefreq = 'weekly';
    } else if (path.includes('/generators') || path.includes('/utilities')) {
      priority = 0.8;
      changefreq = 'weekly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
