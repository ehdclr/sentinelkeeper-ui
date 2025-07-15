import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Search className="h-10 w-10 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">404 - Page Not Found</CardTitle>
          <CardDescription className="text-base">
            죄송합니다. 요청하신 페이지를 찾을 수 없습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>페이지가 이동되었거나 삭제되었을 수 있습니다.</p>
            <p>URL을 다시 확인해주세요.</p>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                홈으로 돌아가기
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                대시보드로 이동
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 