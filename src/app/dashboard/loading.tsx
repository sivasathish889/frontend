import { DashboardOverviewSkeleton } from '@/components/Skeletons';

export default function DashboardLoading() {
  return (
    <div className="flex-1 md:ml-64 p-8">
      <DashboardOverviewSkeleton />
    </div>
  );
}
