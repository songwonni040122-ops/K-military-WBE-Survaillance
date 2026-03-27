import { useAppStore } from './stores/appStore';
import AppShell from './components/layout/AppShell';
import ThreatTicker from './components/dashboard/ThreatTicker';
import MapView from './components/map/MapView';
import OverviewDashboard from './components/dashboard/OverviewDashboard';
import BaseDetailPanel from './components/base-detail/BaseDetailPanel';
import { AnimatePresence, motion } from 'framer-motion';

export default function App() {
  const viewMode = useAppStore((s) => s.viewMode);

  return (
    <AppShell>
      <ThreatTicker />
      <div style={{ display: 'flex', height: 'calc(100% - 28px)', overflow: 'hidden' }}>
        {/* 3D Map - always visible */}
        <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
          <MapView />
        </div>

        {/* Side Panel */}
        <AnimatePresence mode="wait">
          {viewMode === 'overview' ? (
            <motion.div
              key="overview-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              style={{
                width: 420,
                flexShrink: 0,
                borderLeft: '1px solid var(--border-subtle)',
                background: 'var(--bg-secondary)',
                overflow: 'hidden',
              }}
            >
              <OverviewDashboard />
            </motion.div>
          ) : (
            <motion.div
              key="detail-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              style={{
                width: 420,
                flexShrink: 0,
                borderLeft: '1px solid var(--border-subtle)',
                background: 'var(--bg-secondary)',
                overflow: 'hidden',
              }}
            >
              <BaseDetailPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
