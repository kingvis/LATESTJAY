
import React from 'react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="bg-card/50 backdrop-blur-sm p-6 rounded-lg border border-border shadow-lg transform transition-all duration-500 hover:-translate-y-2 hover:shadow-primary/20 group hover:border-primary">
      <div className="flex items-center justify-center h-16 w-16 mb-4 rounded-full bg-accent border-2 border-border transition-all duration-500 group-hover:border-primary group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20">
        {course.icon}
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">{course.title}</h3>
      <p className="text-muted-foreground">{course.description}</p>
      <a href="#/courses" className="inline-block mt-4 text-secondary-foreground font-semibold hover:text-secondary-foreground/80 transition-colors">
        Learn More &rarr;
      </a>
    </div>
  );
};