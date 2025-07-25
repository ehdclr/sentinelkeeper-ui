import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DemoCredentials() {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-sm">Demo Credentials</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-sm">
          <div className="font-medium">Root User:</div>
          <div className="text-gray-600">
            Username: admin | Password: password123
          </div>
        </div>
        <div className="text-sm">
          <div className="font-medium">Regular User:</div>
          <div className="text-gray-600">
            Username: user1 | Password: password123
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
