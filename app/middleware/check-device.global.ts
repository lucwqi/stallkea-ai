/**
 * Global middleware to detect device type and restrict access to mobile devices only
 */
export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return
  if (import.meta.dev) return

  if (to.path === '/mobile-only') return

  const userAgent = navigator.userAgent
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)

  
})
