"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Settings, Activity } from "lucide-react";
import Link from "next/link";

function HomePageContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <Database className="h-16 w-16 text-blue-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              SentinelKeeper
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              SentinelKeeper is for your infrastructure management and
              monitoring
            </p>

            <div className="flex justify-center space-x-4">
              <Link href="/dashboard">
                <Button size="lg">
                  <Activity className="h-5 w-5 mr-2" />
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Features</h2>
            <p className="text-gray-600">당신의 인프라 관리를 위한 모든 것</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Settings className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Easy Setup</h3>
                <p className="text-gray-600">
                  메타데이터를 저장할 데이터베이스를 설정합니다.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Activity className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">상태 모니터링</h3>
                <p className="text-gray-600">
                  실시간 인프라 상태 모니터링 및 알림
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Database className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">보안 & 잠금</h3>
                <p className="text-gray-600">
                  한 번의 설정으로 보안을 유지하며 잠금됩니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return <HomePageContent />;
}
