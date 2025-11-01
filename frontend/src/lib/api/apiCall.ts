interface ApiCallOptions extends RequestInit {
  skipAuth?: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

const apiCall = async (endpoint: string, options: ApiCallOptions = {}) => {
  const { skipAuth = false, ...fetchOptions } = options;

  // Prepare headers
  const headers = new Headers(fetchOptions.headers || {});
  headers.set('Content-Type', 'application/json');

  // Add auth token if available and not skipped
  if (!skipAuth) {
    const token = getAuthToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  // Prepare the request
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  const request = new Request(url, {
    ...fetchOptions,
    headers,
  });

  try {
    const response = await fetch(request);
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      throw new ApiError(
        data.message || 'An error occurred',
        response.status,
        data.code,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors or other issues
    if (error instanceof Error) {
      throw new ApiError(
        'Network error or server is unreachable',
        0,
        'NETWORK_ERROR',
        error
      );
    }

    throw new ApiError('An unknown error occurred', 0, 'UNKNOWN_ERROR');
  }
};

export default apiCall;