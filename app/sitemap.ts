import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXTAUTH_URL || 'https://salmi-series.vercel.app'
  const staticPages = ['', '/shop', '/bundles', '/about', '/track'].map(p => ({
    url: `${base}${p || '/'}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: p === '' ? 1 : 0.7,
  }))
  try {
    const products = await prisma.product.findMany({ select: { slug: true, updatedAt: true }, take: 500 })
    const productPages = products.map(p => ({
      url: `${base}/shop/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
    return [...staticPages, ...productPages]
  } catch {
    return staticPages
  }
}
