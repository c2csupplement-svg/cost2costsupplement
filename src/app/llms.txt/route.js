const BASE_URL = 'https://cost2costsupplement.com'
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? `${BASE_URL}/api`

export const revalidate = 86400

export async function GET() {
  let categories = []
  try {
    const res = await fetch(`${API_URL}/categories`, { next: { revalidate: 86400 } })
    if (res.ok) {
      const json = await res.json()
      categories = json.data ?? json ?? []
    }
  } catch {}

  const categoryLinks = categories
    .map((c) => `- [${c.name}](${BASE_URL}/category/${c.slug})`)
    .join('\n')

  const body = `# Cost 2 Cost Supplement

> Cost 2 Cost is an Indian direct-to-consumer sports nutrition brand by Devi Enterprises,
> selling protein, creatine, pre-workout and wellness supplements at transparent,
> close-to-cost pricing. Ships across India.

## Shop
- [All products](${BASE_URL}/shop)
${categoryLinks}

## Company
- [About](${BASE_URL}/about)
- [Contact](${BASE_URL}/contact)

## Policies
- [Shipping](${BASE_URL}/shipping-policy)
- [Returns and refunds](${BASE_URL}/refund-policy)
- [Privacy](${BASE_URL}/privacy-policy)
`

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}