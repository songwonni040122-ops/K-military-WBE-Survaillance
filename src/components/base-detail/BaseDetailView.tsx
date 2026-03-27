import { useAppStore } from '../../stores/appStore';
import { useBaseData } from '../../hooks/useBaseData';
import { getBaseAlertLevel, getZoneAlertLevel } from '../../utils/alertLevel';
import { getLatestSample } from '../../data/samples';
import ThreeScene from './ThreeScene';
import BaseInfoHeader from './BaseInfoHeader';
import ZonePanel from './ZonePanel';
import GuidelinesPanel from '../guidelines/GuidelinesPanel';
import type { AlertLevel, PathogenConcentration } from '../../types';

export default function BaseDetailView() {
  const selectedBaseId = useAppStore((s) => s.selectedBaseId);
  const selectedZoneId = useAppStore((s) => s.selectedZoneId);
  const selectZone = useAppStore((s) => s.selectZone);
  const { getBase, getZoneSamples } = useBaseData();

  if (!selectedBaseId) return null;
  const base = getBase(selectedBaseId);
  if (!base) return null;

  const zoneAlerts = base.zones.map(z => {
    const latest = getLatestSample(z.id);
    return latest ? getZoneAlertLevel(latest.pathogens) : ('normal' as AlertLevel);
  });
  const baseAlert = getBaseAlertLevel(zoneAlerts);

  // Aggregate all detected pathogens from all zones for guidelines
  const allPathogens: PathogenConcentration[] = [];
  for (const zone of base.zones) {
    const latest = getLatestSample(zone.id);
    if (latest) {
      for (const p of latest.pathogens) {
        const existing = allPathogens.find(ap => ap.pathogenId === p.pathogenId);
        if (!existing || p.ratio > existing.ratio) {
          if (existing) {
            Object.assign(existing, p);
          } else {
            allPathogens.push({ ...p });
          }
        }
      }
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <BaseInfoHeader base={base} alertLevel={baseAlert} />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* 3D View */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <ThreeScene base={base} />
        </div>

        {/* Data Panel */}
        <div
          style={{
            width: 380,
            flexShrink: 0,
            overflow: 'auto',
            borderLeft: '1px solid var(--border-subtle)',
            background: 'var(--bg-secondary)',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {base.zones.map((zone) => {
            const zoneColor = base.layout.zones.find(z => z.id === zone.id)?.color || '#888';
            return (
              <ZonePanel
                key={zone.id}
                zone={zone}
                samples={getZoneSamples(zone.id)}
                isSelected={selectedZoneId === zone.id}
                onSelect={() => selectZone(zone.id)}
                zoneColor={zoneColor}
              />
            );
          })}
          <GuidelinesPanel base={base} pathogens={allPathogens} />
        </div>
      </div>
    </div>
  );
}
