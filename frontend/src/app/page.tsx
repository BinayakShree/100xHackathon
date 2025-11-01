"use client";

import { useEffect, useState } from "react";
import HeroSection from "@/components/section/HeroSection";
import HighlightSection from "@/components/section/HighlightSection";
import CoursesCarousel from "@/components/section/CourseSection";
import AboutSection from "@/components/section/AboutSection";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { courseApi } from "@/lib/api/courseApi";
import { Course } from "@/types/course";

export default function Home() {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        const response = await courseApi.getAll();
        setFeaturedCourses(response.courses.slice(0, 6));
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCourses();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 m-3 space-y-10">
        {/* Hero Section */}
        <HeroSection />

   

        {/* About Section */}
        <AboutSection />

        {/* Categories Section */}
        <CoursesCarousel />

        {/* Highlights Section */}
        <HighlightSection />
      </main>

      <Footer />
    </div>
  );
}