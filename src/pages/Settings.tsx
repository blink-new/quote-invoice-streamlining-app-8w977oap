import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Switch } from '../components/ui/switch'
import { Separator } from '../components/ui/separator'
import { Badge } from '../components/ui/badge'
import { Alert, AlertDescription } from '../components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs'
import {
  Building2,
  CreditCard,
  Mail,
  Bell,
  Shield,
  Palette,
  Save,
  Upload,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Globe
} from 'lucide-react'
import { useToast } from '../hooks/use-toast'

interface BusinessSettings {
  // Business Details
  businessName: string
  abn: string
  address: string
  phone: string
  email: string
  website: string
  logo?: string
  
  // Banking Details
  bankAccountName: string
  bsb: string
  accountNumber: string
  
  // Invoice Settings
  defaultPaymentTerms: string
  defaultInvoiceNotes: string
  invoicePrefix: string
  quotePrefix: string
  gstRate: number
  
  // Email Notifications
  emailNotifications: {
    quotesSent: boolean
    quotesAccepted: boolean
    invoicesSent: boolean
    paymentsReceived: boolean
    overdueReminders: boolean
    weeklyReports: boolean
  }
  
  // SMS Notifications
  smsNotifications: {
    enabled: boolean
    overdueReminders: boolean
    paymentConfirmations: boolean
  }
  
  // Stripe Settings
  stripeConnected: boolean
  stripeAccountId?: string
  
  // PWA Settings
  offlineMode: boolean
  autoSync: boolean
}

export function Settings() {
  const [settings, setSettings] = useState<BusinessSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = () => {
    // Load from localStorage for now
    const saved = localStorage.getItem('businessSettings')
    if (saved) {
      setSettings(JSON.parse(saved))
    } else {
      // Initialize with default settings
      const defaultSettings: BusinessSettings = {
        businessName: 'Your Business Name',
        abn: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        bankAccountName: '',
        bsb: '',
        accountNumber: '',
        defaultPaymentTerms: 'Payment due within 7 days',
        defaultInvoiceNotes: 'Thank you for your business!',
        invoicePrefix: 'INV',
        quotePrefix: 'QUO',
        gstRate: 10,
        emailNotifications: {
          quotesSent: true,
          quotesAccepted: true,
          invoicesSent: true,
          paymentsReceived: true,
          overdueReminders: true,
          weeklyReports: false
        },
        smsNotifications: {
          enabled: false,
          overdueReminders: false,
          paymentConfirmations: false
        },
        stripeConnected: false,
        offlineMode: true,
        autoSync: true
      }
      setSettings(defaultSettings)
    }
    setLoading(false)
  }

  const handleSave = async () => {
    if (!settings) return
    
    setSaving(true)
    try {
      // Save to localStorage for now
      localStorage.setItem('businessSettings', JSON.stringify(settings))
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Settings saved",
        description: "Your business settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    if (!settings) return
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setSettings({
        ...settings,
        [parent]: {
          ...settings[parent as keyof BusinessSettings],
          [child]: value
        }
      })
    } else {
      setSettings({
        ...settings,
        [field]: value
      })
    }
  }

  const connectStripe = async () => {
    // Simulate Stripe connection
    toast({
      title: "Stripe Connection",
      description: "Redirecting to Stripe to connect your account...",
    })
    
    // In a real app, this would redirect to Stripe Connect
    setTimeout(() => {
      handleInputChange('stripeConnected', true)
      handleInputChange('stripeAccountId', 'acct_1234567890')
      toast({
        title: "Stripe Connected",
        description: "Your Stripe account has been connected successfully!",
      })
    }, 2000)
  }

  if (loading || !settings) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your business settings and preferences
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Tabs defaultValue="business" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="banking">Banking</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        {/* Business Details */}
        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Business Information
              </CardTitle>
              <CardDescription>
                Update your business details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={settings.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    placeholder="Your Business Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="abn">ABN</Label>
                  <Input
                    id="abn"
                    value={settings.abn}
                    onChange={(e) => handleInputChange('abn', e.target.value)}
                    placeholder="12 345 678 901"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Business Address</Label>
                <Textarea
                  id="address"
                  value={settings.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="123 Business Street, City, State, Postcode"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(02) 1234 5678"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="contact@yourbusiness.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={settings.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://www.yourbusiness.com"
                />
              </div>

              <div className="space-y-2">
                <Label>Business Logo</Label>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    {settings.logo ? (
                      <img src={settings.logo} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Building2 className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Logo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Banking Details */}
        <TabsContent value="banking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Banking Details
              </CardTitle>
              <CardDescription>
                Bank account information for invoice payments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Your banking details are encrypted and securely stored. They will appear on your invoices for direct deposit payments.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="bankAccountName">Account Name</Label>
                <Input
                  id="bankAccountName"
                  value={settings.bankAccountName}
                  onChange={(e) => handleInputChange('bankAccountName', e.target.value)}
                  placeholder="Your Business Name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bsb">BSB</Label>
                  <Input
                    id="bsb"
                    value={settings.bsb}
                    onChange={(e) => handleInputChange('bsb', e.target.value)}
                    placeholder="123-456"
                    maxLength={7}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={settings.accountNumber}
                    onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                    placeholder="123456789"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Document Settings */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Settings</CardTitle>
              <CardDescription>
                Customize your quotes and invoices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quotePrefix">Quote Prefix</Label>
                  <Input
                    id="quotePrefix"
                    value={settings.quotePrefix}
                    onChange={(e) => handleInputChange('quotePrefix', e.target.value)}
                    placeholder="QUO"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
                  <Input
                    id="invoicePrefix"
                    value={settings.invoicePrefix}
                    onChange={(e) => handleInputChange('invoicePrefix', e.target.value)}
                    placeholder="INV"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gstRate">GST Rate (%)</Label>
                  <Input
                    id="gstRate"
                    type="number"
                    value={settings.gstRate}
                    onChange={(e) => handleInputChange('gstRate', parseFloat(e.target.value))}
                    placeholder="10"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultPaymentTerms">Default Payment Terms</Label>
                <Input
                  id="defaultPaymentTerms"
                  value={settings.defaultPaymentTerms}
                  onChange={(e) => handleInputChange('defaultPaymentTerms', e.target.value)}
                  placeholder="Payment due within 7 days"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultInvoiceNotes">Default Invoice Notes</Label>
                <Textarea
                  id="defaultInvoiceNotes"
                  value={settings.defaultInvoiceNotes}
                  onChange={(e) => handleInputChange('defaultInvoiceNotes', e.target.value)}
                  placeholder="Thank you for your business!"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Email Notifications
              </CardTitle>
              <CardDescription>
                Choose which email notifications you'd like to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(settings.emailNotifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {getNotificationDescription(key)}
                    </p>
                  </div>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) => 
                      handleInputChange(`emailNotifications.${key}`, checked)
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Smartphone className="h-5 w-5 mr-2" />
                SMS Notifications
              </CardTitle>
              <CardDescription>
                SMS notifications for urgent updates (Premium feature)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive SMS alerts for important events
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Premium</Badge>
                  <Switch
                    checked={settings.smsNotifications.enabled}
                    onCheckedChange={(checked) => 
                      handleInputChange('smsNotifications.enabled', checked)
                    }
                  />
                </div>
              </div>

              {settings.smsNotifications.enabled && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Overdue Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        SMS alerts for overdue invoices
                      </p>
                    </div>
                    <Switch
                      checked={settings.smsNotifications.overdueReminders}
                      onCheckedChange={(checked) => 
                        handleInputChange('smsNotifications.overdueReminders', checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Payment Confirmations</Label>
                      <p className="text-sm text-muted-foreground">
                        SMS confirmations when payments are received
                      </p>
                    </div>
                    <Switch
                      checked={settings.smsNotifications.paymentConfirmations}
                      onCheckedChange={(checked) => 
                        handleInputChange('smsNotifications.paymentConfirmations', checked)
                      }
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Processing</CardTitle>
              <CardDescription>
                Connect payment providers to accept online payments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Stripe</h3>
                    <p className="text-sm text-muted-foreground">
                      Accept credit card payments online
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {settings.stripeConnected ? (
                    <>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </>
                  ) : (
                    <Button onClick={connectStripe}>
                      Connect Stripe
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                PWA Settings
              </CardTitle>
              <CardDescription>
                Progressive Web App configuration for offline use
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Offline Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow the app to work without internet connection
                  </p>
                </div>
                <Switch
                  checked={settings.offlineMode}
                  onCheckedChange={(checked) => handleInputChange('offlineMode', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto Sync</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically sync data when connection is restored
                  </p>
                </div>
                <Switch
                  checked={settings.autoSync}
                  onCheckedChange={(checked) => handleInputChange('autoSync', checked)}
                />
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Offline mode allows you to create quotes and manage clients without internet. 
                  Data will sync automatically when you're back online.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function getNotificationDescription(key: string): string {
  const descriptions: Record<string, string> = {
    quotesSent: 'Get notified when quotes are successfully sent to clients',
    quotesAccepted: 'Receive alerts when clients accept your quotes',
    invoicesSent: 'Confirmation emails when invoices are sent',
    paymentsReceived: 'Instant notifications for received payments',
    overdueReminders: 'Automatic reminders for overdue invoices',
    weeklyReports: 'Weekly business performance summaries'
  }
  return descriptions[key] || ''
}