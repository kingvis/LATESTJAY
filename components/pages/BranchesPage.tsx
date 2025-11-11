import React, { useEffect, useRef } from 'react';
import { LocationMarkerIcon, ClockIcon } from '../Icons';

// Declare Leaflet's 'L' to avoid TypeScript errors since it's loaded from a CDN
declare const L: any;

const BranchCard = ({ name, address, facilities, hours, isMain }: { name: string; address: string; facilities: string[]; hours: string; isMain?: boolean }) => {
    return (
        <div className="flex flex-col bg-card/50 backdrop-blur-sm rounded-lg border border-border shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-primary/20">
            <div className="p-8 flex-grow">
                <h2 className="text-3xl font-bold text-card-foreground mb-2">{name}</h2>
                <p className="text-primary font-semibold mb-6">{isMain ? 'Main Branch' : 'Additional Branch'}</p>
                
                <div className="flex items-start mb-4">
                    <LocationMarkerIcon className="h-6 w-6 text-primary mt-1 mr-3 flex-shrink-0" />
                    <p className="text-muted-foreground">{address}</p>
                </div>
                
                <div className="flex items-start mb-6">
                    <ClockIcon className="h-6 w-6 text-primary mt-1 mr-3 flex-shrink-0" />
                    <p className="text-muted-foreground">{hours}</p>
                </div>

                <h3 className="text-xl font-semibold text-card-foreground mb-3">Facilities</h3>
                <ul className="space-y-2">
                    {facilities.map(facility => (
                        <li key={facility} className="flex items-center text-muted-foreground">
                             <svg className="h-4 w-4 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                            {facility}
                        </li>
                    ))}
                </ul>
            </div>
             <div className="bg-cover bg-center h-48 flex-shrink-0" style={{backgroundImage: `url('https://images.unsplash.com/photo-1517230878791-4d28214057c2?q=80&w=2070&auto=format&fit=crop')`}}></div>
        </div>
    );
}

export const BranchesPage = () => {
    const mapRef = useRef(null);
    const isMapInitialized = useRef(false);

    const branches = [
        {
            name: "Thiruninravur",
            address: "123 Music Lane, Thiruninravur, Chennai, Tamil Nadu 602024",
            facilities: ['Spacious classrooms', 'Acoustically treated rooms', 'Professional-grade instruments', 'Recording studio access'],
            hours: "Mon - Sat: 10:00 AM - 8:00 PM",
            isMain: true,
            coords: [13.1255, 80.0555] as [number, number]
        },
        {
            name: "Kattupakkam",
            address: "456 Rhythm Road, Kattupakkam, Chennai, Tamil Nadu 600056",
            facilities: ['Dedicated dance floors', 'Air-conditioned studios', 'Keyboard lab', 'Waiting area for parents'],
            hours: "Mon - Fri: 3:00 PM - 9:00 PM | Sat & Sun: 10:00 AM - 6:00 PM",
            isMain: false,
            coords: [13.0408, 80.1248] as [number, number]
        }
    ];

    useEffect(() => {
        if (typeof L === 'undefined' || !mapRef.current || isMapInitialized.current) {
            return;
        }

        const map = L.map(mapRef.current).setView([13.083, 80.09], 12); // Centered between branches

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        const customIcon = L.icon({
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            shadowSize: [41, 41]
        });

        branches.forEach(branch => {
            L.marker(branch.coords, { icon: customIcon }).addTo(map)
                .bindPopup(`<b>${branch.name}</b><br>${branch.address}`);
        });
        
        isMapInitialized.current = true;
        
        const mapElement = mapRef.current as HTMLElement;
        const resizeObserver = new ResizeObserver(() => {
            map.invalidateSize();
        });
        resizeObserver.observe(mapElement);

        return () => {
            resizeObserver.unobserve(mapElement);
        };
    }, []);

    return (
        <div className="py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">Our <span className="text-primary">Branches</span></h1>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        Find our state-of-the-art facilities on the map below. We have two convenient locations to serve you better.
                    </p>
                </div>

                <div className="mb-16">
                    <div ref={mapRef} className="h-[400px] md:h-[500px] w-full rounded-lg border border-border shadow-lg z-0"></div>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {branches.map((branch) => (
                        <BranchCard 
                            key={branch.name}
                            name={branch.name}
                            address={branch.address}
                            facilities={branch.facilities}
                            hours={branch.hours}
                            isMain={branch.isMain}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};