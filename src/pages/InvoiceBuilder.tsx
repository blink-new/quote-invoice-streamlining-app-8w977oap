import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Switch } from '../components/ui/switch'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { useToast } from '../hooks/use-toast'
import {
  ArrowLeft,
  Plus,
  Trash2,
  Package,
  Calculator,
  Send,
  Save,
  DollarSign
} from 'lucide-react'

interface Client {
  id: string
  name: string
  email: string
  phone: string
  address: string
}

interface JobSite {
  id: string
  siteName: string
  address: string
  accessDetails?: string
  clientId: string
}

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  isGstApplicable: boolean
  total: number
}

interface Quote {
  id: string
  quoteNumber: string
  clientId: string
  jobSiteId?: string
  status: 'draft' | 'sent' | 'accepted' | 'declined' | 'expired'
  issueDate: string
  expiryDate: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  notes?: string
  attachments?: string[]
}

interface Invoice {
  id?: string
  invoiceNumber: string
  clientId: string
  jobSiteId?: string
  quoteId?: string
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  issueDate: string
  dueDate: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  notes?: string
  attachments?: string[]
}

export function InvoiceBuilder() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const isEditing = Boolean(id)
  const fromQuoteId = searchParams.get('fromQuote')

  // State
  const [clients, setClients] = useState<Client[]>([])
  const [jobSites, setJobSites] = useState<JobSite[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Invoice form state
  const [invoice, setInvoice] = useState<Invoice>({
    invoiceNumber: '',
    clientId: '',
    jobSiteId: '',
    status: 'draft',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    notes: '',
    attachments: []
  })

  // New item form state
  const [newItem, setNewItem] = useState<Omit<InvoiceItem, 'id' | 'total'>>({
    description: '',
    quantity: 1,
    unitPrice: 0,
    isGstApplicable: true
  })

  const calculateTotals = useCallback(() => {
    const subtotal = invoice.items.reduce((sum, item) => sum + item.total, 0)
    const tax = invoice.items.reduce((sum, item) => {
      return sum + (item.isGstApplicable ? item.total * 0.1 : 0)
    }, 0)
    const total = subtotal + tax

    setInvoice(prev => ({
      ...prev,
      subtotal,
      tax,
      total
    }))
  }, [invoice.items])

  const loadData = useCallback(async () => {
    try {
      // Mock data - in real app these would be API calls
      const mockClients: Client[] = [
        {
          id: '1',
          name: 'Smith Residence',
          email: 'john.smith@email.com',
          phone: '0412 345 678',
          address: '123 Main St, Sydney NSW 2000'
        },
        {
          id: '2',
          name: 'Johnson Property Group',
          email: 'contact@johnsonpg.com.au',
          phone: '02 9876 5432',
          address: '456 Business Ave, Melbourne VIC 3000'
        },
        {
          id: '3',
          name: 'Brown Commercial',
          email: 'admin@browncommercial.com.au',
          phone: '07 3456 7890',
          address: '789 Industrial Rd, Brisbane QLD 4000'
        }
      ]

      const mockJobSites: JobSite[] = [
        {
          id: '1',
          siteName: 'Main Residence',
          address: '123 Main St, Sydney NSW 2000',
          accessDetails: 'Key under mat',
          clientId: '1'
        },
        {
          id: '2',
          siteName: 'Holiday Home',
          address: '456 Beach Rd, Byron Bay NSW 2481',
          accessDetails: 'Lockbox code: 1234',
          clientId: '1'
        },
        {
          id: '3',
          siteName: 'Office Building',
          address: '456 Business Ave, Melbourne VIC 3000',
          accessDetails: 'Reception desk',
          clientId: '2'
        },
        {
          id: '4',
          siteName: 'Warehouse',
          address: '789 Industrial Rd, Brisbane QLD 4000',
          accessDetails: 'Loading dock entrance',
          clientId: '3'
        }
      ]

      setClients(mockClients)
      setJobSites(mockJobSites)

      // If creating from quote, load quote data
      if (fromQuoteId) {
        const savedQuotes = localStorage.getItem('quotes')
        if (savedQuotes) {
          const quotes = JSON.parse(savedQuotes)
          const sourceQuote: Quote = quotes.find((q: Quote) => q.id === fromQuoteId)
          if (sourceQuote) {
            const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-3).padStart(3, '0')}`
            setInvoice({
              invoiceNumber,
              clientId: sourceQuote.clientId,
              jobSiteId: sourceQuote.jobSiteId,
              quoteId: sourceQuote.id,
              status: 'draft',
              issueDate: new Date().toISOString().split('T')[0],
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              items: sourceQuote.items.map(item => ({ ...item, id: `inv-${item.id}` })),
              subtotal: sourceQuote.subtotal,
              tax: sourceQuote.tax,
              total: sourceQuote.total,
              notes: sourceQuote.notes || '',
              attachments: sourceQuote.attachments || []
            })
            
            toast({
              title: "Success",
              description: `Invoice created from quote ${sourceQuote.quoteNumber}`
            })
          }
        }
      } else if (isEditing && id) {
        // Load existing invoice
        const savedInvoices = localStorage.getItem('invoices')
        if (savedInvoices) {
          const invoices = JSON.parse(savedInvoices)
          const existingInvoice = invoices.find((inv: Invoice) => inv.id === id)
          if (existingInvoice) {
            setInvoice(existingInvoice)
          }
        }
      } else {
        // Generate invoice number for new invoice
        const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-3).padStart(3, '0')}`
        setInvoice(prev => ({ ...prev, invoiceNumber }))
      }
    } catch (error) {
      console.error('Failed to load data:', error)
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [fromQuoteId, isEditing, id, toast])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    calculateTotals()
  }, [calculateTotals])

  const addItem = () => {
    if (!newItem.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a description for the item.",
        variant: "destructive"
      })
      return
    }

    const item: InvoiceItem = {
      id: Date.now().toString(),
      ...newItem,
      total: newItem.quantity * newItem.unitPrice
    }

    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, item]
    }))

    // Reset form
    setNewItem({
      description: '',
      quantity: 1,
      unitPrice: 0,
      isGstApplicable: true
    })
  }

  const removeItem = (itemId: string) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }))
  }

  const updateItem = (itemId: string, field: keyof InvoiceItem, value: any) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value }
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.total = updatedItem.quantity * updatedItem.unitPrice
          }
          return updatedItem
        }
        return item
      })
    }))
  }

  const saveInvoice = async (status: 'draft' | 'sent' = 'draft') => {
    if (!invoice.clientId) {
      toast({
        title: "Validation Error",
        description: "Please select a client.",
        variant: "destructive"
      })
      return
    }

    if (invoice.items.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one item to the invoice.",
        variant: "destructive"
      })
      return
    }

    setSaving(true)
    try {
      const invoiceToSave = {
        ...invoice,
        status,
        id: invoice.id || Date.now().toString()
      }

      // Save to localStorage (in real app this would be an API call)
      const savedInvoices = localStorage.getItem('invoices')
      const invoices = savedInvoices ? JSON.parse(savedInvoices) : []
      
      if (isEditing) {
        const index = invoices.findIndex((inv: Invoice) => inv.id === invoice.id)
        if (index !== -1) {
          invoices[index] = invoiceToSave
        }
      } else {
        invoices.push(invoiceToSave)
      }
      
      localStorage.setItem('invoices', JSON.stringify(invoices))

      toast({
        title: "Success",
        description: status === 'sent' 
          ? "Invoice sent to client successfully!" 
          : "Invoice saved successfully!"
      })

      navigate('/invoices')
    } catch (error) {
      console.error('Failed to save invoice:', error)
      toast({
        title: "Error",
        description: "Failed to save invoice. Please try again.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const getClientJobSites = () => {
    return jobSites.filter(site => site.clientId === invoice.clientId)
  }

  const selectedClient = clients.find(c => c.id === invoice.clientId)
  const selectedJobSite = jobSites.find(s => s.id === invoice.jobSiteId)

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/invoices')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {isEditing ? 'Edit Invoice' : fromQuoteId ? 'Create Invoice from Quote' : 'Create Invoice'}
            </h1>
            <p className="text-muted-foreground">
              {invoice.invoiceNumber && `Invoice #${invoice.invoiceNumber}`}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => saveInvoice('draft')} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={() => saveInvoice('sent')} disabled={saving}>
            <Send className="h-4 w-4 mr-2" />
            Send to Client
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client & Job Site Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Client & Job Site</CardTitle>
              <CardDescription>
                Select the client and job site for this invoice
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Client *</Label>
                  <Select value={invoice.clientId} onValueChange={(value) => {
                    setInvoice(prev => ({ ...prev, clientId: value, jobSiteId: '' }))
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobSite">Job Site</Label>
                  <Select 
                    value={invoice.jobSiteId} 
                    onValueChange={(value) => setInvoice(prev => ({ ...prev, jobSiteId: value }))}
                    disabled={!invoice.clientId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a job site" />
                    </SelectTrigger>
                    <SelectContent>
                      {getClientJobSites().map((site) => (
                        <SelectItem key={site.id} value={site.id}>
                          {site.siteName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedClient && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-medium">{selectedClient.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedClient.email}</p>
                  <p className="text-sm text-muted-foreground">{selectedClient.phone}</p>
                  {selectedJobSite && (
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-sm font-medium">{selectedJobSite.siteName}</p>
                      <p className="text-sm text-muted-foreground">{selectedJobSite.address}</p>
                      {selectedJobSite.accessDetails && (
                        <p className="text-sm text-muted-foreground">Access: {selectedJobSite.accessDetails}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Invoice Details */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber">Invoice Number</Label>
                  <Input
                    id="invoiceNumber"
                    value={invoice.invoiceNumber}
                    onChange={(e) => setInvoice(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                    placeholder="INV-2024-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issueDate">Issue Date</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={invoice.issueDate}
                    onChange={(e) => setInvoice(prev => ({ ...prev, issueDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={invoice.dueDate}
                    onChange={(e) => setInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader>
              <CardTitle>Line Items</CardTitle>
              <CardDescription>
                Add products and services to this invoice
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Item Form */}
              <div className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-12 md:col-span-4">
                  <Label htmlFor="description" className="text-xs">Description</Label>
                  <Input
                    id="description"
                    value={newItem.description}
                    onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Item description"
                    className="text-sm"
                  />
                </div>
                <div className="col-span-4 md:col-span-2">
                  <Label htmlFor="quantity" className="text-xs">Qty</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                    className="text-sm"
                  />
                </div>
                <div className="col-span-4 md:col-span-2">
                  <Label htmlFor="unitPrice" className="text-xs">Unit Price</Label>
                  <Input
                    id="unitPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newItem.unitPrice}
                    onChange={(e) => setNewItem(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                    className="text-sm"
                  />
                </div>
                <div className="col-span-2 md:col-span-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newItem.isGstApplicable}
                      onCheckedChange={(checked) => setNewItem(prev => ({ ...prev, isGstApplicable: checked }))}
                    />
                    <Label className="text-xs">GST</Label>
                  </div>
                </div>
                <div className="col-span-2 md:col-span-2">
                  <Button onClick={addItem} size="sm" className="w-full">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Items List */}
              {invoice.items.length > 0 && (
                <div className="space-y-2">
                  {invoice.items.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-center p-2 border rounded">
                      <div className="col-span-12 md:col-span-4">
                        <Input
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <div className="col-span-4 md:col-span-2">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                          className="text-sm text-center"
                        />
                      </div>
                      <div className="col-span-4 md:col-span-2">
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="text-sm"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-2">
                        <Switch
                          checked={item.isGstApplicable}
                          onCheckedChange={(checked) => updateItem(item.id, 'isGstApplicable', checked)}
                        />
                      </div>
                      <div className="col-span-1 md:col-span-1">
                        <span className="text-sm font-medium">${item.total.toFixed(2)}</span>
                      </div>
                      <div className="col-span-1 md:col-span-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="h-6 w-6"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
              <CardDescription>
                Additional information for the client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={invoice.notes}
                onChange={(e) => setInvoice(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any additional notes or payment terms for this invoice..."
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Invoice Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2" />
                Invoice Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GST (10%):</span>
                <span>${invoice.tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>${invoice.total.toFixed(2)}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {invoice.items.length} item{invoice.items.length !== 1 ? 's' : ''}
              </div>
            </CardContent>
          </Card>

          {/* Status & Dates */}
          <Card>
            <CardHeader>
              <CardTitle>Status & Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge variant="secondary" className="w-full justify-center py-2">
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </Badge>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Issue Date: {new Date(invoice.issueDate).toLocaleDateString()}</p>
                <p>Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                {invoice.quoteId && (
                  <p className="text-primary">Created from Quote</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Payment Options
              </CardTitle>
              <CardDescription>
                Configure payment methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full" disabled>
                <DollarSign className="h-4 w-4 mr-2" />
                Enable Stripe Payments
              </Button>
              <p className="text-xs text-muted-foreground">
                Online payment integration coming soon
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}