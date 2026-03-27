import type { MilitaryBase } from '../../types';
import type { PathogenConcentration } from '../../types';
import { generateGuidelines } from '../../utils/guidelineEngine';
import SeasonalBanner from './SeasonalBanner';
import ChecklistItem from './ChecklistItem';
import GlassPanel from '../ui/GlassPanel';

interface GuidelinesPanelProps {
  base: MilitaryBase;
  pathogens: PathogenConcentration[];
}

export default function GuidelinesPanel({ base, pathogens }: GuidelinesPanelProps) {
  const guidelines = generateGuidelines(pathogens, base.type, base.characteristics);

  return (
    <GlassPanel style={{ padding: '12px' }}>
      <div className="section-header">맞춤 방역지침</div>
      <SeasonalBanner />
      {guidelines.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '20px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--accent-green)',
          }}
        >
          현재 특별 방역지침 없음 - 기본 방역수칙 유지
        </div>
      ) : (
        guidelines.map((g) => <ChecklistItem key={g.id} guideline={g} />)
      )}
    </GlassPanel>
  );
}
