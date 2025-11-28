import { useState, useEffect } from 'react';
import {
    BarChart3,
    PieChart,
    Download,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Target
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar
} from 'recharts';
import { MockServiceC } from '../api/client';
import { motion } from 'framer-motion';

const Analytics = () => {
    const [performanceData, setPerformanceData] = useState<any[]>([]);
    const [riskDistribution, setRiskDistribution] = useState<any[]>([]);
    const [metrics, setMetrics] = useState<any>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await MockServiceC.getAnalytics();
                const data = res.data;

                setMetrics({
                    accuracy: data.prediction_accuracy,
                    latency: '98ms',
                    volume: '4.2M'
                });

                setPerformanceData([
                    { date: 'Nov 01', accuracy: 85, latency: 120 },
                    { date: 'Nov 05', accuracy: 86, latency: 115 },
                    { date: 'Nov 10', accuracy: 88, latency: 110 },
                    { date: 'Nov 15', accuracy: 87, latency: 118 },
                    { date: 'Nov 20', accuracy: 89, latency: 105 },
                    { date: 'Nov 25', accuracy: 91, latency: 98 },
                ]);

                setRiskDistribution([
                    { subject: 'Supply Chain', A: 120, fullMark: 150 },
                    { subject: 'Disease Spread', A: 98, fullMark: 150 },
                    { subject: 'Hospital Capacity', A: 86, fullMark: 150 },
                    { subject: 'Social Sentiment', A: 99, fullMark: 150 },
                    { subject: 'Weather Impact', A: 85, fullMark: 150 },
                    { subject: 'Transport', A: 65, fullMark: 150 },
                ]);

            } catch (error) {
                console.error("Failed to fetch analytics", error);
            }
        };

        fetchAnalytics();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6 h-full"
        >
            <div className="flex items-center justify-between">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent"
                    >
                        System Analytics & Performance
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-muted-foreground"
                    >
                        Deep dive into model accuracy, system latency, and risk distribution.
                    </motion.p>
                </div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex gap-2"
                >
                    <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted/50 transition-colors flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Last 30 Days
                    </button>
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2 shadow-lg shadow-primary/25 transition-all hover:scale-105 active:scale-95">
                        <Download className="w-4 h-4" /> Export Report
                    </button>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="bg-card/50 backdrop-blur-xl border border-border/50 p-6 rounded-xl shadow-lg"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Model Accuracy</p>
                            <h3 className="text-3xl font-bold">{metrics ? (metrics.accuracy * 100).toFixed(1) + '%' : '...'}</h3>
                        </div>
                        <div className="p-2 bg-green-500/10 text-green-500 rounded-lg">
                            <Target className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex items-center text-sm text-green-500">
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                        <span>+2.4% vs last month</span>
                    </div>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="bg-card/50 backdrop-blur-xl border border-border/50 p-6 rounded-xl shadow-lg"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Avg. Prediction Latency</p>
                            <h3 className="text-3xl font-bold">{metrics ? metrics.latency : '...'}</h3>
                        </div>
                        <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                            <BarChart3 className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex items-center text-sm text-green-500">
                        <ArrowDownRight className="w-4 h-4 mr-1" />
                        <span>-12ms improvement</span>
                    </div>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="bg-card/50 backdrop-blur-xl border border-border/50 p-6 rounded-xl shadow-lg"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Data Points Processed</p>
                            <h3 className="text-3xl font-bold">{metrics ? metrics.volume : '...'}</h3>
                        </div>
                        <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg">
                            <PieChart className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex items-center text-sm text-green-500">
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                        <span>+15% volume increase</span>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
                <motion.div
                    variants={itemVariants}
                    className="bg-card/50 backdrop-blur-xl border border-border/50 p-6 rounded-xl flex flex-col shadow-xl"
                >
                    <h3 className="font-semibold mb-6 text-lg">Model Performance Trend</h3>
                    <div className="flex-1 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={performanceData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="date" stroke="#94a3b8" />
                                <YAxis yAxisId="left" stroke="#94a3b8" domain={[80, 100]} />
                                <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', backdropFilter: 'blur(4px)' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend />
                                <Line yAxisId="left" type="monotone" dataKey="accuracy" name="Accuracy (%)" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                                <Line yAxisId="right" type="monotone" dataKey="latency" name="Latency (ms)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="bg-card/50 backdrop-blur-xl border border-border/50 p-6 rounded-xl flex flex-col shadow-xl"
                >
                    <h3 className="font-semibold mb-6 text-lg">Risk Factor Distribution</h3>
                    <div className="flex-1 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={riskDistribution}>
                                <PolarGrid stroke="rgba(255,255,255,0.2)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                <Radar name="Risk Level" dataKey="A" stroke="#ef4444" fill="#ef4444" fillOpacity={0.4} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', backdropFilter: 'blur(4px)' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Analytics;
