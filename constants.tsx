import React from 'react';
import { Course, Testimonial, Faculty } from './types';
import { PianoIcon, GuitarIcon, VocalIcon, DanceIcon, ExamIcon } from './components/Icons';

export const COURSES: Course[] = [
  {
    title: 'Piano',
    category: 'Instrument',
    description: 'Master the keys from classical to contemporary.',
    icon: <PianoIcon />,
    level: 'Beginner',
    imageUrl: 'https://images.unsplash.com/photo-1520444459464-ab3103254e38?q=80&w=2070&auto=format&fit=crop',
    instructor: 'Ms. Clara Evans',
    schedule: 'Tue & Thu, 4:00 PM - 5:00 PM',
    prerequisites: ['No prior experience needed', 'Minimum age: 6 years']
  },
  {
    title: 'Keyboard',
    category: 'Instrument',
    description: 'Explore versatile sounds and modern techniques.',
    icon: <PianoIcon />,
    instructor: 'Mr. Jayachandran',
    schedule: 'Mon & Wed, 6:00 PM - 7:00 PM',
    prerequisites: ['Basic music reading is a plus', 'Access to a keyboard for practice']
  },
  {
    title: 'Guitar',
    category: 'Instrument',
    description: 'Strum your way from basics to complex solos.',
    icon: <GuitarIcon />,
    instructor: 'Mr. David',
    schedule: 'Flexible weekend batches',
    prerequisites: ['Own guitar required', 'Enthusiasm to learn!']
  },
  {
    title: 'Carnatic Vocal',
    category: 'Vocal',
    description: 'Embrace the rich tradition of classical Indian singing.',
    icon: <VocalIcon />,
    instructor: 'Ms. Vidya',
    schedule: 'Sat & Sun, 10:00 AM - 11:30 AM',
    prerequisites: ['Interest in classical music', 'Commitment to regular practice']
  },
  {
    title: 'Western Vocal',
    category: 'Vocal',
    description: 'Train your voice for pop, rock, and more.',
    icon: <VocalIcon />,
    instructor: 'Ms. Sarah Jones',
    schedule: 'Friday, 5:00 PM - 6:30 PM',
    prerequisites: ['Ability to sing in tune', 'Passion for contemporary music']
  },
  {
    title: 'Classical Dance',
    category: 'Dance',
    description: 'Learn the graceful forms of Bharatanatyam.',
    icon: <DanceIcon />,
    instructor: 'Ms. Swathi',
    schedule: 'Wednesday, 6:00 PM | Sunday, 9:00 AM',
    prerequisites: ['Minimum age: 7 years', 'Traditional attire required']
  },
  {
    title: 'Western Dance',
    category: 'Dance',
    description: 'Move to the beat with Hip-Hop and Contemporary.',
    icon: <DanceIcon />,
    instructor: 'Mr. Alex Chen',
    schedule: 'Saturday, 3:00 PM - 4:30 PM',
    prerequisites: ['Good physical fitness', 'Comfortable clothing and shoes']
  },
  {
    title: 'Exam Preparation',
    category: 'Training',
    description: 'Ace your Trinity & ABRSM exams with expert guidance.',
    icon: <ExamIcon />,
    instructor: 'Team of Certified Experts',
    schedule: 'Personalized one-on-one sessions',
    prerequisites: ['Currently enrolled in a course', 'Recommendation from instructor']
  },
];

export const TESTIMONIALS: Testimonial[] = [
  { name: 'Priya S.', course: 'Piano', quote: 'The instructors are incredibly patient and skilled. I have learned so much in just a few months!', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop' },
  { name: 'Rohan K.', course: 'Guitar', quote: 'Jay Music Academy has a fantastic learning environment. The AI assistant helped me pick the perfect course!', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop' },
  { name: 'Anjali M.', course: 'Carnatic Vocal', quote: 'A truly authentic experience. The dedication of the gurus here is unparalleled. Highly recommended.', avatar: 'https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop' },
];

export const FACULTY: Faculty[] = [
  { name: 'Jayanthi J', role: 'Founder & Director', experience: 'Passionate music educator leading Jay Music Academy.', imageUrl: 'https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?q=80&w=400&auto=format&fit=crop' },
  { name: 'Samson', role: 'Keyboard, Vocal & Guitar', experience: 'Multi-talented musician specializing in keyboard, vocals, and guitar.', imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop' },
  { name: 'Jagan', role: 'Drums Instructor', experience: 'Professional drummer with expertise in various drumming styles.', imageUrl: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?q=80&w=400&auto=format&fit=crop' },
  { name: 'Santhosh', role: 'Dance Instructor', experience: 'Skilled choreographer with passion for dance education.', imageUrl: 'https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=400&auto=format&fit=crop' },
];