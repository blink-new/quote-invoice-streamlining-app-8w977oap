import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { blink } from '../../blink/client'
import { useToast } from '../../hooks/use-toast'
import { FileText, Calculator, Calendar, DollarSign } from 'lucide-react'

export function AuthLayout() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleLogin = () => {
    setIsLoading(true)
    try {
      blink.auth.login()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate login. Please try again.",
        variant: "destructive"
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Hero Section */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
              Streamline Your Business
            </h1>
            <p className="text-xl text-muted-foreground">
              Professional quoting, invoicing, and job management for Australian tradies and small businesses.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-white/50 rounded-lg">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Professional Quotes</h3>
                <p className="text-sm text-muted-foreground">Create branded quotes on-site</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-white/50 rounded-lg">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Calculator className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-medium">Smart Invoicing</h3>
                <p className="text-sm text-muted-foreground">Convert quotes to invoices</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-white/50 rounded-lg">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Job Scheduling</h3>
                <p className="text-sm text-muted-foreground">Manage your calendar</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-white/50 rounded-lg">
              <div className="p-2 bg-accent/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-medium">Payment Tracking</h3>
                <p className="text-sm text-muted-foreground">Stripe integration & reports</p>
              </div>
            </div>
          </div>
        </div>

        {/* Auth Card */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access your business dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In with Blink'
              )}
            </Button>
            
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>New to our platform?</p>
              <p className="mt-1">Your account will be created automatically on first sign-in.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}