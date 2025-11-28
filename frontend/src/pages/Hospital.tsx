import { useState, useEffect } from 'react';
import {
    Building2,
    Plus,
    Search,
    MapPin,
    CheckCircle2,
    AlertCircle,
    Clock,
    Package,
    X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { ServiceB } from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';

const Hospital = () => {
    const [activeTab, setActiveTab] = useState('requests');
    const [networkStatus, setNetworkStatus] = useState<any[]>([]);
    const [requests, setRequests] = useState<any[]>([]);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [newRequest, setNewRequest] = useState({
        type: 'ICU Beds',
        quantity: 0,
        urgency: 'High'
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [networkRes, requestsRes] = await Promise.all([
                    ServiceB.getHospitalNetwork(),
                    ServiceB.getHospitalRequests()
                ]);
                setNetworkStatus(networkRes.data);
                setRequests(requestsRes.data);
            } catch (error) {
                console.error("Failed to fetch hospital data", error);
            }
        };

        fetchData();
    }, []);

    const handleCreateRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await ServiceB.createHospitalRequest(newRequest);
            alert("Request created successfully!");
            setShowRequestModal(false);
            // Refresh requests
            const res = await ServiceB.getHospitalRequests();
            setRequests(res.data);
        } catch (error) {
            console.error("Failed to create request", error);
        }
    };

    const handleFulfillRequest = async (requestId: string) => {
        try {
            await ServiceB.fulfillRequest(requestId);
            alert("Request fulfilled!");
            // Refresh requests
            const res = await ServiceB.getHospitalRequests();
            setRequests(res.data);
        } catch (error) {
            console.error("Failed to fulfill request", error);
        }
    };

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
                        className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-300 bg-clip-text text-transparent"
                    >
                        Hospital Collaboration Hub
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-muted-foreground"
                    >
                        Real-time resource sharing and capacity management network.
                    </motion.p>
                </div>
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowRequestModal(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 shadow-lg shadow-red-600/20 transition-all"
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
                        {networkStatus.map((hospital, index) => (
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
                                        hospital.status === 'Critical' ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
                                    )}>
                                        {hospital.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                    <MapPin className="w-3 h-3" /> {hospital.location || 'Unknown Location'}
                                </div>
                                <div className="w-full bg-muted-foreground/20 h-1.5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${hospital.capacity}%` }}
                                        transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                                        className={cn("h-full rounded-full", hospital.capacity > 80 ? "bg-red-500" : "bg-blue-500")}
                                    />
                                </div>
                                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                                    <span>Capacity</span>
                                    <span>{hospital.capacity}%</span>
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
                                                    req.urgency === 'Critical' ? "bg-red-500/10 text-red-500" :
                                                        req.status === 'Fulfilled' ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
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
                                                    {req.urgency === 'Critical' && <AlertCircle className="w-4 h-4 text-red-500 animate-pulse" />}
                                                    {req.status === 'Fulfilled' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                                    {req.status === 'Pending' && <Clock className="w-4 h-4 text-yellow-500" />}
                                                    <span className={cn(
                                                        "text-sm font-medium capitalize",
                                                        req.urgency === 'Critical' ? "text-red-500" :
                                                            req.status === 'Fulfilled' ? "text-green-500" : "text-yellow-500"
                                                    )}>{req.status}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground">{req.time}</p>
                                            </div>

                                            {req.status !== 'Fulfilled' && (
                                                <div className="ml-4 pl-4 border-l border-border/50">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleFulfillRequest(req.id)}
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

            {/* Create Request Modal */}
            <AnimatePresence>
                {showRequestModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-background border border-border rounded-xl p-6 w-full max-w-md shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Plus className="w-5 h-5 text-red-500" />
                                    New Resource Request
                                </h2>
                                <button onClick={() => setShowRequestModal(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleCreateRequest} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Resource Type</label>
                                    <select
                                        className="w-full p-2 bg-muted/50 border border-border rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none"
                                        value={newRequest.type}
                                        onChange={e => setNewRequest({ ...newRequest, type: e.target.value })}
                                    >
                                        <option>ICU Beds</option>
                                        <option>Ventilators</option>
                                        <option>PPE Kits</option>
                                        <option>O2 Cylinders</option>
                                        <option>Vaccines</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Quantity</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full p-2 bg-muted/50 border border-border rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none"
                                        value={newRequest.quantity}
                                        onChange={e => setNewRequest({ ...newRequest, quantity: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Urgency</label>
                                    <select
                                        className="w-full p-2 bg-muted/50 border border-border rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none"
                                        value={newRequest.urgency}
                                        onChange={e => setNewRequest({ ...newRequest, urgency: e.target.value })}
                                    >
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                        <option>Critical</option>
                                    </select>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowRequestModal(false)}
                                        className="flex-1 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all"
                                    >
                                        Submit Request
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Hospital;
