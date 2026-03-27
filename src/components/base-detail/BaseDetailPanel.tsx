import { useAppStore } from '../../stores/appStore';
import { useBaseData } from '../../hooks/useBaseData';
import { getBaseAlertLevel, getZoneAlertLevel } from '../../utils/alertLevel';
import { getLatestSample } from '../../data/samples';
import ZonePanel from './ZonePanel';
import GuidelinesPanel from '../guidelines/GuidelinesPanel';
import Badge from '../ui/Badge';
import type { AlertLevel, PathogenConcentration } from '../../types';

const baseTypeLabels: Record<string, string> = {
  infantry: '보병',
  armored: '기갑',
  artillery: '포병',
  logistics: '군수',
  airforce: '공군/공수',
  headquarters: '사령부',
};

export default function BaseDetailPanel() {
  const selectedBaseId = useAppStore((s) => s.selectedBaseId);
  const selectedZoneId = useAppStore((s) => s.selectedZoneId);
  const selectZone = useAppStore((s) => s.selectZone);
  const goBack = useAppStore((s) => s.goBack);
  const { getBase, getZoneSamples } = useBaseData();

  if (!selectedBaseId) return null;
  const base = getBase(selectedBaseId);
  if (!base) return null;

  const zoneAlerts = base.zones.map((z) => {
    const latest = getLatestSample(z.id);
    return latest ? getZoneAlertLevel(latest.pathogens) : ('normal' as AlertLevel);
  });
  const baseAlert = getBaseAlertLevel(zoneAlerts);

  const allPathogens: PathogenConcentration[] = [];
  for (const zone of base.zones) {
    const latest = getLatestSample(zone.id);
    if (latest) {
      for (const p of latest.pathogens) {
        const existing = allPathogens.find((ap) => ap.pathogenId === p.pathogenId);
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
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 16px',
          borderBottom: '1px solid var(--border-subtle)',
          flexShrink: 0,
        }}
      >
        <button
          onClick={goBack}
          style={{
            background: 'none',
            border: '1px solid var(--border-accent)',
            color: 'var(--accent-cyan)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            padding: '3px 8px',
            cursor: 'pointer',
            borderRadius: 2,
          }}
        >
          &larr;
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2
              style={{
                margin: 0,
                fontSize: '0.9rem',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.1em',
              }}
            >
              {base.name}
            </h2>
            <Badge level={baseAlert} />
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: 'var(--text-dim)',
              marginTop: 2,
            }}
          >
            {baseTypeLabels[base.type]} | {base.region} | {base.personnelCount.toLocaleString()}명
          </div>
        </div>
      </div>

      {/* Zone panels */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {base.zones.map((zone) => {
          const zoneColor = base.layout.zones.find((z) => z.id === zone.id)?.color || '#888';
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
  );
}
