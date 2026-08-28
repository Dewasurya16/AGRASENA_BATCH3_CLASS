import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://agrasena-batch-3-class.vercel.app'
  const currentDate = new Date()

  const routes = [
    '',
    '/schedules',
    '/materials',
    '/paper-generator',
    '/templates',
    '/exam-prep',
    '/discussions',
    '/faq',
    '/tasks',
    '/showcase',
    '/snippets',
    '/quiz',
    '/announcements',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route === '' || route === '/schedules' || route === '/materials' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/materials' || route === '/paper-generator' || route === '/schedules' ? 0.9 : 0.7,
  }))
}
