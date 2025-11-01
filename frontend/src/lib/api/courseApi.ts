import { API_URL } from "@/config";
import { getToken } from "@/lib/auth";

interface CourseData {
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


class CourseAPI {
  async getAll(params?: { categoryId?: string; level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"; tutorId?: string }) {
    try {
      const searchParams = new URLSearchParams();
      if (params?.categoryId) searchParams.append("categoryId", params.categoryId);
      if (params?.level) searchParams.append("level", params.level);
      if (params?.tutorId) searchParams.append("tutorId", params.tutorId);

      const response = await fetch(`${API_URL}/api/course/all?${searchParams}`, {
        headers: {
          "Content-Type": "application/json",
          ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch courses");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw new Error(error instanceof Error ? error.message : "Failed to fetch courses");
    }
  }

  async getById(id: string) {
    try {
      const response = await fetch(`${API_URL}/api/course/course/${id}`, {
        headers: {
          "Content-Type": "application/json",
          ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch course");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw new Error(error instanceof Error ? error.message : "Failed to fetch course");
    }
  }



  async deleteById(id: string) {
    try {
      const response = await fetch(`${API_URL}/api/course/deleteCourse/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete course");
      }
      
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw new Error(error instanceof Error ? error.message : "Failed to delete course");
    }
  }

  async update(id: string, data: Partial<CourseData>) {
    try {
      const response = await fetch(`${API_URL}/api/course/updateCourse/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update course");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("API Error:", error);
      throw new Error(error instanceof Error ? error.message : "Failed to update course");
    }
  }

  async create(data: CourseData) {
    try {
      const response = await fetch(`${API_URL}/api/course/createCourse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create course");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("API Error:", error);
      throw new Error(error instanceof Error ? error.message : "Failed to create course");
    }
  }
}

export const courseApi = new CourseAPI();
export default courseApi;