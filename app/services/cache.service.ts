interface CacheEntry<T> {
    data: T
    timestamp: number
    ttl: number
}

export class CacheService {
    private static readonly PREFIX = 'stalkea_cache_'
    private static readonly DEFAULT_TTL = (60 * 60 * 1000) // 1 hour in milliseconds

    /**
     * Store data in cache with TTL
     * @param key Cache key
     * @param data Data to cache
     * @param ttl Time to live in milliseconds (default: 1 hour)
     */
    static set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
        try {
            const entry: CacheEntry<T> = {
                data,
                timestamp: Date.now(),
                ttl
            }

            const fullKey = this.PREFIX + key
            localStorage.setItem(fullKey, JSON.stringify(entry))
        } catch (error) {
            console.error('CacheService: Failed to set cache', error)
            // Handle quota exceeded or other storage errors
            this.clearExpired()
        }
    }

    /**
     * Get data from cache if not expired
     * @param key Cache key
     * @returns Cached data or null if not found/expired
     */
    static get<T>(key: string): T | null {
        try {
            const fullKey = this.PREFIX + key
            const item = localStorage.getItem(fullKey)

            if (!item) return null

            const entry: CacheEntry<T> = JSON.parse(item)
            const now = Date.now()

            // Check if expired
            if (now - entry.timestamp > entry.ttl) {
                this.remove(key)
                return null
            }

            return entry.data
        } catch (error) {
            console.error('CacheService: Failed to get cache', error)
            return null
        }
    }

    /**
     * Remove a specific cache entry
     * @param key Cache key
     */
    static remove(key: string): void {
        try {
            const fullKey = this.PREFIX + key
            localStorage.removeItem(fullKey)
        } catch (error) {
            console.error('CacheService: Failed to remove cache', error)
        }
    }

    /**
     * Clear all cache entries
     */
    static clear(): void {
        try {
            const keys = Object.keys(localStorage)
            keys.forEach(key => {
                if (key.startsWith(this.PREFIX)) {
                    localStorage.removeItem(key)
                }
            })
        } catch (error) {
            console.error('CacheService: Failed to clear cache', error)
        }
    }

    /**
     * Remove expired cache entries
     */
    static clearExpired(): void {
        try {
            const keys = Object.keys(localStorage)
            const now = Date.now()

            keys.forEach(key => {
                if (key.startsWith(this.PREFIX)) {
                    try {
                        const item = localStorage.getItem(key)
                        if (item) {
                            const entry: CacheEntry<any> = JSON.parse(item)
                            if (now - entry.timestamp > entry.ttl) {
                                localStorage.removeItem(key)
                            }
                        }
                    } catch {
                        // Invalid entry, remove it
                        localStorage.removeItem(key)
                    }
                }
            })
        } catch (error) {
            console.error('CacheService: Failed to clear expired cache', error)
        }
    }

    /**
     * Check if a key exists and is not expired
     * @param key Cache key
     */
    static has(key: string): boolean {
        return this.get(key) !== null
    }
}
