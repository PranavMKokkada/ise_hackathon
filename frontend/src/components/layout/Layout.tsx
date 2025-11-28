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
    Bell
} from 'lucide-react';
import { cn } from '../../lib/utils';

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

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            {/* Sidebar */}
            <aside
                className={cn(
                    "bg-card border-r border-border transition-all duration-300 flex flex-col",
                    isSidebarOpen ? "w-64" : "w-20"
                )}
            >
                <div className="p-4 flex items-center justify-between border-b border-border">
                    {isSidebarOpen && (
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                            BioNexus
                        </h1>
                    )}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-muted rounded-md"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path ||
                            (item.path !== '/' && location.pathname.startsWith(item.path));

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center gap-3 p-3 rounded-lg transition-colors",
                                    isActive
                                        ? "bg-primary/10 text-primary border border-primary/20"
                                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                {isSidebarOpen && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
                        {isSidebarOpen && (
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium truncate">Dr. Pranav</p>
                                <p className="text-xs text-muted-foreground truncate">Lead Analyst</p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Header */}
                <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
                    <h2 className="text-lg font-semibold">
                        {NAV_ITEMS.find(i => i.path === location.pathname)?.label || 'BioNexus Platform'}
                    </h2>
                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-muted rounded-full relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-6 relative">
                    {children}
                </div>
            </main>
        </div>
    );
};
