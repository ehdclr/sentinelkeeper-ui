import { SuspenseWrapper } from '@/shared/components/SuspenseWrapper'
import { SetupForm } from '@/widgets/setup-form/SetupForm'

export default function SetupPage() {
  return (
    <SuspenseWrapper 
      loadingMessage="설정 페이지를 로드하는 중..." 
      loadingType="setup"
    >
      <SetupForm />
    </SuspenseWrapper>
  )
}