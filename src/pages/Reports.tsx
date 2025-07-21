import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Receipt,
  AlertTriangle,
  Calendar,
  Download,
  Filter
} from 'lucide-react'

interface ReportData {
  profitLoss: {
    totalRevenue: number
    totalExpenses: number
    netProfit: number
    profitMargin: number
    monthlyData: Array<{
      month: string
      revenue: number
      expenses: number
      profit: number
    }>
  }
  revenueByClient: Array<{
    clientName: string
    totalBilled: number
    totalPaid: number
    outstanding: number
    invoiceCount: number
  }>
  agedDebtors: Array<{
    clientName: string
    invoiceNumber: string
    dueDate: string
    amountDue: number
    daysOverdue: number
    status: string
  }>
  monthlyTrends: Array<{
    month: string
    quotes: number
    invoices: number
    payments: number
  }>
}

export function Reports() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState('12months')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReportData()
  }, [selectedPeriod])

  const loadReportData = () => {
    // Simulate loading report data
    setTimeout(() => {
      const mockData: ReportData = {
        profitLoss: {
          totalRevenue: 125000,
          totalExpenses: 45000,
          netProfit: 80000,
          profitMargin: 64,
          monthlyData: [
            { month: 'Jan', revenue: 8500, expenses: 3200, profit: 5300 },
            { month: 'Feb', revenue: 9200, expenses: 3800, profit: 5400 },
            { month: 'Mar', revenue: 11500, expenses: 4200, profit: 7300 },
            { month: 'Apr', revenue: 10800, expenses: 3900, profit: 6900 },
            { month: 'May', revenue: 12200, expenses: 4500, profit: 7700 },
            { month: 'Jun', revenue: 13500, expenses: 4800, profit: 8700 },
            { month: 'Jul', revenue: 11800, expenses: 4100, profit: 7700 },
            { month: 'Aug', revenue: 10500, expenses: 3700, profit: 6800 },
            { month: 'Sep', revenue: 9800, expenses: 3500, profit: 6300 },
            { month: 'Oct', revenue: 12500, expenses: 4600, profit: 7900 },
            { month: 'Nov', revenue: 14200, expenses: 5200, profit: 9000 },
            { month: 'Dec', revenue: 15700, expenses: 5500, profit: 10200 }
          ]
        },
        revenueByClient: [
          {
            clientName: 'Smith Residence',
            totalBilled: 28500,
            totalPaid: 25000,
            outstanding: 3500,
            invoiceCount: 8
          },
          {
            clientName: 'Johnson Property Group',
            totalBilled: 45200,
            totalPaid: 45200,
            outstanding: 0,
            invoiceCount: 12
          },
          {
            clientName: 'Brown Commercial',
            totalBilled: 18900,
            totalPaid: 17700,
            outstanding: 1200,
            invoiceCount: 5
          },
          {
            clientName: 'Davis Home',
            totalBilled: 12800,
            totalPaid: 8300,
            outstanding: 4500,
            invoiceCount: 4
          },
          {
            clientName: 'Wilson Apartments',
            totalBilled: 19600,
            totalPaid: 19600,
            outstanding: 0,
            invoiceCount: 6
          }
        ],
        agedDebtors: [
          {
            clientName: 'Brown Commercial',
            invoiceNumber: 'INV-2024-003',
            dueDate: '2024-01-12',
            amountDue: 1200,
            daysOverdue: 25,
            status: 'overdue'
          },
          {
            clientName: 'Smith Residence',
            invoiceNumber: 'INV-2024-001',
            dueDate: '2024-01-22',
            amountDue: 3500,
            daysOverdue: 15,
            status: 'overdue'
          },
          {
            clientName: 'Davis Home',
            invoiceNumber: 'INV-2024-004',
            dueDate: '2024-01-25',
            amountDue: 4500,
            daysOverdue: 12,
            status: 'overdue'
          }
        ],
        monthlyTrends: [
          { month: 'Jan', quotes: 15, invoices: 12, payments: 10 },
          { month: 'Feb', quotes: 18, invoices: 14, payments: 13 },
          { month: 'Mar', quotes: 22, invoices: 18, payments: 16 },
          { month: 'Apr', quotes: 20, invoices: 16, payments: 15 },
          { month: 'May', quotes: 25, invoices: 20, payments: 18 },
          { month: 'Jun', quotes: 28, invoices: 22, payments: 20 }
        ]
      }
      setReportData(mockData)
      setLoading(false)
    }, 1000)
  }

  const COLORS = ['#2563EB', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6']

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!reportData) return null

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Business Reports</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive insights into your business performance
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="12months">Last 12 Months</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${reportData.profitLoss.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+12.5%</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p className="text-2xl font-bold">${reportData.profitLoss.netProfit.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">{reportData.profitLoss.profitMargin}% margin</span>
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Clients</p>
                <p className="text-2xl font-bold">{reportData.revenueByClient.length}</p>
                <div className="flex items-center mt-1">
                  <Users className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-sm text-blue-600">+3 this month</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Outstanding</p>
                <p className="text-2xl font-bold text-red-600">
                  ${reportData.revenueByClient.reduce((sum, client) => sum + client.outstanding, 0).toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-600">{reportData.agedDebtors.length} overdue</span>
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profit & Loss Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Profit & Loss Trend</CardTitle>
            <CardDescription>Monthly revenue, expenses, and profit</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.profitLoss.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
                <Bar dataKey="revenue" fill="#2563EB" name="Revenue" />
                <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                <Bar dataKey="profit" fill="#10B981" name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue by Client Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Client</CardTitle>
            <CardDescription>Distribution of revenue across clients</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reportData.revenueByClient}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ clientName, percent }) => `${clientName} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="totalBilled"
                >
                  {reportData.revenueByClient.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Client Table */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Client</CardTitle>
          <CardDescription>Detailed breakdown of client revenue and outstanding amounts</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead className="text-right">Total Billed</TableHead>
                <TableHead className="text-right">Total Paid</TableHead>
                <TableHead className="text-right">Outstanding</TableHead>
                <TableHead className="text-right">Invoices</TableHead>
                <TableHead className="text-right">Payment Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.revenueByClient.map((client) => {
                const paymentRate = (client.totalPaid / client.totalBilled) * 100
                return (
                  <TableRow key={client.clientName}>
                    <TableCell className="font-medium">{client.clientName}</TableCell>
                    <TableCell className="text-right">${client.totalBilled.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${client.totalPaid.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <span className={client.outstanding > 0 ? 'text-red-600 font-medium' : ''}>
                        ${client.outstanding.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{client.invoiceCount}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={paymentRate === 100 ? 'default' : paymentRate >= 80 ? 'secondary' : 'destructive'}>
                        {paymentRate.toFixed(0)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Aged Debtors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            Aged Debtors Report
          </CardTitle>
          <CardDescription>Outstanding invoices requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          {reportData.agedDebtors.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Amount Due</TableHead>
                  <TableHead className="text-right">Days Overdue</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.agedDebtors.map((debtor) => (
                  <TableRow key={debtor.invoiceNumber}>
                    <TableCell className="font-medium">{debtor.clientName}</TableCell>
                    <TableCell>{debtor.invoiceNumber}</TableCell>
                    <TableCell>{new Date(debtor.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right font-medium text-red-600">
                      ${debtor.amountDue.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="destructive">{debtor.daysOverdue} days</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Send Reminder
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <div className="text-green-600 mb-2">
                <Receipt className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-green-600">All caught up!</h3>
              <p className="text-muted-foreground">No overdue invoices at this time.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Business Activity Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Business Activity Trends</CardTitle>
          <CardDescription>Monthly quotes, invoices, and payments</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportData.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="quotes" stroke="#2563EB" strokeWidth={2} name="Quotes" />
              <Line type="monotone" dataKey="invoices" stroke="#F59E0B" strokeWidth={2} name="Invoices" />
              <Line type="monotone" dataKey="payments" stroke="#10B981" strokeWidth={2} name="Payments" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}