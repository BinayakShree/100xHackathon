import { API_URL } from "@/config";
import { getToken } from "@/lib/auth";

interface ExperienceData {
  title: string;
  description: string;
  price: number;
  duration: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  location?: string;
  prerequisite?: string;
  categoryId: string;
  photos: string[];
}

interface ReviewData {
  rating: number;
  comment: string;
}

class ExperienceAPI {
  async getAll(params?: { categoryId?: string; search?: string }) {
    try {
      const searchParams = new URLSearchParams();
      if (params?.categoryId) searchParams.append("categoryId", params.categoryId);
      if (params?.search) searchParams.append("search", params.search);

      const response = await fetch(`${API_URL}/experiences?${searchParams}`, {
        headers: {
          "Content-Type": "application/json",
          ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
        }
      });

      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const error = await response.json();
          throw new Error(error.message || "Failed to fetch experiences");
        } else {
          const text = await response.text();
          console.error("Non-JSON error response:", text);
          throw new Error("Server returned an invalid response");
        }
      }

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Invalid content type:", contentType, "Response:", text);
        throw new Error("Server returned an invalid response format");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw new Error(error instanceof Error ? error.message : "Failed to fetch experiences");
    }
  }

  async getById(id: string) {
    try {
      const response = await fetch(`${API_URL}/experiences/${id}`, {
        headers: {
          "Content-Type": "application/json",
          ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
        }
      });

      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const error = await response.json();
          throw new Error(error.message || "Failed to fetch experience");
        } else {
          const text = await response.text();
          console.error("Non-JSON error response:", text);
          throw new Error("Server returned an invalid response");
        }
      }

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Invalid content type:", contentType, "Response:", text);
        throw new Error("Server returned an invalid response format");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw new Error(error instanceof Error ? error.message : "Failed to fetch experience");
    }
  }

  async addReview(experienceId: string, data: ReviewData) {
    try {
      const response = await fetch(`${API_URL}/experiences/${experienceId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const error = await response.json();
          throw new Error(error.message || "Failed to add review");
        } else {
          const text = await response.text();
          console.error("Non-JSON error response:", text);
          throw new Error("Server returned an invalid response");
        }
      }

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Invalid content type:", contentType, "Response:", text);
        throw new Error("Server returned an invalid response format");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("API Error:", error);
      throw new Error(error instanceof Error ? error.message : "Failed to add review");
    }
  }

  async searchByTutor(tutorId: string) {
    try {
      const response = await fetch(`${API_URL}/experiences/tutor/${tutorId}`, {
        headers: {
          "Content-Type": "application/json",
          ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
        }
      });

      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const error = await response.json();
          throw new Error(error.message || "Failed to fetch tutor experiences");
        } else {
          const text = await response.text();
          console.error("Non-JSON error response:", text);
          throw new Error("Server returned an invalid response");
        }
      }

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Invalid content type:", contentType, "Response:", text);
        throw new Error("Server returned an invalid response format");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw new Error(error instanceof Error ? error.message : "Failed to fetch tutor experiences");
    }
  }

  async deleteById(id: string) {
    try {
      const response = await fetch(`${API_URL}/experiences/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        }
      });

      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const error = await response.json();
          throw new Error(error.message || "Failed to delete experience");
        } else {
          const text = await response.text();
          console.error("Non-JSON error response:", text);
          throw new Error("Server returned an invalid response");
        }
      }

      // For DELETE operations, we might get no content response
      if (response.status === 204) {
        return;
      }

      if (contentType && !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Invalid content type:", contentType, "Response:", text);
        throw new Error("Server returned an invalid response format");
      }

      if (contentType?.includes("application/json")) {
        return response.json();
      }
    } catch (error) {
      console.error("API Error:", error);
      throw new Error(error instanceof Error ? error.message : "Failed to delete experience");
    }
  }

  async update(id: string, data: Partial<ExperienceData>) {
    try {
      const response = await fetch(`${API_URL}/experiences/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(data)
      });

      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const error = await response.json();
          throw new Error(error.message || "Failed to update experience");
        } else {
          const text = await response.text();
          console.error("Non-JSON error response:", text);
          throw new Error("Server returned an invalid response");
        }
      }

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Invalid content type:", contentType, "Response:", text);
        throw new Error("Server returned an invalid response format");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("API Error:", error);
      throw new Error(error instanceof Error ? error.message : "Failed to update experience");
    }
  }

  async create(data: ExperienceData) {
    try {
      const response = await fetch(`${API_URL}/experiences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(data)
      });

      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const error = await response.json();
          throw new Error(error.message || "Failed to create experience");
        } else {
          const text = await response.text();
          console.error("Non-JSON error response:", text);
          throw new Error("Server returned an invalid response");
        }
      }

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Invalid content type:", contentType, "Response:", text);
        throw new Error("Server returned an invalid response format");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("API Error:", error);
      throw new Error(error instanceof Error ? error.message : "Failed to create experience");
    }
  }
}

export const experienceApi = new ExperienceAPI();