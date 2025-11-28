import React from 'react';
import { TrendingUp, AlertTriangle, Package, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatCardProps {
    title: string;
    value: string;
    trend?: string;
    trendUp?: boolean;
    icon: React.ElementType;
    color: "blue" | "red" | "green" | "yellow";
}

const StatCard = ({ title, value, trend, trendUp, icon: Icon, color }: StatCardProps) => {
    const colorStyles = {
        blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        red: "bg-red-500/10 text-red-500 border-red-500/20",
        green: "bg-green-500/10 text-green-500 border-green-500/20",
        yellow: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    };

    return (
        <div className="bg-card border border-border rounded-xl p-4 flex items-start justify-between hover:border-primary/30 transition-colors">
            <div>
                <p className="text-sm text-muted-foreground mb-1">{title}</p>
                <h3 className="text-2xl font-bold">{value}</h3>
                {trend && (
                    <div className={cn("flex items-center text-xs mt-2", trendUp ? "text-green-500" : "text-red-500")}>
                        <TrendingUp className={cn("w-3 h-3 mr-1", !trendUp && "rotate-180")} />
                        <span>{trend}</span>
                    </div>
                )}
            </div>
            <div className={cn("p-2 rounded-lg border", colorStyles[color])}>
                <Icon className="w-5 h-5" />
            </div>
        </div>
    );
};

export const StatsPanel = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
                title="Global Risk Index"
                value="72/100"
                trend="+5% vs last week"
                trendUp={false}
                icon={Activity}
                color="red"
            />
            <StatCard
                title="Active Outbreaks"
                value="12"
                trend="3 Critical"
                trendUp={false}
                icon={AlertTriangle}
                color="yellow"
            />
            <StatCard
                title="Supply Chain Health"
                value="85%"
                trend="Stable"
                trendUp={true}
                icon={Package}
                color="blue"
            />
            <StatCard
                title="Predicted Shortages"
                value="3"
                trend="Next 14 days"
                trendUp={false}
                icon={TrendingUp}
                color="green"
            />
        </div>
    );
};
