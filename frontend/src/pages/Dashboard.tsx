import { useState, useEffect } from 'react';
import { Globe3D } from '../components/dashboard/Globe3D';
import { StatsPanel } from '../components/dashboard/StatsPanel';
import { MockServiceA, ServiceB } from '../api/client';
import { Play, Pause, Calendar, AlertTriangle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
    const navigate = useNavigate();
    const [isPlaying, setIsPlaying] = useState(false);
    const [timelineDay, setTimelineDay] = useState(0);
    const [globePoints, setGlobePoints] = useState<any[]>([]);
    const [globeArcs, setGlobeArcs] = useState<any[]>([]);

    const [alerts, setAlerts] = useState<any[]>([]);
    const [insights, setInsights] = useState<any>(null);

    const handlePointClick = (point: any) => {
        if (point && point.region) {
            navigate(`/region/${point.region}`);
        }
    };

    // Data loading
    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch data from backend services
                const [outbreaks, _graphData, alertsRes, insightsRes] = await Promise.all([
                    MockServiceA.getOutbreaks(),
                    ServiceB.getGraphData(),
                    MockServiceA.getDashboardAlerts(),
                    MockServiceA.getDashboardInsights()
                ]);

                setAlerts(alertsRes.data);
                setInsights(insightsRes.data);

                // Transform Outbreaks to Globe Points
                const points = outbreaks.data.map((o: any) => ({
                    lat: o.location.lat,
                    lng: o.location.lng,
                    radius: o.severity * 0.1,
                    color: o.severity > 0.7 ? '#ef4444' : '#eab308',
                    label: `${o.region} (${o.type})`
                }));

                // Adding static factory points for visualization if not in outbreaks
                points.push(
                    { lat: 47.5596, lng: 7.5886, radius: 0.3, color: '#3b82f6', label: 'Basel (Factory)' },
                    { lat: -1.2864, lng: 36.8172, radius: 0.3, color: '#3b82f6', label: 'Nairobi (Hub)' },
                    { lat: -23.5505, lng: -46.6333, radius: 0.3, color: '#3b82f6', label: 'São Paulo (Factory)' }
                );

                const arcs = [
                    {
                        startLat: 47.5596, startLng: 7.5886,
                        endLat: 19.0760, endLng: 72.8777,
                        color: ['#3b82f6', '#ef4444']
                    },
                    {
                        startLat: 23.1291, startLng: 113.2644,
                        endLat: 47.5596, endLng: 7.5886,
                        color: ['#3b82f6', '#3b82f6']
                    },
                ];

                setGlobePoints(points);
                setGlobeArcs(arcs);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            }
        };

        loadData();
    }, []);

    // Timeline animation
    useEffect(() => {
        let interval: any;
        if (isPlaying) {
            interval = setInterval(() => {
                setTimelineDay(prev => (prev + 1) % 21);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    const [isDemoMode, setIsDemoMode] = useState(false);

    // Demo Data Generator
    const getDemoData = () => {
        const demoPoints = [
            { lat: 20.5937, lng: 78.9629, radius: 1.5, maxR: 5, color: '#ef4444', label: 'India (Critical)', type: 'outbreak', region: 'R001' },
            { lat: 35.8617, lng: 104.1954, radius: 1.2, maxR: 4, color: '#eab308', label: 'China (Warning)', type: 'outbreak', region: 'R002' },
            { lat: -14.2350, lng: -51.9253, radius: 1.2, maxR: 4, color: '#eab308', label: 'Brazil (Warning)', type: 'outbreak', region: 'R003' },
            { lat: 37.0902, lng: -95.7129, radius: 0.8, maxR: 0, color: '#3b82f6', label: 'USA (Hub)', type: 'hub', region: 'R004' },
            { lat: 51.1657, lng: 10.4515, radius: 0.8, maxR: 0, color: '#3b82f6', label: 'Germany (Hub)', type: 'hub', region: 'R005' },
            { lat: -25.2744, lng: 133.7751, radius: 0.8, maxR: 0, color: '#3b82f6', label: 'Australia (Hub)', type: 'hub', region: 'R006' },
            { lat: 1.3521, lng: 103.8198, radius: 0.8, maxR: 0, color: '#3b82f6', label: 'Singapore (Hub)', type: 'hub', region: 'R007' },
            { lat: -1.2864, lng: 36.8172, radius: 1.0, maxR: 3, color: '#f97316', label: 'Kenya (Moderate)', type: 'outbreak', region: 'R008' },
            { lat: 55.7558, lng: 37.6173, radius: 0.7, maxR: 0, color: '#3b82f6', label: 'Russia (Hub)', type: 'hub', region: 'R009' },
            { lat: 35.6762, lng: 139.6503, radius: 0.7, maxR: 0, color: '#3b82f6', label: 'Japan (Hub)', type: 'hub', region: 'R010' },
        ];

        const demoArcs = [
            // USA connections
            { startLat: 37.0902, startLng: -95.7129, endLat: 51.1657, endLng: 10.4515, color: ['#3b82f6', '#3b82f6'] },
            { startLat: 37.0902, startLng: -95.7129, endLat: -14.2350, endLng: -51.9253, color: ['#3b82f6', '#eab308'] },
            { startLat: 37.0902, startLng: -95.7129, endLat: 35.6762, endLng: 139.6503, color: ['#3b82f6', '#3b82f6'] },
            { startLat: 37.0902, startLng: -95.7129, endLat: 20.5937, endLng: 78.9629, color: ['#3b82f6', '#ef4444'] },

            // Germany connections  
            { startLat: 51.1657, startLng: 10.4515, endLat: 20.5937, endLng: 78.9629, color: ['#3b82f6', '#ef4444'] },
            { startLat: 51.1657, startLng: 10.4515, endLat: -1.2864, endLng: 36.8172, color: ['#3b82f6', '#f97316'] },
            { startLat: 51.1657, startLng: 10.4515, endLat: 35.8617, endLng: 104.1954, color: ['#3b82f6', '#eab308'] },
            { startLat: 51.1657, startLng: 10.4515, endLat: 55.7558, endLng: 37.6173, color: ['#3b82f6', '#3b82f6'] },

            // Asia connections
            { startLat: 1.3521, startLng: 103.8198, endLat: 35.8617, endLng: 104.1954, color: ['#3b82f6', '#eab308'] },
            { startLat: 1.3521, startLng: 103.8198, endLat: 20.5937, endLng: 78.9629, color: ['#3b82f6', '#ef4444'] },
            { startLat: 1.3521, startLng: 103.8198, endLat: -25.2744, endLng: 133.7751, color: ['#3b82f6', '#3b82f6'] },
            { startLat: 35.6762, startLng: 139.6503, endLat: 35.8617, endLng: 104.1954, color: ['#3b82f6', '#eab308'] },
            { startLat: 35.6762, startLng: 139.6503, endLat: 20.5937, endLng: 78.9629, color: ['#3b82f6', '#ef4444'] },

            // Africa connections
            { startLat: -1.2864, startLng: 36.8172, endLat: 20.5937, endLng: 78.9629, color: ['#f97316', '#ef4444'] },
            { startLat: -1.2864, startLng: 36.8172, endLat: 1.3521, endLng: 103.8198, color: ['#f97316', '#3b82f6'] },

            // South America connections
            { startLat: -14.2350, startLng: -51.9253, endLat: -1.2864, endLng: 36.8172, color: ['#eab308', '#f97316'] },
            { startLat: -14.2350, startLng: -51.9253, endLat: 51.1657, endLng: 10.4515, color: ['#eab308', '#3b82f6'] },

            // Australia connections
            { startLat: -25.2744, startLng: 133.7751, endLat: 35.8617, endLng: 104.1954, color: ['#3b82f6', '#eab308'] },

            // Russia connections
            { startLat: 55.7558, startLng: 37.6173, endLat: 35.8617, endLng: 104.1954, color: ['#3b82f6', '#eab308'] },
            { startLat: 55.7558, startLng: 37.6173, endLat: 20.5937, endLng: 78.9629, color: ['#3b82f6', '#ef4444'] },
        ];

        return { points: demoPoints, arcs: demoArcs };
    };

    const displayPoints = isDemoMode ? getDemoData().points : globePoints;
    const displayArcs = isDemoMode ? getDemoData().arcs : globeArcs;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full flex flex-col gap-6"
        >
            <div className="flex items-center justify-between">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent"
                    >
                        Global Bio-Surveillance
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-muted-foreground"
                    >
                        Real-time monitoring of disease outbreaks and supply chain resilience.
                    </motion.p>
                </div>
                <div className="flex gap-3">
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        onClick={() => setIsDemoMode(!isDemoMode)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${isDemoMode ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25' : 'bg-card border border-border hover:bg-muted'}`}
                    >
                        <Play className="w-4 h-4" /> {isDemoMode ? 'Exit Demo' : 'Demo Mode'}
                    </motion.button>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-center gap-2 bg-card/50 backdrop-blur-md border border-border/50 p-2 rounded-lg shadow-lg"
                    >
                        <Calendar className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium">Nov 28, 2025</span>
                    </motion.div>
                </div>
            </div>

            <StatsPanel />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                {/* Main Globe View */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-2 flex flex-col gap-4"
                >
                    <div className="flex-1 min-h-[400px] relative group rounded-2xl overflow-hidden border border-border/50 shadow-2xl bg-black/20 backdrop-blur-sm">
                        <Globe3D points={displayPoints} arcs={displayArcs} onPointClick={handlePointClick} />

                        {/* Timeline Controls Overlay */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-black/60 backdrop-blur-xl border border-white/10 rounded-full p-2 flex items-center gap-4 shadow-2xl">
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/25"
                            >
                                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                            </button>

                            <div className="flex-1">
                                <div className="flex justify-between text-[10px] text-muted-foreground mb-1 font-mono">
                                    <span>Today</span>
                                    <span>+10 Days</span>
                                    <span>+21 Days</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="21"
                                    value={timelineDay}
                                    onChange={(e) => setTimelineDay(parseInt(e.target.value))}
                                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(59,130,246,0.5)] hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                                />
                            </div>

                            <span className="text-xs font-mono w-12 text-right text-blue-400">Day {timelineDay}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Side Panel (Alerts & Insights) */}
                <div className="flex flex-col gap-4">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-5 flex-1 shadow-xl"
                    >
                        <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                            Live Alerts
                        </h3>
                        <div className="space-y-3">
                            {alerts.map((alert: any) => (
                                <motion.div
                                    key={alert.id}
                                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
                                    className="p-3 rounded-xl bg-muted/30 border border-border/50 transition-all cursor-pointer group"
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`text-xs font-bold flex items-center gap-1 ${alert.severity === 'high' ? 'text-red-400' : alert.severity === 'medium' ? 'text-yellow-400' : 'text-blue-400'}`}>
                                            <AlertTriangle className="w-3 h-3" /> {alert.type}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground font-mono">{alert.time}</span>
                                    </div>
                                    <p className="text-sm font-medium group-hover:text-blue-200 transition-colors">{alert.message}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{alert.detail}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {insights && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 }}
                            className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-5 h-1/3 shadow-xl relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-blue-500/5 z-0"></div>
                            <div className="relative z-10">
                                <h3 className="font-semibold mb-3 text-blue-100 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                                    AI Insights
                                </h3>
                                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                    <p className="text-sm text-blue-200 leading-relaxed">
                                        {insights.title}
                                    </p>
                                    <button className="text-xs text-blue-300 mt-3 hover:text-blue-200 flex items-center gap-1 group transition-colors">
                                        {insights.action} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
