import { Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function SecurityNotice() {
  return (
    <Alert className="mt-6">
      <Shield className="h-4 w-4" />
      <AlertDescription>
        <strong>Security:</strong> Root account recovery requires PEM key
        authentication for enhanced security.
      </AlertDescription>
    </Alert>
  );
}
