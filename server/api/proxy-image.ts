export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const url = query.url as string

    if (!url) {
        throw createError({
            statusCode: 400,
            statusMessage: 'URL is required'
        })
    }

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7',
                'Origin': 'https://stalkea.ai',
                'Referer': 'https://stalkea.ai/'
            }
        })

        if (!response.ok) {
            throw createError({
                statusCode: response.status,
                statusMessage: 'Failed to fetch image'
            })
        }

        // Forward important headers
        const contentType = response.headers.get('content-type')
        if (contentType) {
            setHeader(event, 'Content-Type', contentType)
        }

        // Cache control - cache for a long time as these are static assets
        setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')

        const arrayBuffer = await response.arrayBuffer()
        return Buffer.from(arrayBuffer)
    } catch (error) {
        console.error('Proxy error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error fetching image'
        })
    }
})
