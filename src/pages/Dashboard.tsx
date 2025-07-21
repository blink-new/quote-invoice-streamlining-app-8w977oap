import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { blink } from '../blink/client'
import {
  DollarSign,
  FileText,
  Clock,
  TrendingUp,
  Plus,
  Calendar,
  Users,
  Receipt
} from 'lucide-react'

interface DashboardStats {
  outstandingRevenue: number
  pendingQuotes: number
  jobsThisWeek: number
  totalClients: number
}

interface RecentActivity {
  id: string
  type: 'quote' | 'invoice' | 'payment' | 'job'
  title: string
  client: string
  amount?: number
  status: string
  date: string
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    outstandingRevenue: 0,
    pendingQuotes: 0,
    jobsThisWeek: 0,
    totalClients: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  const loadDashboardData = async () => {
    try {
      // For now, we'll use mock data until we implement the backend
      // In a real app, these would be API calls to get actual data
      setStats({
        outstandingRevenue: 15750.00,
        pendingQuotes: 8,
        jobsThisWeek: 12,
        totalClients: 45
      })

      setRecentActivity([
        {
          id: '1',
          type: 'quote',
          title: 'Bathroom Renovation Quote',
          client: 'Smith Residence',
          amount: 3500.00,
          status: 'sent',
          date: '2 hours ago'
        },
        {
          id: '2',
          type: 'payment',
          title: 'Kitchen Installation Invoice',
          client: 'Johnson Property',
          amount: 2800.00,
          status: 'paid',
          date: '1 day ago'
        },
        {
          id: '3',
          type: 'job',
          title: 'Plumbing Repair',
          client: 'Brown Commercial',
          status: 'scheduled',
          date: 'Tomorrow 9:00 AM'
        },
        {
          id: '4',
          type: 'invoice',
          title: 'Electrical Work Invoice',
          client: 'Davis Home',
          amount: 1200.00,
          status: 'overdue',
          date: '3 days ago'
        }
      ])
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const getStatusColor = (type: string, status: string) => {
    if (type === 'payment' && status === 'paid') return 'bg-green-100 text-green-800'
    if (status === 'overdue') return 'bg-red-100 text-red-800'
    if (status === 'sent') return 'bg-blue-100 text-blue-800'
    if (status === 'scheduled') return 'bg-purple-100 text-purple-800'
    return 'bg-gray-100 text-gray-800'
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'quote': return <FileText className="h-4 w-4" />
      case 'invoice': return <Receipt className="h-4 w-4" />
      case 'payment': return <DollarSign className="h-4 w-4" />
      case 'job': return <Calendar className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your business.
          </p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <Button asChild>
            <Link to="/quotes/new">
              <Plus className="h-4 w-4 mr-2" />
              New Quote
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.outstandingRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Quotes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingQuotes}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting client response
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs This Week</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.jobsThisWeek}</div>
            <p className="text-xs text-muted-foreground">
              3 scheduled for today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              5 new this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest quotes, invoices, and jobs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="p-2 bg-muted rounded-lg">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {activity.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.client}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    {activity.amount && (
                      <p className="text-sm font-medium">
                        ${activity.amount.toLocaleString()}
                      </p>
                    )}
                    <Badge 
                      variant="secondary" 
                      className={getStatusColor(activity.type, activity.status)}
                    >
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to get you started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button asChild variant="outline" className="h-20 flex-col">
                <Link to="/quotes/new">
                  <FileText className="h-6 w-6 mb-2" />
                  Create Quote
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col">
                <Link to="/invoices/new">
                  <Receipt className="h-6 w-6 mb-2" />
                  New Invoice
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col">
                <Link to="/clients">
                  <Users className="h-6 w-6 mb-2" />
                  Add Client
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col">
                <Link to="/calendar">
                  <Calendar className="h-6 w-6 mb-2" />
                  Schedule Job
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}