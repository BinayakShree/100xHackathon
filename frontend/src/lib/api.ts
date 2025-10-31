import { getToken } from './auth'

const API_BASE_URL = 'http://localhost:3000/api'

// Helper function to make authenticated API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = getToken()
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(errorData.error || errorData.message || 'Request failed')
  }

  return response.json()
}

// Course API calls
export const courseApi = {
  // Get all courses
  getAll: async (filters?: { categoryId?: string; level?: string; tutorId?: string }) => {
    const params = new URLSearchParams()
    if (filters?.categoryId) params.append('categoryId', filters.categoryId)
    if (filters?.level) params.append('level', filters.level)
    if (filters?.tutorId) params.append('tutorId', filters.tutorId)
    
    const query = params.toString()
    return apiCall(`/course/all${query ? `?${query}` : ''}`)
  },

  // Get course by ID
  getById: async (id: string) => {
    return apiCall(`/course/course/${id}`)
  },

  // Create course (tutor only)
  create: async (courseData: any) => {
    return apiCall('/course/createCourse', {
      method: 'POST',
      body: JSON.stringify(courseData),
    })
  },

  // Update course (tutor only)
  update: async (id: string, courseData: any) => {
    return apiCall(`/course/updateCourse/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    })
  },

  // Delete course (tutor only)
  delete: async (id: string) => {
    return apiCall(`/course/deleteCourse/${id}`, {
      method: 'DELETE',
    })
  },
}

// Booking API calls
export const bookingApi = {
  // Create booking (tourist only)
  create: async (bookingData: any) => {
    return apiCall('/booking', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    })
  },

  // Get tourist bookings
  getTouristBookings: async () => {
    return apiCall('/booking/tourist')
  },

  // Get tutor bookings
  getTutorBookings: async () => {
    return apiCall('/booking/tutor')
  },

  // Reschedule booking
  reschedule: async (id: string, bookingData: any) => {
    return apiCall(`/booking/${id}/reschedule`, {
      method: 'PUT',
      body: JSON.stringify(bookingData),
    })
  },

  // Tutor respond to booking
  tutorRespond: async (id: string, responseData: any) => {
    return apiCall(`/booking/${id}/respond`, {
      method: 'PUT',
      body: JSON.stringify(responseData),
    })
  },
}
