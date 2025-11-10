
import React from 'react';
import { Course, Testimonial, Faculty } from './types';
import { PianoIcon, GuitarIcon, VocalIcon, DanceIcon, ExamIcon } from './components/Icons';

export const COURSES: Course[] = [
  { title: 'Piano', category: 'Instrument', description: 'Master the keys from classical to contemporary.', icon: <PianoIcon />, level: 'Beginner', imageUrl: 'https://images.unsplash.com/photo-1520444459464-ab3103254e38?q=80&w=2070&auto=format&fit=crop' },
  { title: 'Keyboard', category: 'Instrument', description: 'Explore versatile sounds and modern techniques.', icon: <PianoIcon /> },
  { title: 'Guitar', category: 'Instrument', description: 'Strum your way from basics to complex solos.', icon: <GuitarIcon /> },
  { title: 'Carnatic Vocal', category: 'Vocal', description: 'Embrace the rich tradition of classical Indian singing.', icon: <VocalIcon /> },
  { title: 'Western Vocal', category: 'Vocal', description: 'Train your voice for pop, rock, and more.', icon: <VocalIcon /> },
  { title: 'Classical Dance', category: 'Dance', description: 'Learn the graceful forms of Bharatanatyam.', icon: <DanceIcon /> },
  { title: 'Western Dance', category: 'Dance', description: 'Move to the beat with Hip-Hop and Contemporary.', icon: <DanceIcon /> },
  { title: 'Exam Preparation', category: 'Training', description: 'Ace your Trinity & ABRSM exams with expert guidance.', icon: <ExamIcon /> },
];

export const TESTIMONIALS: Testimonial[] = [
  { name: 'Priya S.', course: 'Piano', quote: 'The instructors are incredibly patient and skilled. I have learned so much in just a few months!', avatar: 'https://picsum.photos/100/100?random=1' },
  { name: 'Rohan K.', course: 'Guitar', quote: 'Jay Music Academy has a fantastic learning environment. The AI assistant helped me pick the perfect course!', avatar: 'https://picsum.photos/100/100?random=2' },
  { name: 'Anjali M.', course: 'Carnatic Vocal', quote: 'A truly authentic experience. The dedication of the gurus here is unparalleled. Highly recommended.', avatar: 'https://picsum.photos/100/100?random=3' },
];

export const FACULTY: Faculty[] = [
    { name: 'Mr. Jayachandran', role: 'Founder & Director', experience: '25+ years in music education and performance.', imageUrl: 'https://picsum.photos/400/400?random=4' },
    { name: 'Ms. Vidya', role: 'Head of Vocals', experience: 'Renowned Carnatic vocalist with 15 years of teaching experience.', imageUrl: 'https://picsum.photos/400/400?random=5' },
    { name: 'Mr. David', role: 'Lead Guitarist', experience: 'Expert in rock, blues, and jazz guitar. Trinity Grade 8 certified.', imageUrl: 'https://picsum.photos/400/400?random=6' },
    { name: 'Ms. Swathi', role: 'Dance Choreographer', experience: 'Specializes in Bharatanatyam and contemporary dance forms.', imageUrl: 'https://picsum.photos/400/400?random=7' },
];