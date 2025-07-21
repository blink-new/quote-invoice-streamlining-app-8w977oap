import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import { Toaster } from './components/ui/toaster'
import { AuthLayout } from './components/layout/AuthLayout'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { Dashboard } from './pages/Dashboard'
import { Clients } from './pages/Clients'
import { ClientDetail } from './pages/ClientDetail'
import { ProductLibrary } from './pages/ProductLibrary'
import { Quotes } from './pages/Quotes'
import { QuoteBuilder } from './pages/QuoteBuilder'
import { Invoices } from './pages/Invoices'
import { InvoiceBuilder } from './pages/InvoiceBuilder'
import { JobCalendar } from './pages/JobCalendar'
import { Reports } from './pages/Reports'
import { Settings } from './pages/Settings'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return <AuthLayout />
  }

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <DashboardLayout user={user}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:id" element={<ClientDetail />} />
            <Route path="/products" element={<ProductLibrary />} />
            <Route path="/quotes" element={<Quotes />} />
            <Route path="/quotes/new" element={<QuoteBuilder />} />
            <Route path="/quotes/:id/edit" element={<QuoteBuilder />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/invoices/new" element={<InvoiceBuilder />} />
            <Route path="/invoices/:id/edit" element={<InvoiceBuilder />} />
            <Route path="/calendar" element={<JobCalendar />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DashboardLayout>
        <Toaster />
      </div>
    </Router>
  )
}

export default App