const BASE_URL = 'https://cost2costsupplement.com'

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/cart',
          '/checkout',
          '/account',
          '/order/',
          '/_next/',
          '/*?*sort=',
          '/*?*page=',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}