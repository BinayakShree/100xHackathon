export interface Rating {
  id: string;
  value: number;
  comment?: string;
  userId: string;
  userName: string;
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  location?: string;
  prerequisite?: string;
  categoryId: string;
  photos: { url: string }[];
  tutorId?: string;
  ratings?: Rating[];
  createdAt: string;
  updatedAt: string;
}