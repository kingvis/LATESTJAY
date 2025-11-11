import React, { useEffect, useRef } from 'react';
import { Course } from '../types';
import { CloseIcon } from './Icons';
import { NavLink } from 'react-router-dom';

interface CourseDetailModalProps {
  course: Course | null;
  onClose: () => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({ course, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (course && dialog) {
      dialog.showModal();
    } else if (dialog) {
      dialog.close();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            onClose();
        }
    };
    
    dialog?.addEventListener('keydown', handleKeyDown);

    return () => {
        dialog?.removeEventListener('keydown', handleKeyDown);
    }

  }, [course, onClose]);
  
  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) {
        onClose();
    }
  };


  if (!course) return null;

  return (
    <dialog 
        ref={dialogRef} 
        onClick={handleBackdropClick}
        className="backdrop:bg-black/60 bg-transparent p-0 w-full max-w-lg rounded-lg"
    >
        <div className="bg-card/90 backdrop-blur-xl border border-border rounded-lg shadow-2xl">
            <div className="p-6 md:p-8">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-3xl font-bold text-foreground">{course.title}</h2>
                        <p className="text-primary font-semibold">{course.category}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Close course details"
                    >
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </div>

                <div className="space-y-6 text-muted-foreground">
                    <p>{course.description}</p>

                    <div>
                        <h3 className="font-semibold text-foreground mb-2">Instructor</h3>
                        <p>{course.instructor}</p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-2">Schedule</h3>
                        <p>{course.schedule}</p>
                    </div>
                    
                    <div>
                        <h3 className="font-semibold text-foreground mb-2">Prerequisites</h3>
                        <ul className="list-disc list-inside space-y-1">
                            {course.prerequisites.map((req, index) => (
                                <li key={index}>{req}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-8 text-center">
                     <NavLink
                        onClick={onClose}
                        to={`/enroll?course=${encodeURIComponent(course.title)}`}
                        className="inline-block bg-primary text-primary-foreground font-bold py-3 px-8 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-primary/20"
                    >
                        Enroll Now
                    </NavLink>
                </div>
            </div>
        </div>
    </dialog>
  );
};