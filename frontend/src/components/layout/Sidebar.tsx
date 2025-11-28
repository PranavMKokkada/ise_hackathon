import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Map,
    Network,
    Activity,
    Building2,
    BarChart3,
    Smartphone,
    Settings,
    Menu,
    LogOut
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/region/R001', label: 'Region View', icon: Map },
    { path: '/supply-chain', label: 'Supply Chain', icon: Network },
    { path: '/simulation', label: 'Simulation', icon: Activity },
    { path: '/hospital', label: 'Hospital', icon: Building2 },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/health-cast', label: 'Health Cast', icon: Smartphone },
    { path: '/settings', label: 'Settings', icon: Settings },
];

const Sidebar = () => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    return (
        <motion.aside
            initial={{ width: isSidebarOpen ? 256 : 80 }}
            animate={{ width: isSidebarOpen ? 256 : 80 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-card/50 backdrop-blur-xl border-r border-border flex flex-col z-20 h-full"
        >
            <div className="p-4 flex items-center justify-between border-b border-border/50">
                {isSidebarOpen && (
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent"
                    >
                        BioNexus
                    </motion.h1>
                )}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 hover:bg-muted/50 rounded-md transition-colors"
                >
                    <Menu className="w-5 h-5 text-muted-foreground" />
                </button>
            </div>

            <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path ||
                        (item.path !== '/' && location.pathname.startsWith(item.path));

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "bg-primary/10 text-primary shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-primary/5 rounded-lg"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                            <Icon className={cn("w-5 h-5 z-10", isActive ? "text-blue-400" : "group-hover:text-blue-300")} />
                            {isSidebarOpen && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="z-10 font-medium"
                                >
                                    {item.label}
                                </motion.span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border/50">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                        DP
                    </div>
                    {isSidebarOpen && (
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate">Dr. Pranav</p>
                            <p className="text-xs text-muted-foreground truncate">Lead Analyst</p>
                        </div>
                    )}
                    {isSidebarOpen && <LogOut className="w-4 h-4 text-muted-foreground hover:text-red-400 transition-colors" />}
                </div>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
