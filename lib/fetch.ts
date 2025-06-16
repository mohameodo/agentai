export async function fetchClient(input: RequestInfo, init?: RequestInit) {
  const csrf = document.cookie
    .split("; ")
    .find((c) => c.startsWith("csrf_token="))
    ?.split("=")[1]

  const url = typeof input === 'string' ? input : input.url
  const isUserSpecific = url.includes('/user') || 
                         url.includes('/profile') || 
                         url.includes('/preferences') ||
                         url.includes('/auth') ||
                         url.includes('/chat')

  return fetch(input, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      "x-csrf-token": csrf || "",
      "Content-Type": "application/json",
      // Add cache-busting headers for user-specific requests
      ...(isUserSpecific && {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      })
    },
  })
}
