import "server-only"
import { cookies as nextCookies } from "next/headers"
export const getAuthHeaders = async (): Promise<
  { authorization: string } | {}
> => {
  const token = (await nextCookies()).get("_medusa_jwt")?.value

  if (token) {
    return { authorization: `Bearer ${token}` }
  }

  return {}
}

export const getCacheTag = async (tag: string): Promise<string> => {
  try {
    const cookies = await nextCookies()
    const cacheId = cookies.get("_medusa_cache_id")?.value

    if (!cacheId) {
      return ""
    }

    return `${tag}-${cacheId}`
  } catch (error) {
    return ""
  }
}
export const getCacheOptions = async (
  tag: string
): Promise<{ tags: string[] } | {}> => {
  if (typeof window !== "undefined") {
    return {}
  }

  const cacheTag = await getCacheTag(tag)

  if (!cacheTag) {
    return {}
  }

  return { tags: [`${cacheTag}`] }
}
export const setAuthToken = async (token: string) => {
  return (await nextCookies()).set("_medusa_jwt", token, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  })
}

export const removeAuthToken = async () => {
  return (await nextCookies()).set("_medusa_jwt", "", {
    maxAge: -1,
  })
}

export const getCartId = async () => {
  return (await nextCookies()).get("_medusa_cart_id")?.value
}

export const setCartId = async (cartId: string) => {
  return (await nextCookies()).set("_medusa_cart_id", cartId, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  })
}

export const removeCartId = async () => {
  return (await nextCookies()).set("_medusa_cart_id", "", { maxAge: -1 })
}