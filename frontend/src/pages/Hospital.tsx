import { useState } from 'react';
import {
    Building2,
    Plus,
    Search,
    MapPin,
    CheckCircle2,
    AlertCircle,
    Clock,
    Package
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const Hospital = () => {
    const [activeTab, setActiveTab] = useState('requests');

    const requests = [
        { id: 'REQ-1023', hospital: 'City General Hospital', item: 'Oseltamivir (Tamiflu)', quantity: 5000, status: 'urgent', time: '2h ago' },
        { id: 'REQ-1022', hospital: 'St. Mary\'s Medical Center', item: 'IV Fluids (Saline)', quantity: 2000, status: 'pending', time: '4h ago' },
        { id: 'REQ-1021', hospital: 'Community Health Clinic', item: 'Dengue Test Kits', quantity: 500, status: 'fulfilled', time: '1d ago' },
    ];

    const hospitals = [
        { id: 'H001', name: 'City General Hospital', location: 'Mumbai, Central', capacity: '85%', status: 'critical' },
        { id: 'H002', name: 'Apollo Indraprastha', location: 'Delhi, South', capacity: '60%', status: 'stable' },
        { id: 'H003', name: 'Fortis Malar', location: 'Chennai, Adyar', capacity: '45%', status: 'stable' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6 h-full"
        >
            <div className="flex items-center justify-between">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent"
                    >
                        Hospital Collaboration Hub
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-muted-foreground"
                    >
                        Coordinate resources and manage critical shortages across the network.
                    </motion.p>
                </div>
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2 shadow-lg shadow-primary/25"
                >
                    <Plus className="w-4 h-4" /> New Request
                </motion.button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                {/* Left Panel: Network Status */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl flex flex-col overflow-hidden shadow-xl"
                >
                    <div className="p-4 border-b border-border/50 bg-muted/30">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-primary" /> Network Status
                        </h3>
                    </div>
                    <div className="p-4 border-b border-border/50">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search hospitals..."
                                className="w-full bg-muted/50 pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                        {hospitals.map((hospital, index) => (
                            <motion.div
                                key={hospital.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 + index * 0.1 }}
                                whileHover={{ scale: 1.02, backgroundColor: "rgba(var(--muted), 0.5)" }}
                                className="p-3 rounded-lg border border-border/50 hover:border-primary/50 transition-all cursor-pointer group"
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-medium group-hover:text-primary transition-colors">{hospital.name}</span>
                                    <span className={cn(
                                        "text-[10px] px-2 py-0.5 rounded-full uppercase font-bold",
                                        hospital.status === 'critical' ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
                                    )}>
                                        {hospital.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                    <MapPin className="w-3 h-3" /> {hospital.location}
                                </div>
                                <div className="w-full bg-muted-foreground/20 h-1.5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: hospital.capacity }}
                                        transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                                        className={cn("h-full rounded-full", parseInt(hospital.capacity) > 80 ? "bg-red-500" : "bg-blue-500")}
                                    />
                                </div>
                                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                                    <span>Capacity</span>
                                    <span>{hospital.capacity}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Right Panel: Resource Requests */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="lg:col-span-2 bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl flex flex-col overflow-hidden shadow-xl"
                >
                    <div className="flex items-center border-b border-border/50">
                        <button
                            onClick={() => setActiveTab('requests')}
                            className={cn(
                                "px-6 py-3 text-sm font-medium border-b-2 transition-all relative",
                                activeTab === 'requests' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Active Requests
                            {activeTab === 'requests' && (
                                <motion.div
                                    layoutId="activeTabHospital"
                                    className="absolute inset-0 bg-primary/5"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('inventory')}
                            className={cn(
                                "px-6 py-3 text-sm font-medium border-b-2 transition-all relative",
                                activeTab === 'inventory' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Shared Inventory
                            {activeTab === 'inventory' && (
                                <motion.div
                                    layoutId="activeTabHospital"
                                    className="absolute inset-0 bg-primary/5"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        <AnimatePresence mode="wait">
                            {activeTab === 'requests' && (
                                <motion.div
                                    key="requests"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-4"
                                >
                                    {requests.map((req, index) => (
                                        <motion.div
                                            key={req.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ scale: 1.01, backgroundColor: "rgba(var(--muted), 0.4)" }}
                                            className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/10 transition-all"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center",
                                                    req.status === 'urgent' ? "bg-red-500/10 text-red-500" :
                                                        req.status === 'fulfilled' ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                                                )}>
                                                    <Package className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium">{req.item}</h4>
                                                    <p className="text-sm text-muted-foreground">{req.hospital} • {req.quantity} units</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center gap-2 justify-end mb-1">
                                                    {req.status === 'urgent' && <AlertCircle className="w-4 h-4 text-red-500 animate-pulse" />}
                                                    {req.status === 'fulfilled' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                                    {req.status === 'pending' && <Clock className="w-4 h-4 text-yellow-500" />}
                                                    <span className={cn(
                                                        "text-sm font-medium capitalize",
                                                        req.status === 'urgent' ? "text-red-500" :
                                                            req.status === 'fulfilled' ? "text-green-500" : "text-yellow-500"
                                                    )}>{req.status}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground">{req.time}</p>
                                            </div>

                                            {req.status !== 'fulfilled' && (
                                                <div className="ml-4 pl-4 border-l border-border/50">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded text-sm font-medium transition-colors"
                                                    >
                                                        Fulfill
                                                    </motion.button>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}

                            {activeTab === 'inventory' && (
                                <motion.div
                                    key="inventory"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-col items-center justify-center h-full text-muted-foreground"
                                >
                                    <Package className="w-12 h-12 mb-4 opacity-20" />
                                    <p>Select a hospital to view shared inventory</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Hospital;
