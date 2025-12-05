/**
 * Temporary user ID management using localStorage
 * This can be replaced with proper authentication later
 */

const USER_ID_KEY = 'plant_garden_user_id'

export function getUserId(): string {
  if (typeof window === 'undefined') {
    // Server-side: return a default UUID (won't work with RLS, but prevents errors)
    return '00000000-0000-0000-0000-000000000000'
  }

  let userId = localStorage.getItem(USER_ID_KEY)
  
  if (!userId) {
    // Generate a new UUID for this user
    userId = crypto.randomUUID()
    localStorage.setItem(USER_ID_KEY, userId)
  }
  
  return userId
}

export function clearUserId(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_ID_KEY)
  }
}

