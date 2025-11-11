import React from 'react';

const IconWrapper: React.FC<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    />
);

export const PianoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <IconWrapper {...props}><path d="M19 15H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2Z"/><path d="M5 15V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v11"/><path d="M8 15v-4"/><path d="M12 15v-4"/><path d="M16 15v-4"/></IconWrapper>
);

export const GuitarIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <IconWrapper {...props}><path d="m12 12 4-4"/><path d="M12 8V5"/><path d="M16 8h3"/><circle cx="12" cy="12" r="10"/><path d="m4.3 16.5 3.6-2a2 2 0 0 1 2.8 0l3.6 2a2 2 0 0 0 2.8 0l3.6-2"/></IconWrapper>
);

export const VocalIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <IconWrapper {...props}><path d="M12 6.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z"/><path d="M15 13.5c0 1.5-1.5 3-3 3s-3-1.5-3-3"/><path d="M12 2v4.5"/><path d="M17 4.5 15 6"/><path d="m7 4.5 2 1.5"/></IconWrapper>
);

export const DanceIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <IconWrapper {...props}><path d="M12 3a3 3 0 0 0-3 3v12a2 2 0 0 0 2 2a2 2 0 0 0 2-2V6a3 3 0 0 0-3-3Z"/><path d="M4 8a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z"/><path d="M16 4h4"/></IconWrapper>
);

export const ExamIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <IconWrapper {...props}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m10 13-2 2 2 2"/><path d="m14 13 2 2-2 2"/></IconWrapper>
);

export const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <IconWrapper {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></IconWrapper>
);

export const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <IconWrapper {...props}><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></IconWrapper>
);

export const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <IconWrapper {...props} fill="currentColor" strokeWidth="0">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
    </IconWrapper>
);

export const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <IconWrapper {...props}><path d="M2.5 17a24.12 24.12 0 0 1 0-10C2.5 6 7.5 4 12 4s9.5 2 9.5 3a24.12 24.12 0 0 1 0 10c0 1-5 3-9.5 3s-9.5-2-9.5-3Z" /><path d="m10 8 5 4-5 4Z" /></IconWrapper>
);

export const ChatIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <IconWrapper {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></IconWrapper>
);

export const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <IconWrapper {...props}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></IconWrapper>
);

export const SendIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <IconWrapper {...props}><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></IconWrapper>
);

export const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <IconWrapper {...props}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></IconWrapper>
);

export const LocationMarkerIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <IconWrapper {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></IconWrapper>
);

export const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <IconWrapper {...props}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></IconWrapper>
);

export const MailIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <IconWrapper {...props}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></IconWrapper>
);

export const PhoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <IconWrapper {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></IconWrapper>
);

export const VideoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <IconWrapper {...props}><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></IconWrapper>
);

export const MagicWandIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <IconWrapper {...props}><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M14 15.05a4 4 0 0 1-3.05-3.05"/><path d="M10 9.05a4 4 0 0 1-3.05 3.05"/><path d="M9 10.05a4 4 0 0 1 3.05-3.05"/><path d="M5 14.05a4 4 0 0 1 3.05 3.05"/><path d="M19 4v2"/><path d="M21.25 6.25 19.8 7.7"/><path d="M17.7 19.8 19.15 21.25"/><path d="M2.75 6.25 4.2 7.7"/><path d="M4.85 17.7 3.4 19.15"/><path d="M12 2v2"/><path d="M12 20v2"/></IconWrapper>
);

export const BrainCircuitIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <IconWrapper {...props}><path d="M12 2a2.5 2.5 0 0 1 3 4.83"/><path d="M12 2a2.5 2.5 0 0 0-3 4.83"/><path d="M15.5 13.5a2.5 2.5 0 0 1 0 5"/><path d="M8.5 13.5a2.5 2.5 0 0 0 0 5"/><path d="M12 12a2.5 2.5 0 0 0-2.5 2.5V17a2.5 2.5 0 0 0 5 0v-2.5A2.5 2.5 0 0 0 12 12Z"/><path d="M14.12 11.88A2.5 2.5 0 0 0 15 9.5v-2a2.5 2.5 0 0 0-5 0v2a2.5 2.5 0 0 0 .88 1.88"/><path d="M21 12a2.5 2.5 0 0 1-3 4.83"/><path d="M21 12a2.5 2.5 0 0 0-3 4.83"/><path d="M3 12a2.5 2.5 0 0 0 3 4.83"/><path d="M3 12a2.5 2.5 0 0 1 3 4.83"/></IconWrapper>
);

export const MicrophoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <IconWrapper {...props}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></IconWrapper>
);

export const GlobeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <IconWrapper {...props}><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></IconWrapper>
);

export const MapPinIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <IconWrapper {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></IconWrapper>
);

export const UploadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <IconWrapper {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></IconWrapper>
);

export const SparklesIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <IconWrapper {...props}><path d="m12 3-1.9 4.2-4.1 1.9 4.1 1.9 1.9 4.2 1.9-4.2 4.1-1.9-4.1-1.9Z" /><path d="M5 21 3 17l-4-2 4-2 2-4 2 4 4 2-4 2Z"/><path d="M19 21 21 17l4-2-4-2-2-4-2 4-4 2 4 2Z"/></IconWrapper>
);

export const StopIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <IconWrapper {...props}><rect x="6" y="6" width="12" height="12" /></IconWrapper>
);

export const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <IconWrapper {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></IconWrapper>
);

export const LogOutIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <IconWrapper {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></IconWrapper>
);

export const ListMusicIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <IconWrapper {...props}><path d="M11 18h9"/><path d="M11 14h9"/><path d="M11 10h9"/><path d="M11 6h9"/><path d="M5 19.5V7a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v12.5a2.5 2.5 0 0 1-5 0Z"/><path d="M3 12a2 2 0 1 1 4 0 2 2 0 0 1-4 0Z"/></IconWrapper>
);

export const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <IconWrapper {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></IconWrapper>
);