import { useAppStore } from './stores/appStore';
import AppShell from './components/layout/AppShell';
import ThreatTicker from './components/dashboard/ThreatTicker';
import MapView from './components/map/MapView';
import OverviewDashboard from './components/dashboard/OverviewDashboard';
import BaseDetailView from './components/base-detail/BaseDetailView';
import { AnimatePresence, motion } from 'framer-motion';

export default function App() {
  const viewMode = useAppStore((s) => s.viewMode);

  return (
    <AppShell>
      <ThreatTicker />
      <AnimatePresence mode="wait">
        {viewMode === 'overview' ? (
          <motion.div
            key="overview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'flex', height: 'calc(100% - 28px)', overflow: 'hidden' }}
          >
            {/* Map - 60% */}
            <div style={{ flex: 3, minWidth: 0 }}>
              <MapView />
            </div>
            {/* Dashboard - 40% */}
            <div
              style={{
                flex: 2,
                borderLeft: '1px solid var(--border-subtle)',
                background: 'var(--bg-secondary)',
                overflow: 'hidden',
              }}
            >
              <OverviewDashboard />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="base-detail"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{ height: 'calc(100% - 28px)', overflow: 'hidden' }}
          >
            <BaseDetailView />
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
