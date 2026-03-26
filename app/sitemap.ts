import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://credda-ulpgl.org'
  const locales = ['fr', 'en', 'sw']
  
  const routes = [
    '',
    '/about',
    '/research',
    '/clinical',
    '/publications',
    '/team',
    '/events',
    '/gallery',
    '/contact',
  ]

  const sitemapEntries: MetadataRoute.Sitemap = []

  routes.forEach((route) => {
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
      })
    })
  })

  return sitemapEntries
}
