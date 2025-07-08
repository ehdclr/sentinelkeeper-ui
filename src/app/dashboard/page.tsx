import { SuspenseWrapper } from '@/shared/components/SuspenseWrapper'
import { StatusDashboard } from '@/widgets/status-dashboard/StatusDashboard'

export default function DashboardPage() {
  return (
    <SuspenseWrapper 
      loadingMessage="Loading dashboard..." 
      loadingType="dashboard"
    >
      <StatusDashboard />
    </SuspenseWrapper>
  )
}