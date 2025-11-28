import { useParams } from 'react-router-dom';
import {
    Thermometer,
    Wind,
    Droplets,
    TrendingUp,
    AlertTriangle,
    ArrowRight
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend
} from 'recharts';

const RegionView = () => {
    const { id } = useParams();

    // Mock data for charts
    const outbreakData = [
        { day: 'Mon', cases: 120, risk: 45 },
        { day: 'Tue', cases: 132, risk: 48 },
        { day: 'Wed', cases: 145, risk: 52 },
        { day: 'Thu', cases: 160, risk: 58 },
        { day: 'Fri', cases: 185, risk: 65 },
        { day: 'Sat', cases: 210, risk: 72 },
        { day: 'Sun', cases: 245, risk: 80 },
    ];

    const inventoryData = [
        { name: 'Paracetamol', current: 4000, required: 5000 },
        { name: 'Artemisinin', current: 1200, required: 3000 },
        { name: 'IV Fluids', current: 8000, required: 6000 },
        { name: 'Antibiotics', current: 2500, required: 2000 },
    ];

    return (
        <div className="flex flex-col gap-6 h-full">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-muted-foreground">Region /</span>
                        <h1 className="text-2xl font-bold">Maharashtra, India ({id})</h1>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-red-400">
                            <AlertTriangle className="w-4 h-4" />
                            High Risk Outbreak Zone
                        </span>
                        <span className="text-muted-foreground">Population: 112M</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                        Allocate Resources
                    </button>
                    <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted">
                        Download Report
                    </button>
                </div>
            </div>

            {/* Environmental Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-card border border-border p-4 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-orange-500/10 text-orange-500 rounded-lg">
                        <Thermometer className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Temperature</p>
                        <p className="text-xl font-bold">32°C</p>
                    </div>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg">
                        <Droplets className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Humidity</p>
                        <p className="text-xl font-bold">78%</p>
                    </div>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-cyan-500/10 text-cyan-500 rounded-lg">
                        <Wind className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Wind Speed</p>
                        <p className="text-xl font-bold">12 km/h</p>
                    </div>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-purple-500/10 text-purple-500 rounded-lg">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">R-Naught</p>
                        <p className="text-xl font-bold">1.4</p>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">

                {/* Left Col: Outbreak Analytics */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="bg-card border border-border p-6 rounded-xl flex-1 min-h-[300px]">
                        <h3 className="font-semibold mb-6">Dengue Outbreak Trajectory</h3>
                        <ResponsiveContainer width="100%" height="80%">
                            <AreaChart data={outbreakData}>
                                <defs>
                                    <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="day" stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="cases"
                                    stroke="#ef4444"
                                    fillOpacity={1}
                                    fill="url(#colorCases)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-card border border-border p-6 rounded-xl flex-1 min-h-[300px]">
                        <h3 className="font-semibold mb-6">Regional Inventory Status</h3>
                        <ResponsiveContainer width="100%" height="80%">
                            <BarChart data={inventoryData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="name" stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                                />
                                <Legend />
                                <Bar dataKey="current" name="Available Stock" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="required" name="Required Demand" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Col: Action Items */}
                <div className="flex flex-col gap-4">
                    <div className="bg-card border border-border p-4 rounded-xl">
                        <h3 className="font-semibold mb-4">Critical Shortages</h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-medium text-red-400">Artemisinin</span>
                                    <span className="text-xs bg-red-500/20 px-2 py-0.5 rounded text-red-300">Critical</span>
                                </div>
                                <div className="w-full bg-gray-700 h-1.5 rounded-full mb-1">
                                    <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '40%' }}></div>
                                </div>
                                <p className="text-xs text-muted-foreground">40% of required stock available</p>
                            </div>

                            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-medium text-yellow-400">Paracetamol</span>
                                    <span className="text-xs bg-yellow-500/20 px-2 py-0.5 rounded text-yellow-300">Low</span>
                                </div>
                                <div className="w-full bg-gray-700 h-1.5 rounded-full mb-1">
                                    <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '80%' }}></div>
                                </div>
                                <p className="text-xs text-muted-foreground">80% of required stock available</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border border-border p-4 rounded-xl flex-1">
                        <h3 className="font-semibold mb-4">Recommended Actions</h3>
                        <div className="space-y-4">
                            <div className="flex gap-3 items-start">
                                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold mt-0.5">1</div>
                                <div>
                                    <p className="text-sm font-medium">Redirect Shipment #SH-902</p>
                                    <p className="text-xs text-muted-foreground">From Gujarat to Maharashtra (ETA: 4h)</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start">
                                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold mt-0.5">2</div>
                                <div>
                                    <p className="text-sm font-medium">Deploy Mobile Clinic Unit</p>
                                    <p className="text-xs text-muted-foreground">To Sector 4, Mumbai (High Density)</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start">
                                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold mt-0.5">3</div>
                                <div>
                                    <p className="text-sm font-medium">Increase Testing Capacity</p>
                                    <p className="text-xs text-muted-foreground">Request 5000 additional kits from Central</p>
                                </div>
                            </div>
                        </div>
                        <button className="w-full mt-6 py-2 border border-border rounded-lg text-sm hover:bg-muted flex items-center justify-center gap-2">
                            View All Actions <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegionView;
