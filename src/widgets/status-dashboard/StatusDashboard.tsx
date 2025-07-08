'use client'

import { SuspenseWrapper } from '@/shared/components/SuspenseWrapper'
import { StatusContainer } from '@/features/status/ui/StatusContainer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  RefreshCw, 
  Settings, 
  Database, 
  Activity,
  Clock,
  ArrowLeft,
  AlertTriangle
} from 'lucide-react'
import Link from 'next/link'
import { useAsyncData } from '@/shared/hooks/useAsyncData'
import { getSetupStatus } from '@/features/status/api/getStatus'
import { getHealth } from '@/features/status/api/getHealth'

function StatusDashboardContent() {
  const { 
    data: statusResponse, 
    refetch: refetchStatus,
    isRefetching: isStatusRefetching
  } = useAsyncData(() => getSetupStatus())
  
  const { 
    data: healthResponse, 
    refetch: refetchHealth,
    isRefetching: isHealthRefetching
  } = useAsyncData(() => getHealth())

  const status = statusResponse?.data
  const health = healthResponse?.data
  const isRefetching = isStatusRefetching || isHealthRefetching

  // Redirect to setup if not configured
  if (status && !status.configured) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Setup Required</h2>
            <p className="text-gray-600 mb-4">
              Database is not configured yet. Please complete the setup first.
            </p>
            <Link href="/setup">
              <Button>
                <Settings className="h-4 w-4 mr-2" />
                Go to Setup
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleRefresh = () => {
    refetchStatus()
    refetchHealth()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/setup">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Setup
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Database Dashboard
                </h1>
                <p className="text-gray-600">
                  Monitor your database status and health
                </p>
              </div>
            </div>
            
            <Button 
              onClick={handleRefresh} 
              disabled={isRefetching}
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <p className="text-2xl font-bold">
                      {health?.status === 'healthy' ? 'Healthy' : 
                       health?.status === 'unhealthy' ? 'Unhealthy' : 'Unknown'}
                    </p>
                  </div>
                  <Activity className={`h-8 w-8 ${
                    health?.status === 'healthy' ? 'text-green-500' : 'text-red-500'
                  }`} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Database</p>
                    <p className="text-2xl font-bold capitalize">
                      {status?.type || 'N/A'}
                    </p>
                  </div>
                  <Database className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Configuration</p>
                    <p className="text-2xl font-bold">
                      {status?.locked ? 'Locked' : 'Unlocked'}
                    </p>
                  </div>
                  <Settings className={`h-8 w-8 ${
                    status?.locked ? 'text-yellow-500' : 'text-gray-500'
                  }`} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Uptime</p>
                    <p className="text-2xl font-bold">
                      {status?.createdAt ? 
                        Math.floor((Date.now() - new Date(status.createdAt).getTime()) / (1000 * 60 * 60)) + 'h'
                        : 'N/A'
                      }
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Status */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Status Panel */}
            <div>
              <SuspenseWrapper
                loadingMessage="Loading status details..."
                loadingType="status"
              >
                <StatusContainer />
              </SuspenseWrapper>
            </div>

            {/* Configuration Details */}
            <Card>
              <CardHeader>
                <CardTitle>Configuration Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {status && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Database Type</span>
                      <Badge variant="outline">{status.type}</Badge>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Configuration Status</span>
                      <Badge variant={status.configured ? "default" : "secondary"}>
                        {status.configured ? 'Configured' : 'Not Configured'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Lock Status</span>
                      <Badge variant={status.locked ? "destructive" : "secondary"}>
                        {status.locked ? 'Locked' : 'Unlocked'}
                      </Badge>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Config File</span>
                      <Badge variant={status.configExists ? "default" : "secondary"}>
                        {status.configExists ? 'Exists' : 'Missing'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Lock File</span>
                      <Badge variant={status.lockExists ? "default" : "secondary"}>
                        {status.lockExists ? 'Exists' : 'Missing'}
                      </Badge>
                    </div>
                    
                    {status.createdAt && (
                      <>
                        <Separator />
                        <div className="space-y-1">
                          <span className="text-sm font-medium">Configured At</span>
                          <p className="text-sm text-gray-600">
                            {new Date(status.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={handleRefresh} 
                  disabled={isRefetching}
                  variant="outline"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
                  Refresh Status
                </Button>
                
                <Link href="/setup">
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    View Setup
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export function StatusDashboard() {
  return (
    <SuspenseWrapper
      loadingMessage="Loading dashboard..."
      loadingType="dashboard"
    >
      <StatusDashboardContent />
    </SuspenseWrapper>
  )
}