import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Dashboard from './pages/Dashboard';
import RegionView from './pages/RegionView';
import SupplyChain from './pages/SupplyChain';
import Hospital from './pages/Hospital';
import Simulation from './pages/Simulation';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import HealthCast from './pages/HealthCast';
import Sidebar from './components/layout/Sidebar';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/region/:id" element={<RegionView />} />
        <Route path="/supply-chain" element={<SupplyChain />} />
        <Route path="/hospital" element={<Hospital />} />
        <Route path="/simulation" element={<Simulation />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/health-cast" element={<HealthCast />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-background text-foreground overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6 relative">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0"></div>
          <div className="relative z-10 h-full">
            <AnimatedRoutes />
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
