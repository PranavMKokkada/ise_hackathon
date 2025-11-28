import {
    MapPin,
    Bell,
    ShieldAlert,
    Thermometer,
    Wind,
    Navigation,
    Share2,
    Info
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

const HealthCast = () => {
    const alerts = [
        { id: 1, type: 'critical', title: 'Dengue Outbreak Alert', message: 'High mosquito activity detected in your area (Zone 4). Use repellent and wear long sleeves.', time: '10m ago' },
        { id: 2, type: 'warning', title: 'Air Quality Warning', message: 'AQI is 156 (Unhealthy). Sensitive groups should avoid outdoor exertion.', time: '1h ago' },
        { id: 3, type: 'info', title: 'Vaccination Drive', message: 'Free flu shots available at City Center Mall this weekend.', time: '3h ago' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="h-full flex justify-center bg-muted/20 -m-6 p-6 overflow-hidden"
        >
            {/* Mobile Frame Simulation */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full max-w-md bg-background border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col h-full max-h-[800px]"
            >

                {/* Mobile Header */}
                <div className="bg-primary p-6 text-primary-foreground pb-12 relative overflow-hidden">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"
                    />
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div>
                            <p className="text-primary-foreground/80 text-sm font-medium">Current Location</p>
                            <div className="flex items-center gap-1 font-bold text-lg">
                                <MapPin className="w-4 h-4" /> Mumbai, Bandra
                            </div>
                        </div>
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-white/20 rounded-full relative cursor-pointer"
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-primary animate-pulse"></span>
                        </motion.div>
                    </div>

                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-4xl font-bold"
                            >
                                28°C
                            </motion.h1>
                            <p className="text-primary-foreground/80">Partly Cloudy</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full inline-block mb-1 backdrop-blur-sm">
                                Risk Level: Moderate
                            </p>
                            <p className="text-xs text-primary-foreground/70">Updated 5m ago</p>
                        </div>
                    </div>
                </div>

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto bg-muted/10 -mt-6 rounded-t-3xl relative z-20 p-6 space-y-6 custom-scrollbar">

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            whileHover={{ scale: 1.05 }}
                            className="bg-card p-3 rounded-2xl shadow-sm border border-border text-center"
                        >
                            <Thermometer className="w-5 h-5 mx-auto text-orange-500 mb-1" />
                            <p className="text-xs text-muted-foreground">Feels Like</p>
                            <p className="font-bold">32°C</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            whileHover={{ scale: 1.05 }}
                            className="bg-card p-3 rounded-2xl shadow-sm border border-border text-center"
                        >
                            <Wind className="w-5 h-5 mx-auto text-blue-500 mb-1" />
                            <p className="text-xs text-muted-foreground">AQI</p>
                            <p className="font-bold text-yellow-500">156</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            whileHover={{ scale: 1.05 }}
                            className="bg-card p-3 rounded-2xl shadow-sm border border-border text-center"
                        >
                            <ShieldAlert className="w-5 h-5 mx-auto text-purple-500 mb-1" />
                            <p className="text-xs text-muted-foreground">Safety</p>
                            <p className="font-bold">85%</p>
                        </motion.div>
                    </div>

                    {/* Alerts Feed */}
                    <div>
                        <h3 className="font-bold mb-3 flex items-center justify-between">
                            Local Alerts
                            <span className="text-xs font-normal text-primary cursor-pointer hover:underline">View All</span>
                        </h3>
                        <div className="space-y-3">
                            {alerts.map((alert, index) => (
                                <motion.div
                                    key={alert.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + index * 0.1 }}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-card p-4 rounded-2xl shadow-sm border border-border relative overflow-hidden cursor-pointer"
                                >
                                    <div className={cn(
                                        "absolute left-0 top-0 bottom-0 w-1",
                                        alert.type === 'critical' ? "bg-red-500" :
                                            alert.type === 'warning' ? "bg-yellow-500" : "bg-blue-500"
                                    )}></div>
                                    <div className="flex justify-between items-start mb-1 pl-2">
                                        <span className={cn(
                                            "text-xs font-bold uppercase tracking-wider",
                                            alert.type === 'critical' ? "text-red-500" :
                                                alert.type === 'warning' ? "text-yellow-500" : "text-blue-500"
                                        )}>{alert.type}</span>
                                        <span className="text-[10px] text-muted-foreground">{alert.time}</span>
                                    </div>
                                    <h4 className="font-bold pl-2 mb-1">{alert.title}</h4>
                                    <p className="text-sm text-muted-foreground pl-2 leading-relaxed">{alert.message}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Nearby Resources */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                    >
                        <h3 className="font-bold mb-3">Nearby Safe Zones</h3>
                        <div className="bg-card p-4 rounded-2xl shadow-sm border border-border flex items-center gap-4 cursor-pointer hover:bg-muted/50 transition-colors">
                            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                                <Navigation className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold">City Pharmacy</h4>
                                <p className="text-xs text-muted-foreground">0.8 km away • Open until 10 PM</p>
                                <div className="flex gap-2 mt-1">
                                    <span className="text-[10px] bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full">Masks Available</span>
                                    <span className="text-[10px] bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full">Repellent Stocked</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Mobile Nav */}
                <div className="bg-card border-t border-border p-4 flex justify-around items-center">
                    <button className="flex flex-col items-center gap-1 text-primary">
                        <ShieldAlert className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Alerts</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                        <MapPin className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Map</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                        <Share2 className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Share</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                        <Info className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Info</span>
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default HealthCast;
