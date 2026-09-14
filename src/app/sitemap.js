const BASE_URL = 'https://cost2costsupplement.com'
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? `${BASE_URL}/api`

export const revalidate = 3600 // 1 ghanta

async function getItems(path) {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    const json = await res.json()
    return json.data ?? json.products ?? json ?? []
  } catch {
    return [] // API down ho to build fail na ho
  }
}

export default async function sitemap() {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
  ]

  const [products, categories] = await Promise.all([
    getItems('/products?limit=5000'),
    getItems('/categories'),
  ])

  const categoryPages = categories.map((c) => ({
    url: `${BASE_URL}/category/${c.slug}`,
    lastModified: c.updatedAt ? new Date(c.updatedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const productPages = products.map((p) => ({
    url: `${BASE_URL}/product/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticPages, ...categoryPages, ...productPages]
}