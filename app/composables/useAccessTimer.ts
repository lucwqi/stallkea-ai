/**
 * Composable to manage the 5-minute access timer for feed access
 * Stores timestamp in localStorage and checks expiration
 */
export const useAccessTimer = () => {
    const STORAGE_KEY = 'stalkea_access_start'
    const ACCESS_DURATION_MS = 5 * 60 * 1000 // 5 minutes in milliseconds

    /**
     * Start the access timer by storing the current timestamp
     */
    const startAccessTimer = () => {
        if (typeof window !== 'undefined') {
            const now = Date.now()
            localStorage.setItem(STORAGE_KEY, now.toString())
        }
    }

    /**
     * Get the remaining time in milliseconds
     * Returns 0 if timer has expired or hasn't started
     */
    const getRemainingTime = (): number => {
        if (typeof window === 'undefined') return 0

        const startTime = localStorage.getItem(STORAGE_KEY)
        if (!startTime) return 0

        const elapsed = Date.now() - parseInt(startTime, 10)
        const remaining = ACCESS_DURATION_MS - elapsed

        return Math.max(0, remaining)
    }

    /**
     * Check if the access timer has expired
     * Returns true if expired or timer hasn't started
     */
    const isAccessExpired = (): boolean => {
        if (typeof window === 'undefined') return false

        const startTime = localStorage.getItem(STORAGE_KEY)
        if (!startTime) return true // No timer means no access granted

        const elapsed = Date.now() - parseInt(startTime, 10)
        return elapsed >= ACCESS_DURATION_MS
    }

    /**
     * Clear the access timer (for VIP users or reset)
     */
    const clearAccessTimer = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEY)
        }
    }

    /**
     * Check if timer has been started
     */
    const hasTimerStarted = (): boolean => {
        if (typeof window === 'undefined') return false
        return localStorage.getItem(STORAGE_KEY) !== null
    }

    return {
        startAccessTimer,
        getRemainingTime,
        isAccessExpired,
        clearAccessTimer,
        hasTimerStarted
    }
}
