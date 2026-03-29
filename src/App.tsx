import { useAppStore } from './stores/appStore';
import AppShell from './components/layout/AppShell';
import ThreatTicker from './components/dashboard/ThreatTicker';
import MapView from './components/map/MapView';
import OverviewDashboard from './components/dashboard/OverviewDashboard';
import DivisionDetailPanel from './components/base-detail/DivisionDetailPanel';
import BaseDetailPanel from './components/base-detail/BaseDetailPanel';
import { AnimatePresence, motion } from 'framer-motion';

const panelStyle = {
  width: 420,
  flexShrink: 0 as const,
  borderLeft: '1px solid var(--border-subtle)',
  background: 'var(--bg-secondary)',
  overflow: 'hidden' as const,
};

export default function App() {
  const viewMode = useAppStore((s) => s.viewMode);

  const panelKey = viewMode === 'overview' ? 'overview' : viewMode === 'division-detail' ? 'division' : 'base';

  return (
    <AppShell>
      <ThreatTicker />
      <div style={{ display: 'flex', height: 'calc(100% - 28px)', overflow: 'hidden' }}>
        <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
          <MapView />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={panelKey}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            style={panelStyle}
          >
            {viewMode === 'overview' && <OverviewDashboard />}
            {viewMode === 'division-detail' && <DivisionDetailPanel />}
            {viewMode === 'base-detail' && <BaseDetailPanel />}
          </motion.div>
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
