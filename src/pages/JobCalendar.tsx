import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
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
  Calendar,
  Plus,
  Clock,
  MapPin,
  User,
  Building,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2
} from 'lucide-react'

interface Job {
  id: string
  title: string
  description: string
  clientName: string
  jobSite: string
  assignedTo: string
  startTime: string
  endTime: string
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  color: string
}

interface Client {
  id: string
  name: string
}

interface JobSite {
  id: string
  siteName: string
  address: string
  clientId: string
}

interface Worker {
  id: string
  name: string
}

export function JobCalendar() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [jobSites, setJobSites] = useState<JobSite[]>([])
  const [workers, setWorkers] = useState<Worker[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clientId: '',
    jobSiteId: '',
    assignedTo: '',
    startTime: '',
    endTime: '',
    date: ''
  })

  const loadData = async () => {
    try {
      // Mock data
      const mockClients: Client[] = [
        { id: '1', name: 'Smith Residence' },
        { id: '2', name: 'Johnson Property Group' },
        { id: '3', name: 'Brown Commercial' }
      ]

      const mockJobSites: JobSite[] = [
        { id: '1', siteName: 'Main Residence', address: '123 Main St, Sydney NSW', clientId: '1' },
        { id: '2', siteName: 'Holiday Home', address: '456 Beach Rd, Byron Bay NSW', clientId: '1' },
        { id: '3', siteName: 'Office Building', address: '456 Business Ave, Melbourne VIC', clientId: '2' },
        { id: '4', siteName: 'Warehouse', address: '789 Industrial Rd, Brisbane QLD', clientId: '3' }
      ]

      const mockWorkers: Worker[] = [
        { id: '1', name: 'John Smith' },
        { id: '2', name: 'Mike Johnson' },
        { id: '3', name: 'Sarah Wilson' }
      ]

      const mockJobs: Job[] = [
        {
          id: '1',
          title: 'Bathroom Renovation',
          description: 'Complete bathroom renovation including plumbing and tiling',
          clientName: 'Smith Residence',
          jobSite: '123 Main St, Sydney NSW',
          assignedTo: 'John Smith',
          startTime: '09:00',
          endTime: '17:00',
          status: 'scheduled',
          color: 'bg-blue-500'
        },
        {
          id: '2',
          title: 'Kitchen Plumbing',
          description: 'Install new kitchen sink and dishwasher connections',
          clientName: 'Johnson Property Group',
          jobSite: '456 Business Ave, Melbourne VIC',
          assignedTo: 'Mike Johnson',
          startTime: '10:00',
          endTime: '15:00',
          status: 'in-progress',
          color: 'bg-green-500'
        },
        {
          id: '3',
          title: 'Emergency Repair',
          description: 'Fix burst pipe in warehouse',
          clientName: 'Brown Commercial',
          jobSite: '789 Industrial Rd, Brisbane QLD',
          assignedTo: 'Sarah Wilson',
          startTime: '08:00',
          endTime: '12:00',
          status: 'completed',
          color: 'bg-purple-500'
        }
      ]

      setClients(mockClients)
      setJobSites(mockJobSites)
      setWorkers(mockWorkers)
      setJobs(mockJobs)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getJobsForDate = (date: Date) => {
    // For demo purposes, we'll show jobs on specific dates
    const day = date.getDate()
    if (day === 15) return [jobs[0]]
    if (day === 18) return [jobs[1]]
    if (day === 22) return [jobs[2]]
    return []
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDate(clickedDate)
    setFormData(prev => ({
      ...prev,
      date: clickedDate.toISOString().split('T')[0]
    }))
    setDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const selectedClient = clients.find(c => c.id === formData.clientId)
    const selectedJobSite = jobSites.find(js => js.id === formData.jobSiteId)
    const selectedWorker = workers.find(w => w.id === formData.assignedTo)

    if (!selectedClient || !selectedJobSite || !selectedWorker) return

    const newJob: Job = {
      id: editingJob?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      clientName: selectedClient.name,
      jobSite: selectedJobSite.address,
      assignedTo: selectedWorker.name,
      startTime: formData.startTime,
      endTime: formData.endTime,
      status: 'scheduled',
      color: 'bg-blue-500'
    }

    if (editingJob) {
      setJobs(prev => prev.map(job => job.id === editingJob.id ? newJob : job))
    } else {
      setJobs(prev => [...prev, newJob])
    }

    resetForm()
    setDialogOpen(false)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      clientId: '',
      jobSiteId: '',
      assignedTo: '',
      startTime: '',
      endTime: '',
      date: ''
    })
    setEditingJob(null)
  }

  const getClientJobSites = () => {
    return jobSites.filter(site => site.clientId === formData.clientId)
  }

  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'in-progress': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Job Calendar</h1>
          <p className="text-muted-foreground mt-1">
            Schedule and manage your jobs and appointments
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Job
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingJob ? 'Edit Job' : 'Schedule New Job'}
                </DialogTitle>
                <DialogDescription>
                  {selectedDate && `Scheduling for ${selectedDate.toLocaleDateString()}`}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Bathroom Renovation"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Job details and requirements"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="client">Client *</Label>
                    <Select value={formData.clientId} onValueChange={(value) => {
                      setFormData(prev => ({ ...prev, clientId: value, jobSiteId: '' }))
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
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
                  
                  <div className="grid gap-2">
                    <Label htmlFor="jobSite">Job Site *</Label>
                    <Select 
                      value={formData.jobSiteId} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, jobSiteId: value }))}
                      disabled={!formData.clientId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select site" />
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
                
                <div className="grid gap-2">
                  <Label htmlFor="assignedTo">Assign to Worker *</Label>
                  <Select value={formData.assignedTo} onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, assignedTo: value }))
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select worker" />
                    </SelectTrigger>
                    <SelectContent>
                      {workers.map((worker) => (
                        <SelectItem key={worker.id} value={worker.id}>
                          {worker.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="startTime">Start Time *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endTime">End Time *</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingJob ? 'Update Job' : 'Schedule Job'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleNextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {dayNames.map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before month starts */}
                {Array.from({ length: getFirstDayOfMonth(currentDate) }, (_, i) => (
                  <div key={`empty-${i}`} className="p-2 h-24"></div>
                ))}
                
                {/* Days of the month */}
                {Array.from({ length: getDaysInMonth(currentDate) }, (_, i) => {
                  const day = i + 1
                  const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                  const dayJobs = getJobsForDate(date)
                  const isToday = new Date().toDateString() === date.toDateString()
                  
                  return (
                    <div
                      key={day}
                      className={`p-2 h-24 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                        isToday ? 'bg-primary/10 border-primary' : 'border-border'
                      }`}
                      onClick={() => handleDateClick(day)}
                    >
                      <div className={`text-sm font-medium mb-1 ${isToday ? 'text-primary' : ''}`}>
                        {day}
                      </div>
                      <div className="space-y-1">
                        {dayJobs.map((job) => (
                          <div
                            key={job.id}
                            className={`text-xs p-1 rounded text-white truncate ${job.color}`}
                          >
                            {job.startTime} {job.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Jobs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Today's Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {jobs.slice(0, 2).map((job) => (
                  <div key={job.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{job.title}</h4>
                      <Badge variant="secondary" className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {job.startTime} - {job.endTime}
                      </div>
                      <div className="flex items-center">
                        <Building className="h-3 w-3 mr-1" />
                        {job.clientName}
                      </div>
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {job.assignedTo}
                      </div>
                    </div>
                  </div>
                ))}
                {jobs.length === 0 && (
                  <p className="text-sm text-muted-foreground">No jobs scheduled for today</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>This Week</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Scheduled:</span>
                <span className="font-medium">{jobs.filter(j => j.status === 'scheduled').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">In Progress:</span>
                <span className="font-medium">{jobs.filter(j => j.status === 'in-progress').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Completed:</span>
                <span className="font-medium">{jobs.filter(j => j.status === 'completed').length}</span>
              </div>
            </CardContent>
          </Card>

          {/* Workers */}
          <Card>
            <CardHeader>
              <CardTitle>Team</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {workers.map((worker) => (
                  <div key={worker.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center mr-2">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm">{worker.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {jobs.filter(j => j.assignedTo === worker.name).length} jobs
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}