export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const username = query.username as string

    if (!username) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Username is required'
        })
    }

    const config = useRuntimeConfig()

    try {
        const response: any = await $fetch('https://stalkea.ai/api/instagram.php', {
            method: 'GET',
            query: {
                tipo: 'busca_completa',
                username: username
            },
            headers: {
                'accept': 'application/json',
                'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                'content-type': 'application/json',
                'origin': 'https://stalkea.ai',
                'priority': 'u=1, i',
                'referer': 'https://stalkea.ai/',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        })

        // Sort posts by date (newest first) to ensure we always show the most recent ones
        if (response && Array.isArray(response.posts)) {
            response.posts.sort((a: any, b: any) => {
                const timeA = a.post?.taken_at || 0
                const timeB = b.post?.taken_at || 0
                return timeB - timeA
            })
        }

        return response
    } catch (error) {
        console.error('Proxy Error:', error)
        throw createError({
            statusCode: 502,
            statusMessage: 'Failed to fetch from upstream',
            data: error
        })
    }
})
