import AlertSummaryCard from './AlertSummaryCard';
import PathogenDistribution from './PathogenDistribution';
import BaseStatusTable from './BaseStatusTable';

export default function OverviewDashboard() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        height: '100%',
        padding: '12px',
        overflow: 'hidden',
      }}
    >
      <AlertSummaryCard />
      <PathogenDistribution />
      <BaseStatusTable />
    </div>
  );
}
