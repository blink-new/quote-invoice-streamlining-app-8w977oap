import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Switch } from '../components/ui/switch'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { Checkbox } from '../components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table'
import { useToast } from '../hooks/use-toast'
import {
  ArrowLeft,
  Plus,
  Trash2,
  Package,
  Calculator,
  Send,
  Save,
  FileText,
  Camera,
  X,
  CheckSquare,
  Square
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

interface Product {
  id: string
  name: string
  description: string
  unitPrice: number
  isGstApplicable: boolean
  category?: string
}

interface QuoteItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  isGstApplicable: boolean
  total: number
}

interface Quote {
  id?: string
  quoteNumber: string
  clientId: string
  jobSiteId?: string
  status: 'draft' | 'sent' | 'accepted' | 'declined' | 'expired'
  issueDate: string
  expiryDate: string
  items: QuoteItem[]
  subtotal: number
  tax: number
  total: number
  notes?: string
  attachments?: string[]
}

export function QuoteBuilder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const isEditing = Boolean(id)

  // State
  const [clients, setClients] = useState<Client[]>([])
  const [jobSites, setJobSites] = useState<JobSite[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [productDialogOpen, setProductDialogOpen] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())

  // Quote form state
  const [quote, setQuote] = useState<Quote>({
    quoteNumber: '',
    clientId: '',
    jobSiteId: '',
    status: 'draft',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    notes: '',
    attachments: []
  })

  // New item form state
  const [newItem, setNewItem] = useState<Omit<QuoteItem, 'id' | 'total'>>({
    description: '',
    quantity: 1,
    unitPrice: 0,
    isGstApplicable: true
  })

  const calculateTotals = useCallback(() => {
    const subtotal = quote.items.reduce((sum, item) => sum + item.total, 0)
    const tax = quote.items.reduce((sum, item) => {
      return sum + (item.isGstApplicable ? item.total * 0.1 : 0)
    }, 0)
    const total = subtotal + tax

    setQuote(prev => ({
      ...prev,
      subtotal,
      tax,
      total
    }))
  }, [quote.items])

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

      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Call-Out Fee',
          description: 'Standard call-out fee for service visits',
          unitPrice: 85.00,
          isGstApplicable: true,
          category: 'Service'
        },
        {
          id: '2',
          name: 'Labour - Plumbing',
          description: 'Standard plumbing labour rate per hour',
          unitPrice: 95.00,
          isGstApplicable: true,
          category: 'Labour'
        },
        {
          id: '3',
          name: 'Copper Pipe 15mm',
          description: 'Type B copper pipe, 15mm diameter, per metre',
          unitPrice: 12.50,
          isGstApplicable: true,
          category: 'Materials'
        },
        {
          id: '4',
          name: 'Tap Installation',
          description: 'Standard tap installation service',
          unitPrice: 150.00,
          isGstApplicable: true,
          category: 'Service'
        }
      ]

      setClients(mockClients)
      setJobSites(mockJobSites)
      setProducts(mockProducts)

      // If editing, load existing quote
      if (isEditing && id) {
        const savedQuotes = localStorage.getItem('quotes')
        if (savedQuotes) {
          const quotes = JSON.parse(savedQuotes)
          const existingQuote = quotes.find((q: Quote) => q.id === id)
          if (existingQuote) {
            setQuote(existingQuote)
          }
        }
      } else {
        // Generate quote number for new quote
        const quoteNumber = `QUO-${new Date().getFullYear()}-${String(Date.now()).slice(-3).padStart(3, '0')}`
        setQuote(prev => ({ ...prev, quoteNumber }))
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
  }, [isEditing, id, toast])

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

    const item: QuoteItem = {
      id: Date.now().toString(),
      ...newItem,
      total: newItem.quantity * newItem.unitPrice
    }

    setQuote(prev => ({
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

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
  }

  const selectAllProducts = () => {
    setSelectedProducts(new Set(products.map(p => p.id)))
  }

  const clearAllSelections = () => {
    setSelectedProducts(new Set())
  }

  const addSelectedProductsToQuote = () => {
    if (selectedProducts.size === 0) {
      toast({
        title: "No Selection",
        description: "Please select at least one product to add.",
        variant: "destructive"
      })
      return
    }

    const selectedProductsList = products.filter(p => selectedProducts.has(p.id))
    const newItems: QuoteItem[] = selectedProductsList.map(product => ({
      id: `${Date.now()}-${product.id}`,
      description: product.name,
      quantity: 1,
      unitPrice: product.unitPrice,
      isGstApplicable: product.isGstApplicable,
      total: product.unitPrice
    }))

    setQuote(prev => ({
      ...prev,
      items: [...prev.items, ...newItems]
    }))

    setSelectedProducts(new Set())
    setProductDialogOpen(false)
    
    toast({
      title: "Success",
      description: `${selectedProductsList.length} item${selectedProductsList.length !== 1 ? 's' : ''} added to quote.`
    })
  }

  const addProductAsItem = (product: Product) => {
    const item: QuoteItem = {
      id: Date.now().toString(),
      description: product.name,
      quantity: 1,
      unitPrice: product.unitPrice,
      isGstApplicable: product.isGstApplicable,
      total: product.unitPrice
    }

    setQuote(prev => ({
      ...prev,
      items: [...prev.items, item]
    }))

    setProductDialogOpen(false)
    toast({
      title: "Success",
      description: `${product.name} added to quote.`
    })
  }

  const removeItem = (itemId: string) => {
    setQuote(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }))
  }

  const updateItem = (itemId: string, field: keyof QuoteItem, value: any) => {
    setQuote(prev => ({
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

  const saveQuote = async (status: 'draft' | 'sent' = 'draft') => {
    if (!quote.clientId) {
      toast({
        title: "Validation Error",
        description: "Please select a client.",
        variant: "destructive"
      })
      return
    }

    if (quote.items.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one item to the quote.",
        variant: "destructive"
      })
      return
    }

    setSaving(true)
    try {
      const quoteToSave = {
        ...quote,
        status,
        id: quote.id || Date.now().toString()
      }

      // Save to localStorage (in real app this would be an API call)
      const savedQuotes = localStorage.getItem('quotes')
      const quotes = savedQuotes ? JSON.parse(savedQuotes) : []
      
      if (isEditing) {
        const index = quotes.findIndex((q: Quote) => q.id === quote.id)
        if (index !== -1) {
          quotes[index] = quoteToSave
        }
      } else {
        quotes.push(quoteToSave)
      }
      
      localStorage.setItem('quotes', JSON.stringify(quotes))

      toast({
        title: "Success",
        description: status === 'sent' 
          ? "Quote sent to client successfully!" 
          : "Quote saved successfully!"
      })

      navigate('/quotes')
    } catch (error) {
      console.error('Failed to save quote:', error)
      toast({
        title: "Error",
        description: "Failed to save quote. Please try again.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const getClientJobSites = () => {
    return jobSites.filter(site => site.clientId === quote.clientId)
  }

  const selectedClient = clients.find(c => c.id === quote.clientId)
  const selectedJobSite = jobSites.find(s => s.id === quote.jobSiteId)

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
          <Button variant="ghost" size="icon" onClick={() => navigate('/quotes')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {isEditing ? 'Edit Quote' : 'Create Quote'}
            </h1>
            <p className="text-muted-foreground">
              {quote.quoteNumber && `Quote #${quote.quoteNumber}`}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => saveQuote('draft')} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={() => saveQuote('sent')} disabled={saving}>
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
                Select the client and job site for this quote
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Client *</Label>
                  <Select value={quote.clientId} onValueChange={(value) => {
                    setQuote(prev => ({ ...prev, clientId: value, jobSiteId: '' }))
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
                    value={quote.jobSiteId} 
                    onValueChange={(value) => setQuote(prev => ({ ...prev, jobSiteId: value }))}
                    disabled={!quote.clientId}
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

          {/* Quote Details */}
          <Card>
            <CardHeader>
              <CardTitle>Quote Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quoteNumber">Quote Number</Label>
                  <Input
                    id="quoteNumber"
                    value={quote.quoteNumber}
                    onChange={(e) => setQuote(prev => ({ ...prev, quoteNumber: e.target.value }))}
                    placeholder="QUO-2024-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issueDate">Issue Date</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={quote.issueDate}
                    onChange={(e) => setQuote(prev => ({ ...prev, issueDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={quote.expiryDate}
                    onChange={(e) => setQuote(prev => ({ ...prev, expiryDate: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Line Items</CardTitle>
                  <CardDescription>
                    Add products and services to this quote
                  </CardDescription>
                </div>
                <Dialog open={productDialogOpen} onOpenChange={(open) => {
                  setProductDialogOpen(open)
                  if (!open) {
                    setSelectedProducts(new Set())
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Package className="h-4 w-4 mr-2" />
                      Add from Library
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Add from Product Library</DialogTitle>
                      <DialogDescription>
                        Select multiple products or services from your library to add to this quote
                      </DialogDescription>
                    </DialogHeader>
                    
                    {/* Selection Controls */}
                    <div className="flex items-center justify-between py-3 border-b">
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={selectAllProducts}
                          disabled={selectedProducts.size === products.length}
                        >
                          <CheckSquare className="h-4 w-4 mr-2" />
                          Select All ({products.length})
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearAllSelections}
                          disabled={selectedProducts.size === 0}
                        >
                          <Square className="h-4 w-4 mr-2" />
                          Clear All
                        </Button>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {selectedProducts.size} of {products.length} selected
                      </div>
                    </div>

                    {/* Product List */}
                    <div className="max-h-96 overflow-y-auto space-y-2">
                      {products.map((product) => (
                        <div
                          key={product.id}
                          className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer hover:bg-muted/50 ${
                            selectedProducts.has(product.id) 
                              ? 'bg-primary/5 border-primary/20' 
                              : 'border-border'
                          }`}
                          onClick={() => toggleProductSelection(product.id)}
                        >
                          <Checkbox
                            checked={selectedProducts.has(product.id)}
                            onCheckedChange={() => toggleProductSelection(product.id)}
                            className="flex-shrink-0"
                          />
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm truncate">{product.name}</h4>
                                {product.category && (
                                  <p className="text-xs text-muted-foreground">{product.category}</p>
                                )}
                                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                  {product.description}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2 ml-3 flex-shrink-0">
                                <span className="font-semibold text-sm">${product.unitPrice.toFixed(2)}</span>
                                {product.isGstApplicable && (
                                  <Badge variant="secondary" className="text-xs">+GST</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        {selectedProducts.size > 0 && (
                          <>
                            Selected items will be added with quantity 1 each. 
                            You can adjust quantities after adding.
                          </>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedProducts(new Set())
                            setProductDialogOpen(false)
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={addSelectedProductsToQuote}
                          disabled={selectedProducts.size === 0}
                        >
                          Add {selectedProducts.size} Item{selectedProducts.size !== 1 ? 's' : ''} to Quote
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
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

              {/* Items Table */}
              {quote.items.length > 0 && (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-20">Qty</TableHead>
                        <TableHead className="w-24">Unit Price</TableHead>
                        <TableHead className="w-16">GST</TableHead>
                        <TableHead className="w-24">Total</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quote.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Input
                              value={item.description}
                              onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                              className="border-none p-0 h-auto"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                              className="border-none p-0 h-auto text-center"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={item.unitPrice}
                              onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                              className="border-none p-0 h-auto"
                            />
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={item.isGstApplicable}
                              onCheckedChange={(checked) => updateItem(item.id, 'isGstApplicable', checked)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            ${item.total.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.id)}
                              className="h-6 w-6"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
                value={quote.notes}
                onChange={(e) => setQuote(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any additional notes or terms for this quote..."
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quote Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2" />
                Quote Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>${quote.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GST (10%):</span>
                <span>${quote.tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>${quote.total.toFixed(2)}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {quote.items.length} item{quote.items.length !== 1 ? 's' : ''}
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="w-full justify-center py-2">
                {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
              </Badge>
              <div className="mt-3 text-sm text-muted-foreground space-y-1">
                <p>Issue Date: {new Date(quote.issueDate).toLocaleDateString()}</p>
                <p>Expiry Date: {new Date(quote.expiryDate).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="h-5 w-5 mr-2" />
                Attachments
              </CardTitle>
              <CardDescription>
                Add photos or documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                <Plus className="h-4 w-4 mr-2" />
                Add Attachment
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Photo attachments coming soon
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}