import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

interface Globe3DProps {
    points?: any[];
    arcs?: any[];
    ringsData?: any[];
    labelsData?: any[];
    onPointClick?: (point: any) => void;
}

export const Globe3D = ({ points = [], arcs = [], onPointClick }: Globe3DProps) => {
    const globeEl = useRef<any>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight
                });
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (globeEl.current) {
            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = 0.5;
            globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 });
        }
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full min-h-[500px] rounded-xl overflow-hidden border border-border bg-gradient-to-b from-blue-900/30 to-purple-900/30 relative">
            <Globe
                ref={globeEl}
                width={dimensions.width}
                height={dimensions.height}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"

                // Points (Outbreaks/Factories)
                pointsData={points}
                pointLat="lat"
                pointLng="lng"
                pointColor="color"
                pointAltitude={0.05}
                pointRadius="radius"
                pointsMerge={false}
                pointPulseing={true}
                onPointClick={onPointClick}

                // Rings (For Demo/Alerts)
                ringsData={points.filter(p => p.type === 'outbreak' || p.radius > 0.5)}
                ringColor={(t: any) => (t: any) => `rgba(255,100,50,${Math.sqrt(1 - t)})`}
                ringMaxRadius="maxR"
                ringPropagationSpeed={2}
                ringRepeatPeriod={800}

                // Labels
                labelsData={points}
                labelLat="lat"
                labelLng="lng"
                labelText="label"
                labelSize={1.5}
                labelDotRadius={0.5}
                labelColor={() => 'rgba(255, 255, 255, 0.75)'}
                labelResolution={2}

                // Arcs (Supply Routes)
                arcsData={arcs}
                arcColor="color"
                arcDashLength={0.4}
                arcDashGap={0.2}
                arcDashAnimateTime={1500}
                arcStroke={0.8}
                arcAltitude={0.2}

                // Atmosphere
                atmosphereColor="rgba(100, 200, 255, 1)"
                atmosphereAltitude={0.25}
            />

            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10 text-xs">
                <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span>Critical Outbreak</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                    <span>Warning Zone</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span>Supply Hub</span>
                </div>
            </div>
        </div>
    );
};
