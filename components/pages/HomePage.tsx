import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { COURSES, TESTIMONIALS } from '../../constants';
import { Course } from '../../types';
import { CourseCard } from '../CourseCard';
import { BackgroundPaths } from '../ui/background-paths';
import { AnimatedTestimonials } from '../ui/animated-testimonials';
import { CourseDetailModal } from '../CourseDetailModal';

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


export const HomePage = () => {
  const [coursesRef, coursesVisible] = useAnimateOnScroll();
  const [testimonialsRef, testimonialsVisible] = useAnimateOnScroll();
  const [ctaRef, ctaVisible] = useAnimateOnScroll();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  const formattedTestimonials = TESTIMONIALS.map(t => ({
      quote: t.quote,
      name: t.name,
      designation: `${t.course} Student`,
      src: t.avatar,
  }));

  const handleLearnMore = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
  };

  return (
    <div className="space-y-24 md:space-y-32 pb-24 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] -mt-16 flex items-center justify-center">
         <BackgroundPaths 
            title="Jay Music Academy"
            subTitle="Unleash Your Inner Musician"
          />
      </section>

      {/* Featured Courses */}
      <section 
        id="featured-courses"
        ref={coursesRef}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ease-out ${coursesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
          Our Popular Programs
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {COURSES.slice(0, 4).map((course, index) => (
            <div 
              key={course.title} 
              className="transition-all duration-500 ease-out"
              style={{ transitionDelay: `${index * 100}ms`}}
            >
               <CourseCard course={course} onLearnMore={handleLearnMore} />
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
            <NavLink 
              to="/courses"
              className="inline-block bg-secondary text-secondary-foreground font-bold py-3 px-8 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-secondary/20"
            >
              View All Courses
            </NavLink>
        </div>
      </section>

      {/* Testimonials */}
      <section 
        ref={testimonialsRef}
        className={`transition-all duration-1000 ease-out ${testimonialsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
          What Our Students Say
        </h2>
        <AnimatedTestimonials testimonials={formattedTestimonials} autoplay />
      </section>
      
       {/* CTA Section */}
      <section 
        ref={ctaRef}
        className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-1000 ease-out ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="bg-gradient-to-r from-primary/30 to-secondary/30 p-8 md:p-12 rounded-lg border border-border">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Start Learning?</h2>
            <p className="text-muted-foreground text-lg mb-8">
                Book a free demo class or enroll today to join our vibrant community of artists.
            </p>
            <NavLink
                to="/enroll"
                className="inline-block bg-primary text-primary-foreground font-bold py-3 px-8 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-primary/20"
            >
                Enroll Now
            </NavLink>
        </div>
      </section>

      <CourseDetailModal course={selectedCourse} onClose={handleCloseModal} />
    </div>
  );
};