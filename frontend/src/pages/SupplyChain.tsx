import { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    ZoomIn,
    ZoomOut,
    Share2,
    Truck,
    Factory,
    Pill,
    Users,
    Package,
    ArrowRight,
    Network,
    PlusCircle,
    X,
    AlertTriangle
} from 'lucide-react';
import { ServiceB } from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';

const SupplyChain = () => {
    const [nodes, setNodes] = useState<any[]>([]);
    const [edges, setEdges] = useState<any[]>([]);
    const [selectedNode, setSelectedNode] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportForm, setReportForm] = useState({
        node_id: '',
        node_type: 'Factory',
        disruption_type: 'Factory Fire',
        severity: 'Medium',
        description: '',
        source_url: ''
    });

    useEffect(() => {
        const fetchGraph = async () => {
            try {
                const res = await ServiceB.getGraphData();
                setNodes(res.data.nodes);
                setEdges(res.data.edges);
            } catch (error) {
                console.error("Failed to fetch graph data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGraph();
    }, []);

    const handleReportSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await ServiceB.reportDisruption(reportForm);
            alert("Disruption reported successfully!");
            setShowReportModal(false);
            setReportForm({
                node_id: '',
                node_type: 'Factory',
                disruption_type: 'Factory Fire',
                severity: 'Medium',
                description: '',
                source_url: ''
            });
        } catch (error) {
            console.error("Failed to report disruption", error);
            alert("Failed to report disruption.");
        }
    };

    // Simple force-directed layout simulation (placeholder for real graph viz)
    const getNodePosition = (index: number, total: number) => {
        const angle = (index / total) * 2 * Math.PI;
        const radius = 300;
        return {
            x: 400 + radius * Math.cos(angle),
            y: 300 + radius * Math.sin(angle)
        };
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full flex flex-col"
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent"
                    >
                        Supply Chain Network
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-muted-foreground"
                    >
                        Interactive multi-tier supply chain visualization.
                    </motion.p>
                </div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex gap-2"
                >
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search nodes..."
                            className="pl-9 pr-4 py-2 bg-card/50 backdrop-blur-sm border border-border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                    </div>
                    <button className="p-2 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                        <Filter className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setShowReportModal(true)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 shadow-lg shadow-red-600/20 transition-all hover:scale-105 active:scale-95"
                    >
                        <PlusCircle className="w-4 h-4" /> Report Disruption
                    </button>
                    <button className="p-2 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                        <Share2 className="w-4 h-4" />
                    </button>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="flex-1 bg-card/30 backdrop-blur-xl border border-border/50 rounded-xl relative overflow-hidden shadow-2xl"
            >
                {/* Graph Visualization Area */}
                <div className="absolute inset-0 flex items-center justify-center bg-[#0f172a]/50">
                    {loading ? (
                        <div className="text-white flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            Loading Supply Chain Graph...
                        </div>
                    ) : (
                        <div className="relative w-full h-full">
                            <svg className="w-full h-full">
                                <defs>
                                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                                        <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
                                    </marker>
                                </defs>
                                {edges.map((edge, i) => {
                                    const sourceNode = nodes.find(n => n.id === edge.source);
                                    const targetNode = nodes.find(n => n.id === edge.target);
                                    if (!sourceNode || !targetNode) return null;

                                    const sourcePos = getNodePosition(nodes.indexOf(sourceNode), nodes.length);
                                    const targetPos = getNodePosition(nodes.indexOf(targetNode), nodes.length);

                                    return (
                                        <motion.line
                                            key={i}
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{ pathLength: 1, opacity: 1 }}
                                            transition={{ duration: 1, delay: i * 0.05 }}
                                            x1={sourcePos.x}
                                            y1={sourcePos.y}
                                            x2={targetPos.x}
                                            y2={targetPos.y}
                                            stroke="#475569"
                                            strokeWidth="1"
                                            markerEnd="url(#arrowhead)"
                                        />
                                    );
                                })}
                                {nodes.map((node, i) => {
                                    const pos = getNodePosition(i, nodes.length);
                                    const Icon = node.type === 'Factory' ? Factory :
                                        node.type === 'Supplier' ? Truck :
                                            node.type === 'Treatment' ? Pill :
                                                node.type === 'Region' ? Network : Package;

                                    return (
                                        <motion.g
                                            key={node.id}
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ type: "spring", stiffness: 260, damping: 20, delay: i * 0.1 }}
                                            transform={`translate(${pos.x},${pos.y})`}
                                            onClick={() => setSelectedNode(node)}
                                            className="cursor-pointer hover:opacity-80 transition-opacity"
                                            whileHover={{ scale: 1.2 }}
                                        >
                                            <circle r="20" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" className="drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                            <foreignObject x="-10" y="-10" width="20" height="20">
                                                <div className="flex items-center justify-center h-full text-blue-500">
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                            </foreignObject>
                                            <text y="35" textAnchor="middle" fill="#94a3b8" fontSize="12" className="font-medium">{node.name || node.id}</text>
                                        </motion.g>
                                    );
                                })}
                            </svg>
                        </div>
                    )}
                </div>

                {/* Controls Overlay */}
                <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                    <button className="p-2 bg-background/80 backdrop-blur border border-border rounded-lg hover:bg-muted shadow-lg transition-all hover:scale-110">
                        <ZoomIn className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-background/80 backdrop-blur border border-border rounded-lg hover:bg-muted shadow-lg transition-all hover:scale-110">
                        <ZoomOut className="w-4 h-4" />
                    </button>
                </div>

                {/* Node Details Panel */}
                <AnimatePresence>
                    {selectedNode && (
                        <motion.div
                            initial={{ x: 300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 300, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="absolute top-6 right-6 w-80 bg-background/90 backdrop-blur-xl border border-border rounded-xl p-6 shadow-2xl"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg">{selectedNode.name || selectedNode.id}</h3>
                                    <span className="text-xs px-2 py-1 bg-blue-500/10 text-blue-500 rounded-full border border-blue-500/20">
                                        {selectedNode.type}
                                    </span>
                                </div>
                                <button
                                    onClick={() => setSelectedNode(null)}
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                                    <div className="flex items-center gap-2 text-green-500">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-sm font-medium">Operational</span>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Risk Score</p>
                                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: "45%" }}
                                            transition={{ duration: 1, delay: 0.2 }}
                                            className="bg-yellow-500 h-full"
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs mt-1">
                                        <span>Low</span>
                                        <span className="font-medium">45/100</span>
                                        <span>High</span>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Dependencies</p>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                                            <div className="flex items-center gap-2">
                                                <Factory className="w-3 h-3 text-blue-400" />
                                                <span>Raw Materials A</span>
                                            </div>
                                            <ArrowRight className="w-3 h-3 text-muted-foreground" />
                                        </div>
                                        <div className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                                            <div className="flex items-center gap-2">
                                                <Users className="w-3 h-3 text-purple-400" />
                                                <span>Logistics Partner B</span>
                                            </div>
                                            <ArrowRight className="w-3 h-3 text-muted-foreground" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Report Disruption Modal */}
            <AnimatePresence>
                {showReportModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-background border border-border rounded-xl p-6 w-full max-w-md shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-red-500" />
                                    Report Supply Chain Disruption
                                </h2>
                                <button onClick={() => setShowReportModal(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleReportSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Node ID</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-2 bg-muted/50 border border-border rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none"
                                        value={reportForm.node_id}
                                        onChange={e => setReportForm({ ...reportForm, node_id: e.target.value })}
                                        placeholder="e.g., F001"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Node Type</label>
                                        <select
                                            className="w-full p-2 bg-muted/50 border border-border rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none"
                                            value={reportForm.node_type}
                                            onChange={e => setReportForm({ ...reportForm, node_type: e.target.value })}
                                        >
                                            <option>Factory</option>
                                            <option>Supplier</option>
                                            <option>Region</option>
                                            <option>Transport</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Severity</label>
                                        <select
                                            className="w-full p-2 bg-muted/50 border border-border rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none"
                                            value={reportForm.severity}
                                            onChange={e => setReportForm({ ...reportForm, severity: e.target.value })}
                                        >
                                            <option>Low</option>
                                            <option>Medium</option>
                                            <option>High</option>
                                            <option>Critical</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Disruption Type</label>
                                    <select
                                        className="w-full p-2 bg-muted/50 border border-border rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none"
                                        value={reportForm.disruption_type}
                                        onChange={e => setReportForm({ ...reportForm, disruption_type: e.target.value })}
                                    >
                                        <option>Factory Fire</option>
                                        <option>Port Strike</option>
                                        <option>Raw Material Shortage</option>
                                        <option>Customs Delay</option>
                                        <option>Power Outage</option>
                                        <option>Labor Dispute</option>
                                        <option>Transport Accident</option>
                                        <option>Regulatory Ban</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Description</label>
                                    <textarea
                                        className="w-full p-2 bg-muted/50 border border-border rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none"
                                        rows={3}
                                        value={reportForm.description}
                                        onChange={e => setReportForm({ ...reportForm, description: e.target.value })}
                                        placeholder="Describe the disruption..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Source URL</label>
                                    <input
                                        type="url"
                                        className="w-full p-2 bg-muted/50 border border-border rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none"
                                        value={reportForm.source_url}
                                        onChange={e => setReportForm({ ...reportForm, source_url: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                                <div className="flex justify-end gap-2 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowReportModal(false)}
                                        className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all hover:scale-105 active:scale-95"
                                    >
                                        Submit Report
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

export default SupplyChain;
