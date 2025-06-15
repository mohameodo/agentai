export const addUTM = (url: string) => {
  try {
    // Check if the URL is valid
    const u = new URL(url)
    // Ensure it's using HTTP or HTTPS protocol
    if (!["http:", "https:"].includes(u.protocol)) {
      return url // Return original URL for non-http(s) URLs
    }

    u.searchParams.set("utm_source", "ai.nexiloop.com")
    u.searchParams.set("utm_medium", "research")
    return u.toString()
  } catch {
    // If URL is invalid, return the original URL without modification
    return url
  }
}

export const getFavicon = (url: string | null) => {
  if (!url) return null

  try {
    // Check if the URL is valid
    const urlObj = new URL(url)
    // Ensure it's using HTTP or HTTPS protocol
    if (!["http:", "https:"].includes(urlObj.protocol)) {
      return null
    }

    const domain = urlObj.hostname
    // Use a local icon or return null to avoid CSP issues
    return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`
  } catch {
    // No need to log errors for invalid URLs
    return null
  }
}

export const formatUrl = (url: string) => {
  try {
    return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")
  } catch {
    return url
  }
}

export const getSiteName = (url: string) => {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.replace(/^www\./, "")
  } catch {
    return url
  }
}
