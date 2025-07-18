import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { blink } from '../blink/client'
import {
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  Building,
  MoreHorizontal
} from 'lucide-react'

interface Client {
  id: string
  name: string
  email: string
  phone: string
  address: string
  jobSitesCount: number
  totalBilled: number
  lastActivity: string
}

export function Clients() {
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      // Mock data for now
      setClients([
        {
          id: '1',
          name: 'Smith Residence',
          email: 'john.smith@email.com',
          phone: '0412 345 678',
          address: '123 Main St, Sydney NSW 2000',
          jobSitesCount: 2,
          totalBilled: 8500.00,
          lastActivity: '2 days ago'
        },
        {
          id: '2',
          name: 'Johnson Property Group',
          email: 'contact@johnsonpg.com.au',
          phone: '02 9876 5432',
          address: '456 Business Ave, Melbourne VIC 3000',
          jobSitesCount: 5,
          totalBilled: 25000.00,
          lastActivity: '1 week ago'
        },
        {
          id: '3',
          name: 'Brown Commercial',
          email: 'admin@browncommercial.com.au',
          phone: '07 3456 7890',
          address: '789 Industrial Rd, Brisbane QLD 4000',
          jobSitesCount: 3,
          totalBilled: 15750.00,
          lastActivity: '3 days ago'
        }
      ])
    } catch (error) {
      console.error('Failed to load clients:', error)
    } finally {
      setLoading(false)
    }
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
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
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
                    {client.jobSitesCount} job site{client.jobSitesCount !== 1 ? 's' : ''}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-start text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-xs leading-relaxed">{client.address}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <div>
                  <p className="text-sm font-medium">${client.totalBilled.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total billed</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {client.lastActivity}
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
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Client
            </Button>
          )}
        </div>
      )}
    </div>
  )
}