import React from 'react';
import { Course } from '../types';
import { motion, useMotionValue, useTransform } from 'framer-motion';

interface CourseCardProps {
  course: Course;
  onLearnMore: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onLearnMore }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct * 200);
    y.set(yPct * 200);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="bg-card/50 backdrop-blur-sm p-6 rounded-lg border border-border shadow-lg group hover:border-primary relative overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div
        style={{ transform: "translateZ(50px)" }}
        className="flex items-center justify-center h-16 w-16 mb-4 rounded-full bg-accent border-2 border-border transition-all duration-300 group-hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/20"
      >
        {course.icon}
      </div>
      <h3
        style={{ transform: "translateZ(30px)" }}
        className="text-xl font-bold text-foreground mb-2"
      >
        {course.title}
      </h3>
      <p
        style={{ transform: "translateZ(20px)" }}
        className="text-muted-foreground"
      >
        {course.description}
      </p>
      <button
        onClick={() => onLearnMore(course)}
        style={{ transform: "translateZ(40px)" }}
        className="inline-flex items-center gap-1 mt-4 text-primary font-semibold"
      >
        Learn More
        <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
      </button>
    </motion.div>
  );
};