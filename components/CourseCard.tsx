import React from 'react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  onLearnMore: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onLearnMore }) => {
  return (
    <div className="bg-card/50 backdrop-blur-sm p-6 rounded-lg border border-border shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-primary/20 group hover:border-primary">
      <div className="flex items-center justify-center h-16 w-16 mb-4 rounded-full bg-accent border-2 border-border transition-all duration-300 group-hover:border-primary group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20">
        {course.icon}
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">{course.title}</h3>
      <p className="text-muted-foreground">{course.description}</p>
      <button 
        onClick={() => onLearnMore(course)}
        className="inline-flex items-center gap-1 mt-4 text-primary font-semibold"
      >
        Learn More 
        <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
      </button>
    </div>
  );
};