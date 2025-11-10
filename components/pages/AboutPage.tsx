import React, { useEffect, useRef, useState } from 'react';
import { FACULTY } from '../../constants';

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

export const AboutPage = () => {
  const [storyRef, storyVisible] = useAnimateOnScroll();
  const [visionMissionRef, visionMissionVisible] = useAnimateOnScroll();
  const [facultyRef, facultyVisible] = useAnimateOnScroll();

  return (
    <div className="py-16 md:py-24 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Our Story */}
        <section 
          ref={storyRef}
          className={`text-center mb-20 transition-all duration-1000 ease-out ${storyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">About <span className="text-primary">Jay Music Academy</span></h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Founded with a passion for spreading the joy of music and dance, Jay Music Academy has been a cornerstone of arts education for over a decade. We believe in providing a nurturing environment where students of all ages can discover and hone their artistic talents.
          </p>
        </section>

        {/* Vision & Mission */}
        <section 
          ref={visionMissionRef} 
          className={`grid md:grid-cols-2 gap-12 mb-20 transition-all duration-1000 ease-out ${visionMissionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="bg-card/50 p-8 rounded-lg border border-border">
            <h2 className="text-3xl font-bold text-primary mb-4">Our Vision</h2>
            <p className="text-muted-foreground">
              To be a leading institution for arts education, recognized for our commitment to excellence, innovation, and fostering a lifelong love for music and dance in every student.
            </p>
          </div>
          <div className="bg-card/50 p-8 rounded-lg border border-border">
            <h2 className="text-3xl font-bold text-primary mb-4">Our Mission</h2>
            <p className="text-muted-foreground">
              To provide high-quality, personalized instruction across a diverse range of artistic disciplines. We aim to empower our students with the skills, confidence, and creativity to achieve their personal and professional goals.
            </p>
          </div>
        </section>

        {/* Faculty */}
        <section 
          ref={facultyRef}
          className={`transition-all duration-1000 ease-out ${facultyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <h2 className="text-4xl font-bold text-center text-foreground mb-12">Meet Our Instructors</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FACULTY.map((member) => (
              <div key={member.name} className="text-center group">
                <div className="relative w-full aspect-square mx-auto rounded-lg overflow-hidden mb-4 border-2 border-transparent group-hover:border-primary transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-primary/20">
                  <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
                </div>
                <h3 className="text-xl font-bold text-card-foreground">{member.name}</h3>
                <p className="text-primary font-semibold">{member.role}</p>
                <p className="text-muted-foreground text-sm mt-1">{member.experience}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};