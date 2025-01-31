'use client'

export const CLIENT_COOKIE_KEYS = {
  AUTH_TOKEN: '_medusa_jwt',
  CART_ID: '_medusa_cart_id',
  CACHE_ID: '_medusa_cache_id'
}

export const clientCookies = {
  getAuthToken: () => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith(CLIENT_COOKIE_KEYS.AUTH_TOKEN))
      ?.split('=')[1]
  },
  
  setAuthToken: (token: string) => {
    document.cookie = `${CLIENT_COOKIE_KEYS.AUTH_TOKEN}=${token}; max-age=${60 * 60 * 24 * 7}; path=/; samesite=strict; ${process.env.NODE_ENV === 'production' ? 'secure' : ''}`
  },

  removeAuthToken: () => {
    document.cookie = `${CLIENT_COOKIE_KEYS.AUTH_TOKEN}=; max-age=-1; path=/`
  },

  getCartId: () => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith(CLIENT_COOKIE_KEYS.CART_ID))
      ?.split('=')[1]
  },

  setCartId: (cartId: string) => {
    document.cookie = `${CLIENT_COOKIE_KEYS.CART_ID}=${cartId}; max-age=${60 * 60 * 24 * 7}; path=/; samesite=strict; ${process.env.NODE_ENV === 'production' ? 'secure' : ''}`
  },

  removeCartId: () => {
    document.cookie = `${CLIENT_COOKIE_KEYS.CART_ID}=; max-age=-1; path=/`
  }
} 