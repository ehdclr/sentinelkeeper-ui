import { SuspenseWrapper } from '@/shared/components/SuspenseWrapper'

export default function SetupPage({children}: {children: React.ReactNode}) {
  return (
    <SuspenseWrapper 
      loadingMessage="설정 페이지를 로드하는 중..." 
      loadingType="setup"
    >
      {children}
    </SuspenseWrapper>
  )
}