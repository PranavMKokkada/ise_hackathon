import { useState } from 'react';
import {
    User,
    Bell,
    Shield,
    Database,
    LogOut,
    Save,
    Moon,
    Sun
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        sms: false,
        criticalOnly: false
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6 h-full max-w-5xl mx-auto w-full"
        >
            <div>
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent"
                >
                    Settings & Configuration
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-muted-foreground"
                >
                    Manage your profile, preferences, and system configurations.
                </motion.p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 flex-1 min-h-0">
                {/* Sidebar Nav */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="w-full md:w-64 flex flex-col gap-2"
                >
                    {[
                        { id: 'profile', icon: User, label: 'Profile' },
                        { id: 'notifications', icon: Bell, label: 'Notifications' },
                        { id: 'security', icon: Shield, label: 'Security' },
                        { id: 'system', icon: Database, label: 'System Data' }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all relative overflow-hidden",
                                activeTab === item.id
                                    ? "text-primary bg-primary/10 shadow-[0_0_10px_rgba(59,130,246,0.1)]"
                                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {activeTab === item.id && (
                                <motion.div
                                    layoutId="activeSettingTab"
                                    className="absolute inset-0 bg-primary/10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <item.icon className="w-4 h-4 relative z-10" />
                            <span className="relative z-10">{item.label}</span>
                        </button>
                    ))}

                    <div className="mt-auto pt-6 border-t border-border/50">
                        <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors w-full">
                            <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                    </div>
                </motion.div>

                {/* Content Area */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex-1 bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl p-6 overflow-y-auto shadow-xl"
                >
                    <AnimatePresence mode="wait">
                        {activeTab === 'profile' && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <h3 className="text-lg font-semibold border-b border-border/50 pb-4">Profile Information</h3>

                                <div className="flex items-center gap-6">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-purple-500/25">
                                        DP
                                    </div>
                                    <div>
                                        <button className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted mr-2 transition-colors">Change Avatar</button>
                                        <button className="px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">Remove</button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Full Name</label>
                                        <input type="text" defaultValue="Dr. Pranav" className="w-full bg-muted/50 border border-border/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email Address</label>
                                        <input type="email" defaultValue="pranav@bionexus.ai" className="w-full bg-muted/50 border border-border/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Role</label>
                                        <input type="text" defaultValue="Lead Analyst" disabled className="w-full bg-muted/30 border border-border/30 rounded-lg px-4 py-2 text-muted-foreground cursor-not-allowed" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Department</label>
                                        <input type="text" defaultValue="Epidemiology" className="w-full bg-muted/50 border border-border/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2 shadow-lg shadow-primary/25 transition-all active:scale-95">
                                        <Save className="w-4 h-4" /> Save Changes
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'notifications' && (
                            <motion.div
                                key="notifications"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <h3 className="text-lg font-semibold border-b border-border/50 pb-4">Notification Preferences</h3>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-muted/20 transition-colors">
                                        <div>
                                            <h4 className="font-medium">Email Notifications</h4>
                                            <p className="text-sm text-muted-foreground">Receive daily digests and critical alerts via email.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={notifications.email} onChange={() => setNotifications({ ...notifications, email: !notifications.email })} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-muted/20 transition-colors">
                                        <div>
                                            <h4 className="font-medium">Push Notifications</h4>
                                            <p className="text-sm text-muted-foreground">Real-time alerts on your dashboard and mobile device.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={notifications.push} onChange={() => setNotifications({ ...notifications, push: !notifications.push })} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-muted/20 transition-colors">
                                        <div>
                                            <h4 className="font-medium">SMS Alerts</h4>
                                            <p className="text-sm text-muted-foreground">Urgent notifications sent to your registered phone number.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={notifications.sms} onChange={() => setNotifications({ ...notifications, sms: !notifications.sms })} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'system' && (
                            <motion.div
                                key="system"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <h3 className="text-lg font-semibold border-b border-border/50 pb-4">System Configuration</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Data Refresh Rate</label>
                                        <select className="w-full bg-muted/50 border border-border/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
                                            <option>Real-time (WebSocket)</option>
                                            <option>Every 1 minute</option>
                                            <option>Every 5 minutes</option>
                                            <option>Every 15 minutes</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Theme Preference</label>
                                        <div className="flex gap-4">
                                            <button className="flex-1 py-2 border border-primary bg-primary/10 text-primary rounded-lg flex items-center justify-center gap-2 transition-all hover:bg-primary/20">
                                                <Moon className="w-4 h-4" /> Dark
                                            </button>
                                            <button className="flex-1 py-2 border border-border bg-muted text-muted-foreground rounded-lg flex items-center justify-center gap-2 transition-all hover:bg-muted/80">
                                                <Sun className="w-4 h-4" /> Light
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                    <h4 className="font-bold text-yellow-500 mb-2 flex items-center gap-2">
                                        <Database className="w-4 h-4" /> Cache Management
                                    </h4>
                                    <p className="text-sm text-yellow-200/80 mb-4">Clear local cache to force reload latest data from the Nexus Engine.</p>
                                    <button className="px-4 py-2 bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 rounded-lg text-sm font-medium transition-colors">
                                        Clear App Cache
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Settings;
