import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu'
import { useToast } from '../hooks/use-toast'
import { blink } from '../blink/client'
import {
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  Building,
  MoreHorizontal,
  Edit,
  Trash2
} from 'lucide-react'

interface Client {
  id: string
  name: string
  email: string
  phone: string
  address: string
  userId: string
  createdAt: string
  updatedAt: string
}

interface NewClientForm {
  name: string
  email: string
  phone: string
  address: string
}

export function Clients() {
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [formData, setFormData] = useState<NewClientForm>({
    name: '',
    email: '',
    phone: '',
    address: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  const loadClients = useCallback(async () => {
    try {
      setLoading(true)
      const user = await blink.auth.me()
      
      // Load clients from database
      const clientsData = await blink.db.clients.list({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      })
      
      setClients(clientsData)
    } catch (error) {
      console.error('Failed to load clients:', error)
      toast({
        title: "Error",
        description: "Failed to load clients. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadClients()
  }, [loadClients])

  const handleAddClient = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Client name is required.",
        variant: "destructive"
      })
      return
    }

    try {
      setSubmitting(true)
      const user = await blink.auth.me()
      
      const newClient = await blink.db.clients.create({
        id: `client_${Date.now()}`,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        userId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })

      setClients(prev => [newClient, ...prev])
      setFormData({ name: '', email: '', phone: '', address: '' })
      setIsAddDialogOpen(false)
      
      toast({
        title: "Success",
        description: "Client added successfully."
      })
    } catch (error) {
      console.error('Failed to add client:', error)
      toast({
        title: "Error",
        description: "Failed to add client. Please try again.",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditClient = async () => {
    if (!editingClient || !formData.name.trim()) {
      toast({
        title: "Error",
        description: "Client name is required.",
        variant: "destructive"
      })
      return
    }

    try {
      setSubmitting(true)
      
      const updatedClient = await blink.db.clients.update(editingClient.id, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        updatedAt: new Date().toISOString()
      })

      setClients(prev => prev.map(client => 
        client.id === editingClient.id ? { ...client, ...updatedClient } : client
      ))
      
      setIsEditDialogOpen(false)
      setEditingClient(null)
      setFormData({ name: '', email: '', phone: '', address: '' })
      
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
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteClient = async (client: Client) => {
    if (!confirm(`Are you sure you want to delete ${client.name}? This action cannot be undone.`)) {
      return
    }

    try {
      await blink.db.clients.delete(client.id)
      setClients(prev => prev.filter(c => c.id !== client.id))
      
      toast({
        title: "Success",
        description: "Client deleted successfully."
      })
    } catch (error) {
      console.error('Failed to delete client:', error)
      toast({
        title: "Error",
        description: "Failed to delete client. Please try again.",
        variant: "destructive"
      })
    }
  }

  const openEditDialog = (client: Client) => {
    setEditingClient(client)
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', address: '' })
    setEditingClient(null)
  }

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <h1 className="text-3xl font-bold text-foreground">Clients</h1>
          <p className="text-muted-foreground mt-1">
            Manage your client relationships and job sites
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>
                Enter the client details below. You can add job sites later.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Client or business name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="client@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="0412 345 678"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="123 Main St, Sydney NSW 2000"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddClient} disabled={submitting}>
                {submitting ? 'Adding...' : 'Add Client'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <Card key={client.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{client.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Building className="h-3 w-3 mr-1" />
                    Client since {new Date(client.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditDialog(client)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteClient(client)}
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
              <div className="space-y-2 text-sm">
                {client.email && (
                  <div className="flex items-center text-muted-foreground">
                    <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </div>
                )}
                {client.phone && (
                  <div className="flex items-center text-muted-foreground">
                    <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{client.phone}</span>
                  </div>
                )}
                {client.address && (
                  <div className="flex items-start text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-xs leading-relaxed">{client.address}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <Badge variant="secondary" className="text-xs">
                  Updated {new Date(client.updatedAt).toLocaleDateString()}
                </Badge>
              </div>

              <Button asChild variant="outline" className="w-full">
                <Link to={`/clients/${client.id}`}>
                  View Details
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open)
        if (!open) resetForm()
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>
              Update the client details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Client or business name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="client@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="0412 345 678"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-address">Address</Label>
              <Textarea
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="123 Main St, Sydney NSW 2000"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditClient} disabled={submitting}>
              {submitting ? 'Updating...' : 'Update Client'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {searchTerm ? 'No clients found' : 'No clients yet'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm 
              ? 'Try adjusting your search terms'
              : 'Get started by adding your first client'
            }
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Client
            </Button>
          )}
        </div>
      )}
    </div>
  )
}