import { SuspenseWrapper } from "@/shared/components/SuspenseWrapper"
import { SetupWizard } from "@/widgets/setup-wizard/SetupWizard"

export default function SetupPage() {
  return (
    <SuspenseWrapper loadingMessage="Loading setup wizard..." loadingType="setup">
      <SetupWizard />
    </SuspenseWrapper>
  )
}
