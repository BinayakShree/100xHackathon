export interface Experience {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  location: string;
  photos: Photo[];
  category: Category;
  tutor: Tutor;
  rating: number;
  reviewCount: number;
  prerequisites: string;
  reviews: Review[];
}

export interface Photo {
  url: string;
}

export interface Category {
  name: string;
}

export interface Tutor {
  name: string;
  bio: string;
  photo: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
  };
}