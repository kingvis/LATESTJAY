import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VideoIcon, MagicWandIcon, BrainCircuitIcon, MicrophoneIcon, GlobeIcon, MapPinIcon, ListMusicIcon } from '../Icons';
import VideoGenerator from '../ai/VideoGenerator';
import ImageEditor from '../ai/ImageEditor';
import AdvancedAnalyst from '../ai/AdvancedAnalyst';
import LiveAssistant from '../ai/LiveAssistant';
import WebExplorer from '../ai/WebExplorer';
import LocationFinder from '../ai/LocationFinder';
import PracticePlanner from '../ai/PracticePlanner';

type Tab = 'practice' | 'live' | 'web' | 'maps' | 'video' | 'image' | 'text';

export const AIStudioPage = () => {
    const [activeTab, setActiveTab] = useState<Tab>('practice');

    const renderContent = () => {
        switch (activeTab) {
            case 'practice':
                return <PracticePlanner />;
            case 'live':
                return <LiveAssistant />;
            case 'web':
                return <WebExplorer />;
            case 'maps':
                return <LocationFinder />;
            case 'video':
                return <VideoGenerator />;
            case 'image':
                return <ImageEditor />;
            case 'text':
                return <AdvancedAnalyst />;
            default:
                return null;
        }
    };
    
    const TabButton = ({ tab, icon, label }: { tab: Tab, icon: React.ReactNode, label: string }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`flex-1 flex flex-col md:flex-row items-center justify-center gap-2 p-3 md:p-4 text-xs md:text-sm font-semibold border-b-4 transition-all duration-300 ${activeTab === tab ? 'text-primary border-primary' : 'text-muted-foreground border-transparent hover:text-foreground hover:border-border'}`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );

    return (
        <div className="py-16 md:py-24 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">AI Music &amp; Vocal <span className="text-primary">Studio</span></h1>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        Explore the future of musical creativity. Our AI-powered tools are designed to assist you with everything from vocal warm-ups to songwriting.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto bg-card/50 backdrop-blur-sm rounded-lg border border-border shadow-2xl shadow-black/30 overflow-hidden">
                    <div className="flex flex-wrap border-b border-border">
                        <TabButton tab="practice" icon={<ListMusicIcon className="h-5 w-5 md:h-6 md:w-6" />} label="Practice Planner" />
                        <TabButton tab="live" icon={<MicrophoneIcon className="h-5 w-5 md:h-6 md:w-6" />} label="Vocal Coach" />
                        <TabButton tab="web" icon={<GlobeIcon className="h-5 w-5 md:h-6 md:w-6" />} label="Musicpedia" />
                        <TabButton tab="maps" icon={<MapPinIcon className="h-5 w-5 md:h-6 md:w-6" />} label="Gig Finder" />
                        <TabButton tab="video" icon={<VideoIcon className="h-5 w-5 md:h-6 md:w-6" />} label="Music Video Creator" />
                        <TabButton tab="image" icon={<MagicWandIcon className="h-5 w-5 md:h-6 md:w-6" />} label="Album Art Designer" />
                        <TabButton tab="text" icon={<BrainCircuitIcon className="h-5 w-5 md:h-6 md:w-6" />} label="Songwriting Partner" />
                    </div>
                    <div className="p-6 md:p-8 relative">
                         <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                            >
                                {renderContent()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};