
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon } from './Icons';

export const Footer = () => {
  return (
    <footer className="bg-background/80 backdrop-blur-sm border-t border-border text-muted-foreground">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <h3 className="text-2xl font-bold text-foreground">Jay Music Academy</h3>
            <p className="text-muted-foreground text-base">
              Nurturing musical talent with passion and expertise. Join us to begin your musical journey.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-secondary transition-colors">
                <span className="sr-only">Facebook</span>
                <FacebookIcon className="h-6 w-6" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-secondary transition-colors">
                <span className="sr-only">Instagram</span>
                <InstagramIcon className="h-6 w-6" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-secondary transition-colors">
                <span className="sr-only">Twitter</span>
                <TwitterIcon className="h-6 w-6" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-secondary transition-colors">
                <span className="sr-only">YouTube</span>
                <YoutubeIcon className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Quick Links</h3>
                <ul className="mt-4 space-y-4">
                  <li><NavLink to="/about" className="text-base text-muted-foreground hover:text-foreground">About</NavLink></li>
                  <li><NavLink to="/courses" className="text-base text-muted-foreground hover:text-foreground">Courses</NavLink></li>
                  <li><NavLink to="/branches" className="text-base text-muted-foreground hover:text-foreground">Branches</NavLink></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Support</h3>
                <ul className="mt-4 space-y-4">
                  <li><NavLink to="/contact" className="text-base text-muted-foreground hover:text-foreground">Contact Us</NavLink></li>
                  <li><a href="#" className="text-base text-muted-foreground hover:text-foreground">Online Classes</a></li>
                  <li><a href="#" className="text-base text-muted-foreground hover:text-foreground">Enroll Now</a></li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-1 md:gap-8">
               <div>
                <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Contact</h3>
                <ul className="mt-4 space-y-4">
                  <li><p className="text-base text-muted-foreground">info@jaymusicacademy.com</p></li>
                  <li><p className="text-base text-muted-foreground">+91 12345 67890</p></li>
                  <li><p className="text-base text-muted-foreground">Thiruninravur & Kattupakkam</p></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-base text-muted-foreground xl:text-center">&copy; {new Date().getFullYear()} Jay Music Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};