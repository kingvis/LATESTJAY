import React, { useEffect, useRef, useState } from 'react';
import { COURSES } from '../../constants';
import { Course } from '../../types';
import { CourseCard } from '../CourseCard';
import { CourseDetailModal } from '../CourseDetailModal';
import { SearchIcon } from '../Icons';

const useAnimateOnScroll = (threshold = 0.1) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [threshold]);

    return [ref, isVisible] as const;
};


export const CoursesPage = () => {
  const [coursesRef, coursesVisible] = useAnimateOnScroll();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState(COURSES);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = COURSES.filter(course =>
      course.title.toLowerCase().includes(lowercasedFilter) ||
      course.category.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredCourses(filteredData);
  }, [searchTerm]);

  const handleLearnMore = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
  };
  
  return (
    <div className="py-16 md:py-24 overflow-x-hidden min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">Explore Our <span className="text-primary">Courses</span></h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            From classical traditions to modern genres, we offer a comprehensive range of courses for every aspiring artist.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12 max-w-2xl mx-auto">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <SearchIcon className="h-5 w-5 text-muted-foreground" />
            </span>
            <input
              type="text"
              placeholder="Search by name or category (e.g., Piano, Vocal)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card/50 backdrop-blur-sm border border-border rounded-full py-3 pl-12 pr-4 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all"
              aria-label="Search courses"
            />
          </div>
        </div>

        <section 
          ref={coursesRef}
          className={`transition-all duration-1000 ease-out ${coursesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          {filteredCourses.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredCourses.map((course, index) => (
                <div 
                  key={course.title} 
                  className="transition-all duration-500 ease-out"
                  style={{ transitionDelay: `${index * 50}ms`}}
                >
                   <CourseCard course={course} onLearnMore={handleLearnMore} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold text-foreground">No Courses Found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your search terms.</p>
            </div>
          )}
        </section>
      </div>
      <CourseDetailModal course={selectedCourse} onClose={handleCloseModal} />
    </div>
  );
};