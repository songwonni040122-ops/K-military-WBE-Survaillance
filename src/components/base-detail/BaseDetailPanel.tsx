import { useState } from 'react';
import { useAppStore } from '../../stores/appStore';
import { useBaseData } from '../../hooks/useBaseData';
import { getBaseAlertLevel, getZoneAlertLevel } from '../../utils/alertLevel';
import { getLatestSample } from '../../data/samples';
import { generateGuidelines } from '../../utils/guidelineEngine';
import ZonePanel from './ZonePanel';
import GuidelineDocumentModal from '../guidelines/GuidelineDocumentModal';
import Badge from '../ui/Badge';
import PulsingDot from '../ui/PulsingDot';
import GlassPanel from '../ui/GlassPanel';
import ConcentrationChart from './ConcentrationChart';
import PathogenBadges from './PathogenBadges';
import type { AlertLevel, PathogenConcentration, PreventionGuideline } from '../../types';

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
  const clearZone = useAppStore((s) => s.clearZone);
  const { getBase, getZoneSamples } = useBaseData();
  const [openGuideline, setOpenGuideline] = useState<PreventionGuideline | null>(null);

  if (!selectedBaseId) return null;
  const base = getBase(selectedBaseId);
  if (!base) return null;

  const zoneAlerts = base.zones.map((z) => {
    const latest = getLatestSample(z.id);
    return latest ? getZoneAlertLevel(latest.pathogens) : ('normal' as AlertLevel);
  });
  const baseAlert = getBaseAlertLevel(zoneAlerts);

  // Aggregate pathogens across all zones
  const allPathogens: PathogenConcentration[] = [];
  for (const zone of base.zones) {
    const latest = getLatestSample(zone.id);
    if (latest) {
      for (const p of latest.pathogens) {
        const existing = allPathogens.find((ap) => ap.pathogenId === p.pathogenId);
        if (!existing || p.ratio > existing.ratio) {
          if (existing) Object.assign(existing, p);
          else allPathogens.push({ ...p });
        }
      }
    }
  }

  const hasZones = base.zones.length > 1;
  const selectedZone = base.zones.find((z) => z.id === selectedZoneId);

  // Guidelines for current context
  const guidelinePathogens = selectedZone
    ? (() => { const s = getLatestSample(selectedZone.id); return s ? s.pathogens : []; })()
    : allPathogens;
  const guidelines = generateGuidelines(guidelinePathogens, base.type, base.characteristics);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0,
      }}>
        <button onClick={selectedZone ? () => clearZone() : goBack} style={{
          background: 'none', border: '1px solid var(--border-accent)',
          color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem', padding: '3px 8px', cursor: 'pointer', borderRadius: 2,
        }}>
          &larr;
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2 style={{ margin: 0, fontSize: '0.9rem', fontFamily: 'var(--font-display)', letterSpacing: '0.1em' }}>
              {selectedZone ? `${base.name} / ${selectedZone.name}` : base.name}
            </h2>
            <Badge level={selectedZone ? zoneAlerts[base.zones.indexOf(selectedZone)] : baseAlert} />
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-dim)', marginTop: 2 }}>
            {baseTypeLabels[base.type]} | {base.region} | {base.personnelCount.toLocaleString()}명
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {selectedZone ? (
          /* ── Zone Detail View ── */
          <ZoneDetailView
            zone={selectedZone}
            samples={getZoneSamples(selectedZone.id)}
            zoneColor={base.layout.zones.find((z) => z.id === selectedZone.id)?.color || '#888'}
            guidelines={guidelines}
            onGuidelineClick={setOpenGuideline}
          />
        ) : (
          /* ── Base Summary View ── */
          <>
            {/* Zone list (clickable) */}
            {hasZones && base.zones.map((zone, i) => {
              const zoneColor = base.layout.zones.find((z) => z.id === zone.id)?.color || '#888';
              return (
                <GlassPanel key={zone.id} style={{ padding: '10px 12px', cursor: 'pointer' }}>
                  <div onClick={() => selectZone(zone.id)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: zoneColor, opacity: 0.7 }} />
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 600, flex: 1 }}>
                      {zone.name}
                    </span>
                    <PulsingDot level={zoneAlerts[i]} size={8} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-dim)' }}>
                      상세 &rarr;
                    </span>
                  </div>
                </GlassPanel>
              );
            })}

            {/* Base overview: all zone samples aggregated */}
            {!hasZones && base.zones.length === 1 && (
              <ZonePanel
                zone={base.zones[0]}
                samples={getZoneSamples(base.zones[0].id)}
                isSelected={false}
                onSelect={() => {}}
                zoneColor={base.layout.zones[0]?.color || '#888'}
              />
            )}

            {/* Guidelines (shown at base level if no zones) */}
            {!hasZones && (
              <GuidelinesList
                guidelines={guidelines}
                onGuidelineClick={setOpenGuideline}
              />
            )}
          </>
        )}
      </div>

      {/* Guideline Document Modal */}
      {openGuideline && (
        <GuidelineDocumentModal
          guideline={openGuideline}
          baseName={base.name}
          onClose={() => setOpenGuideline(null)}
        />
      )}
    </div>
  );
}

/** Zone detail with chart, pathogens, and guidelines */
function ZoneDetailView({
  zone, samples, zoneColor, guidelines, onGuidelineClick,
}: {
  zone: { id: string; name: string; confluencePoint: string };
  samples: import('../../types').SampleResult[];
  zoneColor: string;
  guidelines: PreventionGuideline[];
  onGuidelineClick: (g: PreventionGuideline) => void;
}) {
  const latest = samples[samples.length - 1];
  const alertLevel = latest ? getZoneAlertLevel(latest.pathogens) : 'normal';

  return (
    <>
      <GlassPanel style={{ padding: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: zoneColor, opacity: 0.7 }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 600, flex: 1 }}>{zone.name}</span>
          <PulsingDot level={alertLevel} size={8} />
        </div>
        <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginBottom: 8, fontFamily: 'var(--font-mono)' }}>
          {zone.confluencePoint}
        </div>
        <div style={{ marginBottom: 8 }}>
          <ConcentrationChart samples={samples} />
        </div>
        <div>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', marginBottom: 4, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
            검출 병원체
          </div>
          {latest && <PathogenBadges pathogens={latest.pathogens} />}
        </div>
      </GlassPanel>

      <GuidelinesList guidelines={guidelines} onGuidelineClick={onGuidelineClick} />
    </>
  );
}

/** Clickable guidelines list */
function GuidelinesList({
  guidelines, onGuidelineClick,
}: {
  guidelines: PreventionGuideline[];
  onGuidelineClick: (g: PreventionGuideline) => void;
}) {
  if (guidelines.length === 0) {
    return (
      <GlassPanel style={{ padding: '12px' }}>
        <div className="section-header">방역지침</div>
        <div style={{ textAlign: 'center', padding: '16px', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
          현재 특별 방역지침 없음
        </div>
      </GlassPanel>
    );
  }

  return (
    <GlassPanel style={{ padding: '12px' }}>
      <div className="section-header">방역지침</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {guidelines.map((g) => (
          <div
            key={g.id}
            onClick={() => onGuidelineClick(g)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 10px', cursor: 'pointer',
              borderLeft: `3px solid ${g.severity === 'critical' ? '#ff1744' : g.severity === 'warning' ? '#ff6e40' : '#ffab00'}`,
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '0 2px 2px 0',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
          >
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
              color: 'var(--text-primary)', flex: 1,
            }}>
              {g.title}
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
              color: 'var(--text-dim)',
            }}>
              P{g.priority} &rarr;
            </span>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}
