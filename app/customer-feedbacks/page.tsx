"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Loader2, Search, Filter, MessageSquare, Calendar, User, Tag, TrendingUp, TrendingDown, Minus, Eye, Clock, Reply, ArrowLeft } from 'lucide-react'
import { CustomerFeedback, CustomerFeedbackSentiment, CustomerFeedbackTopic, CustomerFeedbackCategory } from '@/types/interface/customer-feedbacks'
import { fetchCustomerFeedbacks, CustomerFeedbackFilters } from '@/lib/customer-feedback-api'

export default function CustomerFeedbacksPage() {
  const router = useRouter()
  const [feedbacks, setFeedbacks] = useState<CustomerFeedback[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUsingFallback, setIsUsingFallback] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sentimentFilter, setSentimentFilter] = useState<string>('all')
  const [topicFilter, setTopicFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [selectedFeedback, setSelectedFeedback] = useState<CustomerFeedback | null>(null)

  // Fetch data from Supabase or use sample data
  useEffect(() => {
    loadCustomerFeedbacks()
  }, [])

  const loadCustomerFeedbacks = async () => {
    try {
      setLoading(true)
      setError(null)

      const filters: CustomerFeedbackFilters = {
        sentiment: sentimentFilter !== 'all' ? sentimentFilter : undefined,
        topic: topicFilter !== 'all' ? topicFilter : undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        searchTerm: searchTerm || undefined
      }

      const { data, error: apiError, isUsingFallback: fallback } = await fetchCustomerFeedbacks(filters)
      
      setFeedbacks(data)
      setError(apiError)
      setIsUsingFallback(fallback)
    } catch (err) {
      console.error('Error loading customer feedbacks:', err)
      setError('Failed to load customer feedbacks.')
    } finally {
      setLoading(false)
    }
  }

  // Apply filters when they change
  useEffect(() => {
    if (!loading) {
      loadCustomerFeedbacks()
    }
  }, [sentimentFilter, topicFilter, categoryFilter, searchTerm])

  // Use feedbacks directly since filtering is now done server-side
  const filteredFeedbacks = feedbacks

  // Get sentiment badge variant
  const getSentimentBadgeVariant = (sentiment: CustomerFeedbackSentiment) => {
    switch (sentiment) {
      case 'Positive': return 'default'
      case 'Negative': return 'destructive'
      case 'Neutral': return 'secondary'
      default: return 'outline'
    }
  }

  // Get sentiment badge color for detailed view
  const getSentimentBadgeColor = (sentiment: CustomerFeedbackSentiment) => {
    switch (sentiment) {
      case 'Positive': return 'bg-green-100 text-green-800 hover:bg-green-200'
      case 'Negative': return 'bg-red-100 text-red-800 hover:bg-red-200'
      case 'Neutral': return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    }
  }

  // Get sentiment icon
  const getSentimentIcon = (sentiment: CustomerFeedbackSentiment) => {
    switch (sentiment) {
      case 'Positive': return <TrendingUp className="h-3 w-3 mr-1" />
      case 'Negative': return <TrendingDown className="h-3 w-3 mr-1" />
      case 'Neutral': return <Minus className="h-3 w-3 mr-1" />
      default: return null
    }
  }

  // Get type badge color
  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'Complaint': return 'bg-red-100 text-red-800 hover:bg-red-200'
      case 'Suggestion': return 'bg-blue-100 text-blue-800 hover:bg-blue-200'
      case 'Question': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
      case 'Compliment': return 'bg-green-100 text-green-800 hover:bg-green-200'
      case 'Queries': return 'bg-blue-100 text-blue-800 hover:bg-blue-200'
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    }
  }

  // Calculate statistics
  const stats = {
    total: filteredFeedbacks.length,
    positive: filteredFeedbacks.filter(f => f.Sentiment === 'Positive').length,
    negative: filteredFeedbacks.filter(f => f.Sentiment === 'Negative').length,
    neutral: filteredFeedbacks.filter(f => f.Sentiment === 'Neutral').length,
    complaints: filteredFeedbacks.filter(f => f['Type of post'] === 'Complaint').length,
    resolved: filteredFeedbacks.filter(f => f.Status === 'Clear').length
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading customer feedbacks...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Button>
        </div>
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Customer Feedbacks</h1>
          <p className="text-muted-foreground">
            View and analyze customer feedback data from various sources
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert>
          <AlertDescription>
            {error}
            {isUsingFallback && (
              <span className="block mt-1 text-sm text-muted-foreground">
                Currently displaying sample data. The database table may not exist yet.
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feedbacks</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positive</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.positive}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.positive / stats.total) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Negative</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.negative}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.negative / stats.total) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Neutral</CardTitle>
            <Minus className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.neutral}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.neutral / stats.total) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Complaints</CardTitle>
            <Tag className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.complaints}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.complaints / stats.total) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <User className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter and search through customer feedbacks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search feedbacks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sentiment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sentiments</SelectItem>
                <SelectItem value="Positive">Positive</SelectItem>
                <SelectItem value="Neutral">Neutral</SelectItem>
                <SelectItem value="Negative">Negative</SelectItem>
              </SelectContent>
            </Select>

            <Select value={topicFilter} onValueChange={setTopicFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                <SelectItem value="Product Info">Product Info</SelectItem>
                <SelectItem value="Technical">Technical</SelectItem>
                <SelectItem value="Product Release">Product Release</SelectItem>
                <SelectItem value="Promo">Promo</SelectItem>
                <SelectItem value="E-commerce">E-commerce</SelectItem>
                <SelectItem value="Service Center">Service Center</SelectItem>
                <SelectItem value="Pricing">Pricing</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Im">Instant Messaging</SelectItem>
                <SelectItem value="General">General</SelectItem>
                <SelectItem value="Ctv">CTV</SelectItem>
                <SelectItem value="Da">Digital Assistant</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('')
                setSentimentFilter('all')
                setTopicFilter('all')
                setCategoryFilter('all')
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feedbacks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Feedbacks ({filteredFeedbacks.length})</CardTitle>
          <CardDescription>
            Detailed view of customer feedback entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Sentiment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFeedbacks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      No feedbacks found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFeedbacks.map((feedback, index) => (
                    <TableRow key={index} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{feedback.Date}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate max-w-[120px]">{feedback['Account ID']}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[300px] truncate" title={feedback['Post Copy']}>
                          {feedback['Post Copy']}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="truncate max-w-[120px]">
                          {feedback.Product}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {feedback.Topic}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeBadgeColor(feedback['Type of post'])}>
                          {feedback['Type of post']}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSentimentBadgeColor(feedback.Sentiment)}>
                          <span className="flex items-center space-x-1">
                            {getSentimentIcon(feedback.Sentiment)}
                            <span>{feedback.Sentiment}</span>
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={feedback.Status === 'Clear' ? 'default' : 'destructive'}>
                          {feedback.Status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {feedback.Source}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedFeedback(feedback)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" />
                                Customer Feedback Details
                              </DialogTitle>
                              <DialogDescription>
                                Detailed view of feedback from {feedback['Account ID']}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedFeedback && (
                              <div className="space-y-6">
                                {/* Header Info */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Account ID</label>
                                    <p className="font-medium">{selectedFeedback['Account ID']}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Product</label>
                                    <p>{selectedFeedback.Product}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Date</label>
                                    <p className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {new Date(selectedFeedback.Date).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Sentiment</label>
                                    <Badge className={getSentimentBadgeColor(selectedFeedback.Sentiment)}>
                                      <span className="flex items-center space-x-1">
                                        {getSentimentIcon(selectedFeedback.Sentiment)}
                                        <span>{selectedFeedback.Sentiment}</span>
                                      </span>
                                    </Badge>
                                  </div>
                                </div>

                                {/* Categories */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Topic</label>
                                    <div className="mt-1">
                                      <Badge variant="secondary">{selectedFeedback.Topic}</Badge>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Type</label>
                                    <div className="mt-1">
                                      <Badge className={getTypeBadgeColor(selectedFeedback['Type of post'])}>{selectedFeedback['Type of post']}</Badge>
                                    </div>
                                  </div>
                                </div>

                                {/* Content */}
                                <div className="space-y-4">
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                      <MessageSquare className="h-3 w-3" />
                                      Original Post
                                    </label>
                                    <div className="mt-2 p-4 bg-muted rounded-lg">
                                      <p className="whitespace-pre-wrap">{selectedFeedback['Post Copy']}</p>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                      <Reply className="h-3 w-3" />
                                      Status & Source
                                    </label>
                                    <div className="mt-2 p-4 bg-muted rounded-lg flex gap-2">
                                      <Badge variant={selectedFeedback.Status === 'Clear' ? 'default' : 'destructive'}>
                                        {selectedFeedback.Status}
                                      </Badge>
                                      <Badge variant="outline">
                                        {selectedFeedback.Source}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <Button onClick={loadCustomerFeedbacks} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            'Refresh Data'
          )}
        </Button>
      </div>
    </div>
  )
}