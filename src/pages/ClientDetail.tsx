import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Separator } from '../components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu'
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
  Edit,
  Plus,
  MapPin,
  Phone,
  Mail,
  Building,
  FileText,
  Receipt,
  DollarSign,
  Calendar,
  MoreHorizontal,
  Trash2,
  Eye,
  Send
} from 'lucide-react'

interface Client {
  id: string
  name: string
  email: string
  phone: string
  address: string
  notes?: string
  createdAt: string
}

interface JobSite {
  id: string
  siteName: string
  address: string
  accessDetails?: string
  clientId: string
  createdAt: string
}

interface Quote {
  id: string
  quoteNumber: string
  clientId: string
  jobSiteId?: string
  status: 'draft' | 'sent' | 'accepted' | 'declined' | 'expired'
  issueDate: string
  expiryDate: string
  total: number
  itemCount: number
}

interface Invoice {
  id: string
  invoiceNumber: string
  clientId: string
  jobSiteId?: string
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  issueDate: string
  dueDate: string
  total: number
  itemCount: number
}

export function ClientDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [client, setClient] = useState<Client | null>(null)
  const [jobSites, setJobSites] = useState<JobSite[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [jobSiteDialogOpen, setJobSiteDialogOpen] = useState(false)
  const [editingJobSite, setEditingJobSite] = useState<JobSite | null>(null)

  // Form states
  const [clientForm, setClientForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  })

  const [jobSiteForm, setJobSiteForm] = useState({
    siteName: '',
    address: '',
    accessDetails: ''
  })

  const loadClientData = useCallback(async (clientId: string) => {
    try {
      // Mock data - in real app these would be API calls
      const mockClients = [
        {
          id: '1',
          name: 'Smith Residence',
          email: 'john.smith@email.com',
          phone: '0412 345 678',
          address: '123 Main St, Sydney NSW 2000',
          notes: 'Preferred contact time: 9am-5pm weekdays',
          createdAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          name: 'Johnson Property Group',
          email: 'contact@johnsonpg.com.au',
          phone: '02 9876 5432',
          address: '456 Business Ave, Melbourne VIC 3000',
          notes: 'Commercial property management company',
          createdAt: '2024-01-10T14:30:00Z'
        },
        {
          id: '3',
          name: 'Brown Commercial',
          email: 'admin@browncommercial.com.au',
          phone: '07 3456 7890',
          address: '789 Industrial Rd, Brisbane QLD 4000',
          notes: 'Large industrial client, multiple locations',
          createdAt: '2024-01-08T09:15:00Z'
        }
      ]

      const mockJobSites = [
        {
          id: '1',
          siteName: 'Main Residence',
          address: '123 Main St, Sydney NSW 2000',
          accessDetails: 'Key under mat, dog in backyard',
          clientId: '1',
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          siteName: 'Holiday Home',
          address: '456 Beach Rd, Byron Bay NSW 2481',
          accessDetails: 'Lockbox code: 1234, notify neighbors',
          clientId: '1',
          createdAt: '2024-01-16T11:00:00Z'
        },
        {
          id: '3',
          siteName: 'Office Building',
          address: '456 Business Ave, Melbourne VIC 3000',
          accessDetails: 'Reception desk, ask for maintenance key',
          clientId: '2',
          createdAt: '2024-01-10T15:00:00Z'
        },
        {
          id: '4',
          siteName: 'Warehouse A',
          address: '789 Industrial Rd, Brisbane QLD 4000',
          accessDetails: 'Loading dock entrance, security code: 5678',
          clientId: '3',
          createdAt: '2024-01-08T10:00:00Z'
        },
        {
          id: '5',
          siteName: 'Warehouse B',
          address: '790 Industrial Rd, Brisbane QLD 4000',
          accessDetails: 'Main entrance, contact site manager',
          clientId: '3',
          createdAt: '2024-01-08T10:30:00Z'
        }
      ]

      const mockQuotes = [
        {
          id: '1',
          quoteNumber: 'QUO-2024-001',
          clientId: '1',
          jobSiteId: '1',
          status: 'sent' as const,
          issueDate: '2024-01-15',
          expiryDate: '2024-02-15',
          total: 3500.00,
          itemCount: 4
        },
        {
          id: '2',
          quoteNumber: 'QUO-2024-002',
          clientId: '2',
          jobSiteId: '3',
          status: 'accepted' as const,
          issueDate: '2024-01-12',
          expiryDate: '2024-02-12',
          total: 2800.00,
          itemCount: 3
        },
        {
          id: '3',
          quoteNumber: 'QUO-2024-003',
          clientId: '3',
          status: 'draft' as const,
          issueDate: '2024-01-18',
          expiryDate: '2024-02-18',
          total: 1200.00,
          itemCount: 2
        }
      ]

      const mockInvoices = [
        {
          id: '1',
          invoiceNumber: 'INV-2024-001',
          clientId: '2',
          jobSiteId: '3',
          status: 'paid' as const,
          issueDate: '2024-01-12',
          dueDate: '2024-01-19',
          total: 2800.00,
          itemCount: 3
        },
        {
          id: '2',
          invoiceNumber: 'INV-2024-002',
          clientId: '1',
          jobSiteId: '1',
          status: 'sent' as const,
          issueDate: '2024-01-16',
          dueDate: '2024-01-23',
          total: 1500.00,
          itemCount: 2
        }
      ]

      const foundClient = mockClients.find(c => c.id === clientId)
      if (!foundClient) {
        toast({
          title: "Error",
          description: "Client not found.",
          variant: "destructive"
        })
        navigate('/clients')
        return
      }

      setClient(foundClient)
      setClientForm({
        name: foundClient.name,
        email: foundClient.email,
        phone: foundClient.phone,
        address: foundClient.address,
        notes: foundClient.notes || ''
      })

      setJobSites(mockJobSites.filter(js => js.clientId === clientId))
      setQuotes(mockQuotes.filter(q => q.clientId === clientId))
      setInvoices(mockInvoices.filter(i => i.clientId === clientId))
    } catch (error) {
      console.error('Failed to load client data:', error)
      toast({
        title: "Error",
        description: "Failed to load client data. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [navigate, toast])

  useEffect(() => {
    if (id) {
      loadClientData(id)
    }
  }, [id, loadClientData])

  const handleUpdateClient = async () => {
    if (!client || !clientForm.name.trim() || !clientForm.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    try {
      const updatedClient = {
        ...client,
        ...clientForm,
        updatedAt: new Date().toISOString()
      }
      setClient(updatedClient)
      setEditDialogOpen(false)
      toast({
        title: "Success",
        description: "Client updated successfully."
      })
    } catch (error) {
      console.error('Failed to update client:', error)
      toast({
        title: "Error",
        description: "Failed to update client. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleSaveJobSite = async () => {
    if (!jobSiteForm.siteName.trim() || !jobSiteForm.address.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in site name and address.",
        variant: "destructive"
      })
      return
    }

    try {
      if (editingJobSite) {
        // Update existing job site
        const updatedJobSite = {
          ...editingJobSite,
          ...jobSiteForm,
          updatedAt: new Date().toISOString()
        }
        setJobSites(prev => prev.map(js => js.id === editingJobSite.id ? updatedJobSite : js))
        toast({
          title: "Success",
          description: "Job site updated successfully."
        })
      } else {
        // Create new job site
        const newJobSite: JobSite = {
          id: Date.now().toString(),
          ...jobSiteForm,
          clientId: client!.id,
          createdAt: new Date().toISOString()
        }
        setJobSites(prev => [newJobSite, ...prev])
        toast({
          title: "Success",
          description: "Job site added successfully."
        })
      }

      resetJobSiteForm()
      setJobSiteDialogOpen(false)
    } catch (error) {
      console.error('Failed to save job site:', error)
      toast({
        title: "Error",
        description: "Failed to save job site. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleEditJobSite = (jobSite: JobSite) => {
    setEditingJobSite(jobSite)
    setJobSiteForm({
      siteName: jobSite.siteName,
      address: jobSite.address,
      accessDetails: jobSite.accessDetails || ''
    })
    setJobSiteDialogOpen(true)
  }

  const handleDeleteJobSite = async (jobSiteId: string) => {
    try {
      setJobSites(prev => prev.filter(js => js.id !== jobSiteId))
      toast({
        title: "Success",
        description: "Job site deleted successfully."
      })
    } catch (error) {
      console.error('Failed to delete job site:', error)
      toast({
        title: "Error",
        description: "Failed to delete job site. Please try again.",
        variant: "destructive"
      })
    }
  }

  const resetJobSiteForm = () => {
    setJobSiteForm({
      siteName: '',
      address: '',
      accessDetails: ''
    })
    setEditingJobSite(null)
  }

  const getStatusColor = (status: string, type: 'quote' | 'invoice') => {
    if (type === 'quote') {
      switch (status) {
        case 'draft': return 'bg-gray-100 text-gray-800'
        case 'sent': return 'bg-blue-100 text-blue-800'
        case 'accepted': return 'bg-green-100 text-green-800'
        case 'declined': return 'bg-red-100 text-red-800'
        case 'expired': return 'bg-orange-100 text-orange-800'
        default: return 'bg-gray-100 text-gray-800'
      }
    } else {
      switch (status) {
        case 'draft': return 'bg-gray-100 text-gray-800'
        case 'sent': return 'bg-blue-100 text-blue-800'
        case 'paid': return 'bg-green-100 text-green-800'
        case 'overdue': return 'bg-red-100 text-red-800'
        default: return 'bg-gray-100 text-gray-800'
      }
    }
  }

  const totalBilled = invoices.reduce((sum, inv) => sum + inv.total, 0)
  const totalPaid = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0)
  const totalOutstanding = totalBilled - totalPaid

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

  if (!client) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Client not found.</p>
            <Button asChild className="mt-4">
              <Link to="/clients">Back to Clients</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/clients')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{client.name}</h1>
            <p className="text-muted-foreground">
              Client since {new Date(client.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Client
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Edit Client</DialogTitle>
                <DialogDescription>
                  Update the client's information below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={clientForm.name}
                    onChange={(e) => setClientForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Client name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={clientForm.email}
                    onChange={(e) => setClientForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="client@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={clientForm.phone}
                    onChange={(e) => setClientForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="0412 345 678"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={clientForm.address}
                    onChange={(e) => setClientForm(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Client address"
                    rows={2}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={clientForm.notes}
                    onChange={(e) => setClientForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes about this client"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateClient}>
                  Update Client
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button asChild>
            <Link to={`/quotes/new?clientId=${client.id}`}>
              <Plus className="h-4 w-4 mr-2" />
              New Quote
            </Link>
          </Button>
        </div>
      </div>

      {/* Client Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Job Sites</p>
                <p className="text-2xl font-bold">{jobSites.length}</p>
              </div>
              <Building className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Billed</p>
                <p className="text-2xl font-bold">${totalBilled.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">${totalPaid.toLocaleString()}</p>
              </div>
              <Receipt className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Outstanding</p>
                <p className="text-2xl font-bold text-orange-600">${totalOutstanding.toLocaleString()}</p>
              </div>
              <FileText className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Client Details and Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{client.email}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{client.phone}</span>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <span className="text-sm">{client.address}</span>
            </div>
            {client.notes && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium mb-2">Notes</p>
                  <p className="text-sm text-muted-foreground">{client.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="jobsites" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="jobsites">Job Sites ({jobSites.length})</TabsTrigger>
              <TabsTrigger value="quotes">Quotes ({quotes.length})</TabsTrigger>
              <TabsTrigger value="invoices">Invoices ({invoices.length})</TabsTrigger>
            </TabsList>

            {/* Job Sites Tab */}
            <TabsContent value="jobsites" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Job Sites</h3>
                <Dialog open={jobSiteDialogOpen} onOpenChange={(open) => {
                  setJobSiteDialogOpen(open)
                  if (!open) {
                    resetJobSiteForm()
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Job Site
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>
                        {editingJobSite ? 'Edit Job Site' : 'Add New Job Site'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingJobSite 
                          ? 'Update the job site details below.'
                          : 'Add a new job site for this client.'
                        }
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="siteName">Site Name *</Label>
                        <Input
                          id="siteName"
                          value={jobSiteForm.siteName}
                          onChange={(e) => setJobSiteForm(prev => ({ ...prev, siteName: e.target.value }))}
                          placeholder="e.g., Main Office, Warehouse A"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="siteAddress">Address *</Label>
                        <Textarea
                          id="siteAddress"
                          value={jobSiteForm.address}
                          onChange={(e) => setJobSiteForm(prev => ({ ...prev, address: e.target.value }))}
                          placeholder="Full address of the job site"
                          rows={2}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="accessDetails">Access Details</Label>
                        <Textarea
                          id="accessDetails"
                          value={jobSiteForm.accessDetails}
                          onChange={(e) => setJobSiteForm(prev => ({ ...prev, accessDetails: e.target.value }))}
                          placeholder="Key location, access codes, special instructions"
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setJobSiteDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveJobSite}>
                        {editingJobSite ? 'Update Job Site' : 'Add Job Site'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-3">
                {jobSites.map((jobSite) => (
                  <Card key={jobSite.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{jobSite.siteName}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{jobSite.address}</p>
                          {jobSite.accessDetails && (
                            <p className="text-sm text-muted-foreground mt-2">
                              <strong>Access:</strong> {jobSite.accessDetails}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            Added {new Date(jobSite.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditJobSite(jobSite)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteJobSite(jobSite.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {jobSites.length === 0 && (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">No job sites yet</p>
                      <Dialog open={jobSiteDialogOpen} onOpenChange={setJobSiteDialogOpen}>
                        <DialogTrigger asChild>
                          <Button onClick={resetJobSiteForm}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add First Job Site
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Quotes Tab */}
            <TabsContent value="quotes" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Quotes</h3>
                <Button asChild size="sm">
                  <Link to={`/quotes/new?clientId=${client.id}`}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Quote
                  </Link>
                </Button>
              </div>

              <div className="space-y-3">
                {quotes.map((quote) => (
                  <Card key={quote.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{quote.quoteNumber}</h4>
                            <Badge 
                              variant="secondary" 
                              className={getStatusColor(quote.status, 'quote')}
                            >
                              {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {quote.itemCount} item{quote.itemCount !== 1 ? 's' : ''} • 
                            Issued {new Date(quote.issueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${quote.total.toLocaleString()}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Button asChild variant="ghost" size="sm">
                              <Link to={`/quotes/${quote.id}`}>
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Link>
                            </Button>
                            {quote.status === 'accepted' && (
                              <Button asChild variant="ghost" size="sm">
                                <Link to={`/invoices/new?fromQuote=${quote.id}`}>
                                  <Receipt className="h-3 w-3 mr-1" />
                                  Invoice
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {quotes.length === 0 && (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">No quotes yet</p>
                      <Button asChild>
                        <Link to={`/quotes/new?clientId=${client.id}`}>
                          <Plus className="h-4 w-4 mr-2" />
                          Create First Quote
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Invoices Tab */}
            <TabsContent value="invoices" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Invoices</h3>
                <Button asChild size="sm">
                  <Link to={`/invoices/new?clientId=${client.id}`}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Invoice
                  </Link>
                </Button>
              </div>

              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <Card key={invoice.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{invoice.invoiceNumber}</h4>
                            <Badge 
                              variant="secondary" 
                              className={getStatusColor(invoice.status, 'invoice')}
                            >
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {invoice.itemCount} item{invoice.itemCount !== 1 ? 's' : ''} • 
                            Due {new Date(invoice.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${invoice.total.toLocaleString()}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Button asChild variant="ghost" size="sm">
                              <Link to={`/invoices/${invoice.id}`}>
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Link>
                            </Button>
                            {invoice.status === 'sent' && (
                              <Button variant="ghost" size="sm">
                                <Send className="h-3 w-3 mr-1" />
                                Remind
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {invoices.length === 0 && (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">No invoices yet</p>
                      <Button asChild>
                        <Link to={`/invoices/new?clientId=${client.id}`}>
                          <Plus className="h-4 w-4 mr-2" />
                          Create First Invoice
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}