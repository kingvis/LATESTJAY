import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { COURSES, TESTIMONIALS } from '../../constants';
import { CourseCard } from '../CourseCard';
import { BackgroundPaths } from '../ui/background-paths';

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
               <CourseCard course={course} />
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section 
        ref={testimonialsRef}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ease-out ${testimonialsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
          What Our Students Say
        </h2>
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial) => (
            <div key={testimonial.name} className="bg-card/50 p-6 rounded-lg border border-border">
              <p className="text-muted-foreground italic mb-4">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <img className="h-12 w-12 rounded-full object-cover" src={testimonial.avatar} alt={testimonial.name} />
                <div className="ml-4">
                  <p className="font-bold text-card-foreground">{testimonial.name}</p>
                  <p className="text-sm text-secondary">{testimonial.course} Student</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
       {/* CTA Section */}
      <section 
        ref={ctaRef}
        className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-1000 ease-out ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="bg-gradient-to-r from-primary/30 to-secondary-foreground/30 p-8 md:p-12 rounded-lg border border-border">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Start Learning?</h2>
            <p className="text-muted-foreground text-lg mb-8">
                Book a free demo class or enroll today to join our vibrant community of artists.
            </p>
            <NavLink
                to="/contact"
                className="inline-block bg-secondary-foreground text-secondary font-bold py-3 px-8 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-secondary/20"
            >
                Enroll Now
            </NavLink>
        </div>
      </section>

    </div>
  );
};