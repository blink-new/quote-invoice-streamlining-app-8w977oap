import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Badge } from '../components/ui/badge'
import { Switch } from '../components/ui/switch'
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
import { blink } from '../blink/client'
import { useToast } from '../hooks/use-toast'
import {
  Plus,
  Search,
  Package,
  Edit,
  Trash2,
  MoreHorizontal,
  DollarSign,
  Tag
} from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string
  unitPrice: number
  isGstApplicable: boolean
  category?: string
  createdAt: string
}

export function ProductLibrary() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    unitPrice: '',
    isGstApplicable: true,
    category: ''
  })

  const loadProducts = useCallback(async () => {
    try {
      // Mock data for now - in real app this would be: await blink.db.products.list()
      setProducts([
        {
          id: '1',
          name: 'Call-Out Fee',
          description: 'Standard call-out fee for service visits',
          unitPrice: 85.00,
          isGstApplicable: true,
          category: 'Service',
          createdAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          name: 'Copper Pipe 15mm',
          description: 'Type B copper pipe, 15mm diameter, per metre',
          unitPrice: 12.50,
          isGstApplicable: true,
          category: 'Materials',
          createdAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '3',
          name: 'Labour - Plumbing',
          description: 'Standard plumbing labour rate per hour',
          unitPrice: 95.00,
          isGstApplicable: true,
          category: 'Labour',
          createdAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '4',
          name: 'Tap Installation',
          description: 'Standard tap installation service',
          unitPrice: 150.00,
          isGstApplicable: true,
          category: 'Service',
          createdAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '5',
          name: 'Emergency After Hours',
          description: 'After hours emergency service surcharge',
          unitPrice: 200.00,
          isGstApplicable: true,
          category: 'Service',
          createdAt: '2024-01-15T10:00:00Z'
        }
      ])
    } catch (error) {
      console.error('Failed to load products:', error)
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.unitPrice) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    try {
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        unitPrice: parseFloat(formData.unitPrice),
        isGstApplicable: formData.isGstApplicable,
        category: formData.category.trim() || undefined
      }

      if (editingProduct) {
        // Update existing product
        const updatedProduct = {
          ...editingProduct,
          ...productData,
          updatedAt: new Date().toISOString()
        }
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p))
        toast({
          title: "Success",
          description: "Product updated successfully."
        })
      } else {
        // Create new product
        const newProduct: Product = {
          id: Date.now().toString(),
          ...productData,
          createdAt: new Date().toISOString()
        }
        setProducts(prev => [newProduct, ...prev])
        toast({
          title: "Success",
          description: "Product added successfully."
        })
      }

      resetForm()
      setDialogOpen(false)
    } catch (error) {
      console.error('Failed to save product:', error)
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      unitPrice: product.unitPrice.toString(),
      isGstApplicable: product.isGstApplicable,
      category: product.category || ''
    })
    setDialogOpen(true)
  }

  const handleDelete = async (productId: string) => {
    try {
      setProducts(prev => prev.filter(p => p.id !== productId))
      toast({
        title: "Success",
        description: "Product deleted successfully."
      })
    } catch (error) {
      console.error('Failed to delete product:', error)
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive"
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      unitPrice: '',
      isGstApplicable: true,
      category: ''
    })
    setEditingProduct(null)
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))]

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
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
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
          <h1 className="text-3xl font-bold text-foreground">Product & Service Library</h1>
          <p className="text-muted-foreground mt-1">
            Manage your frequently used products and services for quick quote creation
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
                <DialogDescription>
                  {editingProduct 
                    ? 'Update the product details below.'
                    : 'Add a new product or service to your library for quick access when creating quotes.'
                  }
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Call-Out Fee, Copper Pipe 15mm"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detailed description of the product or service"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="unitPrice">Unit Price (AUD) *</Label>
                    <Input
                      id="unitPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.unitPrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, unitPrice: e.target.value }))}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="e.g., Labour, Materials, Service"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="gst"
                    checked={formData.isGstApplicable}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isGstApplicable: checked }))}
                  />
                  <Label htmlFor="gst">GST Applicable (10%)</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Stats */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products and services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span>{filteredProducts.length} items</span>
          {categories.length > 0 && (
            <span>{categories.length} categories</span>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  {product.category && (
                    <div className="flex items-center mt-1">
                      <Tag className="h-3 w-3 mr-1 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{product.category}</span>
                    </div>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(product)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(product.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {product.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold text-lg">
                    ${product.unitPrice.toFixed(2)}
                  </span>
                </div>
                {product.isGstApplicable && (
                  <Badge variant="secondary" className="text-xs">
                    +GST
                  </Badge>
                )}
              </div>
              
              <div className="text-xs text-muted-foreground">
                Added {new Date(product.createdAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {searchTerm ? 'No products found' : 'No products yet'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm 
              ? 'Try adjusting your search terms'
              : 'Get started by adding your frequently used products and services'
            }
          </p>
          {!searchTerm && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Button>
              </DialogTrigger>
            </Dialog>
          )}
        </div>
      )}
    </div>
  )
}