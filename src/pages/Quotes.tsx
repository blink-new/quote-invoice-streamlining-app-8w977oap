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
  Plus,
  Search,
  FileText,
  DollarSign,
  Calendar,
  Send,
  Edit,
  Trash2,
  MoreHorizontal,
  Eye
} from 'lucide-react'

interface Quote {
  id: string
  quoteNumber: string
  clientName: string
  jobSite?: string
  status: 'draft' | 'sent' | 'accepted' | 'declined' | 'expired'
  issueDate: string
  expiryDate: string
  subtotal: number
  tax: number
  total: number
  itemCount: number
}

export function Quotes() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadQuotes()
  }, [])

  const loadQuotes = () => {
    // Load from localStorage for now
    const saved = localStorage.getItem('quotes')
    if (saved) {
      setQuotes(JSON.parse(saved))
    } else {
      // Initialize with sample data
      const sampleQuotes: Quote[] = [
        {
          id: '1',
          quoteNumber: 'QUO-2024-001',
          clientName: 'Smith Residence',
          jobSite: '123 Main St, Sydney NSW',
          status: 'sent',
          issueDate: '2024-01-15',
          expiryDate: '2024-02-15',
          subtotal: 3181.82,
          tax: 318.18,
          total: 3500.00,
          itemCount: 4
        },
        {
          id: '2',
          quoteNumber: 'QUO-2024-002',
          clientName: 'Johnson Property Group',
          jobSite: 'Unit 5, 456 Business Ave',
          status: 'accepted',
          issueDate: '2024-01-12',
          expiryDate: '2024-02-12',
          subtotal: 2545.45,
          tax: 254.55,
          total: 2800.00,
          itemCount: 3
        },
        {
          id: '3',
          quoteNumber: 'QUO-2024-003',
          clientName: 'Brown Commercial',
          status: 'draft',
          issueDate: '2024-01-18',
          expiryDate: '2024-02-18',
          subtotal: 1090.91,
          tax: 109.09,
          total: 1200.00,
          itemCount: 2
        },
        {
          id: '4',
          quoteNumber: 'QUO-2024-004',
          clientName: 'Davis Home',
          jobSite: '789 Residential St',
          status: 'expired',
          issueDate: '2023-12-20',
          expiryDate: '2024-01-20',
          subtotal: 4090.91,
          tax: 409.09,
          total: 4500.00,
          itemCount: 6
        }
      ]
      setQuotes(sampleQuotes)
      localStorage.setItem('quotes', JSON.stringify(sampleQuotes))
    }
    setLoading(false)
  }

  const getStatusColor = (status: Quote['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'sent': return 'bg-blue-100 text-blue-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'declined': return 'bg-red-100 text-red-800'
      case 'expired': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: Quote['status']) => {
    switch (status) {
      case 'sent': return <Send className="h-3 w-3" />
      case 'accepted': return <FileText className="h-3 w-3" />
      default: return null
    }
  }

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleDelete = (id: string) => {
    const updatedQuotes = quotes.filter(q => q.id !== id)
    setQuotes(updatedQuotes)
    localStorage.setItem('quotes', JSON.stringify(updatedQuotes))
  }

  const handleStatusChange = (id: string, newStatus: Quote['status']) => {
    const updatedQuotes = quotes.map(q => 
      q.id === id ? { ...q, status: newStatus } : q
    )
    setQuotes(updatedQuotes)
    localStorage.setItem('quotes', JSON.stringify(updatedQuotes))
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
          <h1 className="text-3xl font-bold text-foreground">Quotes</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your client quotes
          </p>
        </div>
        <Button asChild>
          <Link to="/quotes/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Quote
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search quotes..."
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
          <option value="accepted">Accepted</option>
          <option value="declined">Declined</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Quotes</p>
                <p className="text-2xl font-bold">{quotes.length}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">
                  {quotes.filter(q => q.status === 'sent').length}
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
                <p className="text-sm text-muted-foreground">Accepted</p>
                <p className="text-2xl font-bold">
                  {quotes.filter(q => q.status === 'accepted').length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">
                  ${quotes.reduce((sum, q) => sum + q.total, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quotes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuotes.map((quote) => (
          <Card key={quote.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{quote.quoteNumber}</CardTitle>
                  <CardDescription className="mt-1">
                    {quote.clientName}
                  </CardDescription>
                  {quote.jobSite && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {quote.jobSite}
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
                      <Link to={`/quotes/${quote.id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    {quote.status === 'draft' && (
                      <DropdownMenuItem onClick={() => handleStatusChange(quote.id, 'sent')}>
                        <Send className="h-4 w-4 mr-2" />
                        Send to Client
                      </DropdownMenuItem>
                    )}
                    {quote.status === 'sent' && (
                      <>
                        <DropdownMenuItem onClick={() => handleStatusChange(quote.id, 'accepted')}>
                          Mark as Accepted
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(quote.id, 'declined')}>
                          Mark as Declined
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem 
                      onClick={() => handleDelete(quote.id)}
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
                  className={`${getStatusColor(quote.status)} flex items-center gap-1`}
                >
                  {getStatusIcon(quote.status)}
                  {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {quote.itemCount} item{quote.itemCount !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>${quote.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GST:</span>
                  <span>${quote.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-1">
                  <span>Total:</span>
                  <span>${quote.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Issued: {new Date(quote.issueDate).toLocaleDateString()}
                </div>
                <div>
                  Expires: {new Date(quote.expiryDate).toLocaleDateString()}
                </div>
              </div>

              {quote.status === 'accepted' && (
                <Button asChild variant="outline" className="w-full" size="sm">
                  <Link to={`/invoices/new?fromQuote=${quote.id}`}>
                    Convert to Invoice
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredQuotes.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {searchTerm || statusFilter !== 'all' ? 'No quotes found' : 'No quotes yet'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Create your first quote to get started'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <Button asChild>
              <Link to="/quotes/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Quote
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}