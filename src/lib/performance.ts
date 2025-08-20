// Utilitários para otimização de performance

// Debounce function para otimizar chamadas de API
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function para limitar frequência de execução
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Lazy loading para imagens
export function lazyLoadImage(img: HTMLImageElement, src: string) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        img.src = src
        observer.unobserve(img)
      }
    })
  })
  observer.observe(img)
}

// Preload de recursos críticos
export function preloadResource(href: string, as: string = 'fetch') {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = href
  link.as = as
  document.head.appendChild(link)
}

// Cache de dados em localStorage
export function cacheData(key: string, data: any, ttl: number = 3600000) { // 1 hora padrão
  const item = {
    data,
    timestamp: Date.now(),
    ttl
  }
  localStorage.setItem(key, JSON.stringify(item))
}

export function getCachedData(key: string): any | null {
  const item = localStorage.getItem(key)
  if (!item) return null
  
  const { data, timestamp, ttl } = JSON.parse(item)
  const now = Date.now()
  
  if (now - timestamp > ttl) {
    localStorage.removeItem(key)
    return null
  }
  
  return data
}

// Medição de performance
export function measurePerformance(name: string, fn: () => void) {
  const start = performance.now()
  fn()
  const end = performance.now()
  console.log(`${name} took ${end - start} milliseconds`)
}

// Otimização de scroll
export function optimizeScroll(callback: () => void, delay: number = 16) {
  let ticking = false
  
  return () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        callback()
        ticking = false
      })
      ticking = true
    }
  }
}
