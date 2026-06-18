import type { InstagramFeedResponse, StalkeaResponse } from '~/types/instagram'
import { CacheService } from './cache.service'

export class StalkeaService {
    // Use local API proxy
    private static readonly BASE_URL = '/api'

    static async getProfile(username: string): Promise<StalkeaResponse> {
        // Check cache first
        const cacheKey = `profile_${username.toLowerCase()}`
        const cachedData = CacheService.get<StalkeaResponse>(cacheKey)

        if (cachedData) {
            console.log(`CacheService: Returning cached profile for ${username}`)
            return cachedData
        }

        try {
            const response = await fetch(`${this.BASE_URL}/instagram?username=${username}`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error('Failed to fetch profile')
            }

            const json = await response.json() as StalkeaResponse

            // Cache the successful response
            CacheService.set(cacheKey, json)
            console.log(`CacheService: Cached profile for ${username}`)

            return json
        } catch (error) {
            console.error('StalkeaService Error:', error)
            throw error
        }
    }
    static async getProfileFeed(username: string): Promise<InstagramFeedResponse> {
        // Check cache first
        const cacheKey = `feed_${username.toLowerCase()}`
        const cachedData = CacheService.get<InstagramFeedResponse>(cacheKey)

        if (cachedData) {
            console.log(`CacheService: Returning cached feed for ${username}`)
            return cachedData
        }

        try {
            const response = await fetch(`${this.BASE_URL}/instagram-feed?username=${username}`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error('Failed to fetch profile feed')
            }

            const json = await response.json() as InstagramFeedResponse

            // Cache the successful response
            CacheService.set(cacheKey, json)
            console.log(`CacheService: Cached feed for ${username}`)

            return json
        } catch (error) {
            console.error('StalkeaService Error:', error)
            throw error
        }
    }
}
