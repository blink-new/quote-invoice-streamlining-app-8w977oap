import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog'
import { useToast } from '../hooks/use-toast'
import {
  Plus,
  Search,
  Receipt,
  DollarSign,
  Calendar,
  Send,
  Edit,
  Trash2,
  MoreHorizontal,
  Eye,
  CreditCard,
  AlertCircle,
  Copy,
  Mail
} from 'lucide-react'

interface Invoice {
  id: string
  invoiceNumber: string
  clientName: string
  jobSite?: string
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  issueDate: string
  dueDate: string
  subtotal: number
  tax: number
  total: number
  itemCount: number
  quoteId?: string
}

export function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [paymentLinkDialog, setPaymentLinkDialog] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadInvoices()
  }, [])

  const loadInvoices = () => {
    // Load from localStorage for now
    const saved = localStorage.getItem('invoices')
    if (saved) {
      setInvoices(JSON.parse(saved))
    } else {
      // Initialize with sample data
      const sampleInvoices: Invoice[] = [
        {
          id: '1',
          invoiceNumber: 'INV-2024-001',
          clientName: 'Smith Residence',
          jobSite: '123 Main St, Sydney NSW',
          status: 'sent',
          issueDate: '2024-01-15',
          dueDate: '2024-01-22',
          subtotal: 3181.82,
          tax: 318.18,
          total: 3500.00,
          itemCount: 4,
          quoteId: '1'
        },
        {
          id: '2',
          invoiceNumber: 'INV-2024-002',
          clientName: 'Johnson Property Group',
          jobSite: 'Unit 5, 456 Business Ave',
          status: 'paid',
          issueDate: '2024-01-12',
          dueDate: '2024-01-19',
          subtotal: 2545.45,
          tax: 254.55,
          total: 2800.00,
          itemCount: 3,
          quoteId: '2'
        },
        {
          id: '3',
          invoiceNumber: 'INV-2024-003',
          clientName: 'Brown Commercial',
          status: 'overdue',
          issueDate: '2024-01-05',
          dueDate: '2024-01-12',
          subtotal: 1090.91,
          tax: 109.09,
          total: 1200.00,
          itemCount: 2
        },
        {
          id: '4',
          invoiceNumber: 'INV-2024-004',
          clientName: 'Davis Home',
          jobSite: '789 Residential St',
          status: 'draft',
          issueDate: '2024-01-18',
          dueDate: '2024-01-25',
          subtotal: 4090.91,
          tax: 409.09,
          total: 4500.00,
          itemCount: 6
        }
      ]
      setInvoices(sampleInvoices)
      localStorage.setItem('invoices', JSON.stringify(sampleInvoices))
    }
    setLoading(false)
  }

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'sent': return 'bg-blue-100 text-blue-800'
      case 'paid': return 'bg-green-100 text-green-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: Invoice['status']) => {
    switch (status) {
      case 'sent': return <Send className="h-3 w-3" />
      case 'paid': return <CreditCard className="h-3 w-3" />
      case 'overdue': return <AlertCircle className="h-3 w-3" />
      default: return null
    }
  }

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleDelete = (id: string) => {
    const updatedInvoices = invoices.filter(inv => inv.id !== id)
    setInvoices(updatedInvoices)
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices))
  }

  const handleStatusChange = (id: string, newStatus: Invoice['status']) => {
    const updatedInvoices = invoices.map(inv => 
      inv.id === id ? { ...inv, status: newStatus } : inv
    )
    setInvoices(updatedInvoices)
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices))
  }

  const getDaysOverdue = (dueDate: string) => {
    const due = new Date(dueDate)
    const today = new Date()
    const diffTime = today.getTime() - due.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const handlePaymentLink = async (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId)
    if (!invoice) return

    try {
      // Simulate creating Stripe payment link
      const paymentLink = `https://pay.stripe.com/invoice/${invoiceId}`
      
      // Copy to clipboard
      await navigator.clipboard.writeText(paymentLink)
      
      toast({
        title: "Payment link created",
        description: "Payment link copied to clipboard. Share this with your client.",
      })
      
      setPaymentLinkDialog(invoiceId)
    } catch (error) {
      toast({
        title: "Error creating payment link",
        description: "There was a problem creating the payment link. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSendReminder = async (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId)
    if (!invoice) return

    try {
      // Simulate sending email reminder
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Reminder sent",
        description: `Overdue reminder sent to ${invoice.clientName}`,
      })
    } catch (error) {
      toast({
        title: "Error sending reminder",
        description: "There was a problem sending the reminder. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSendInvoice = async (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId)
    if (!invoice) return

    try {
      // Simulate sending invoice email
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update status to sent
      handleStatusChange(invoiceId, 'sent')
      
      toast({
        title: "Invoice sent",
        description: `Invoice ${invoice.invoiceNumber} sent to ${invoice.clientName}`,
      })
    } catch (error) {
      toast({
        title: "Error sending invoice",
        description: "There was a problem sending the invoice. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
          <p className="text-muted-foreground mt-1">
            Manage your invoices and track payments
          </p>
        </div>
        <Button asChild>
          <Link to="/invoices/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="flex h-10 w-full sm:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Invoices</p>
                <p className="text-2xl font-bold">{invoices.length}</p>
              </div>
              <Receipt className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Outstanding</p>
                <p className="text-2xl font-bold">
                  {invoices.filter(inv => inv.status === 'sent').length}
                </p>
              </div>
              <Send className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-red-600">
                  {invoices.filter(inv => inv.status === 'overdue').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">
                  ${invoices.reduce((sum, inv) => sum + inv.total, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInvoices.map((invoice) => (
          <Card key={invoice.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{invoice.invoiceNumber}</CardTitle>
                  <CardDescription className="mt-1">
                    {invoice.clientName}
                  </CardDescription>
                  {invoice.jobSite && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {invoice.jobSite}
                    </p>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={`/invoices/${invoice.id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    {invoice.status === 'draft' && (
                      <DropdownMenuItem onClick={() => handleSendInvoice(invoice.id)}>
                        <Mail className="h-4 w-4 mr-2" />
                        Send to Client
                      </DropdownMenuItem>
                    )}
                    {invoice.status === 'sent' && (
                      <DropdownMenuItem onClick={() => handleStatusChange(invoice.id, 'paid')}>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Mark as Paid
                      </DropdownMenuItem>
                    )}
                    {invoice.status === 'overdue' && (
                      <DropdownMenuItem onClick={() => handleStatusChange(invoice.id, 'paid')}>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Mark as Paid
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem 
                      onClick={() => handleDelete(invoice.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge 
                  variant="secondary" 
                  className={`${getStatusColor(invoice.status)} flex items-center gap-1`}
                >
                  {getStatusIcon(invoice.status)}
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {invoice.itemCount} item{invoice.itemCount !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>${invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GST:</span>
                  <span>${invoice.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-1">
                  <span>Total:</span>
                  <span>${invoice.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Issued: {new Date(invoice.issueDate).toLocaleDateString()}
                </div>
                <div className={invoice.status === 'overdue' ? 'text-red-600 font-medium' : ''}>
                  Due: {new Date(invoice.dueDate).toLocaleDateString()}
                  {invoice.status === 'overdue' && (
                    <span className="ml-1">({getDaysOverdue(invoice.dueDate)} days overdue)</span>
                  )}
                </div>
              </div>

              {invoice.quoteId && (
                <div className="text-xs text-primary bg-primary/5 px-2 py-1 rounded">
                  Created from Quote
                </div>
              )}

              {invoice.status === 'sent' && (
                <div className="space-y-2">
                  <Button 
                    variant="default" 
                    className="w-full" 
                    size="sm"
                    onClick={() => handlePaymentLink(invoice.id)}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Create Payment Link
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="sm"
                    onClick={() => handleStatusChange(invoice.id, 'paid')}
                  >
                    Record Manual Payment
                  </Button>
                </div>
              )}
              
              {invoice.status === 'overdue' && (
                <div className="space-y-2">
                  <Button 
                    variant="default" 
                    className="w-full" 
                    size="sm"
                    onClick={() => handleSendReminder(invoice.id)}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Reminder
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="sm"
                    onClick={() => handlePaymentLink(invoice.id)}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payment Link
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInvoices.length === 0 && (
        <div className="text-center py-12">
          <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {searchTerm || statusFilter !== 'all' ? 'No invoices found' : 'No invoices yet'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Create your first invoice to get started'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <Button asChild>
              <Link to="/invoices/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Invoice
              </Link>
            </Button>
          )}
        </div>
      )}

      {/* Payment Link Dialog */}
      <Dialog open={!!paymentLinkDialog} onOpenChange={() => setPaymentLinkDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Link Created</DialogTitle>
            <DialogDescription>
              Share this secure payment link with your client to collect payment online.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium mb-2">Payment Link:</p>
              <div className="flex items-center space-x-2">
                <Input
                  value={`https://pay.stripe.com/invoice/${paymentLinkDialog}`}
                  readOnly
                  className="text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(`https://pay.stripe.com/invoice/${paymentLinkDialog}`)
                    toast({
                      title: "Copied!",
                      description: "Payment link copied to clipboard",
                    })
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  // Simulate sending payment link via email
                  toast({
                    title: "Payment link sent",
                    description: "Payment link sent to client via email",
                  })
                  setPaymentLinkDialog(null)
                }}
              >
                <Mail className="h-4 w-4 mr-2" />
                Email to Client
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  // Simulate sending payment link via SMS
                  toast({
                    title: "Payment link sent",
                    description: "Payment link sent to client via SMS",
                  })
                  setPaymentLinkDialog(null)
                }}
              >
                <Send className="h-4 w-4 mr-2" />
                Send via SMS
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}