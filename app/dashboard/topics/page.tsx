"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Loader2, Search, Filter, Layers, TrendingUp, TrendingDown, Minus, Eye, ArrowLeft, MessageSquare, User, Calendar } from 'lucide-react'
import { getTopicsWithStats, getFeedbacksForTopic } from '@/lib/topics-api'
import type { TopicWithStats } from '@/types/interface/topics'

export default function TopicsPage() {
  const router = useRouter()
  const [topics, setTopics] = useState<TopicWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTopic, setSelectedTopic] = useState<TopicWithStats | null>(null)
  const [topicFeedbacks, setTopicFeedbacks] = useState<string[]>([])
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false)

  // Load topics with statistics
  useEffect(() => {
    async function loadTopics() {
      try {
        setLoading(true)
        setError(null)
        const data = await getTopicsWithStats()
        setTopics(data)
      } catch (err) {
        console.error('Error loading topics:', err)
        setError('Failed to load topics. Make sure the database is properly configured.')
      } finally {
        setLoading(false)
      }
    }

    loadTopics()
  }, [])

  // Load feedbacks for selected topic
  async function loadTopicFeedbacks(topicId: string) {
    try {
      setLoadingFeedbacks(true)
      const feedbackIds = await getFeedbacksForTopic(topicId)
      setTopicFeedbacks(feedbackIds)
    } catch (err) {
      console.error('Error loading topic feedbacks:', err)
    } finally {
      setLoadingFeedbacks(false)
    }
  }

  // Filter topics by search term
  const filteredTopics = topics.filter(topic =>
    topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (topic.category && topic.category.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Calculate overall statistics
  const stats = {
    total: filteredTopics.length,
    totalFeedbacks: filteredTopics.reduce((sum, t) => sum + t.feedback_count, 0),
    totalCustomers: filteredTopics.reduce((sum, t) => sum + t.unique_customers, 0),
    avgFeedbacksPerTopic: filteredTopics.length > 0 
      ? Math.round(filteredTopics.reduce((sum, t) => sum + t.feedback_count, 0) / filteredTopics.length)
      : 0,
  }

  // Get sentiment badge color
  const getSentimentColor = (percentage: number) => {
    if (percentage >= 70) return 'text-green-600'
    if (percentage >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading topics...</span>
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
          <div className="flex items-center space-x-3">
            <Layers className="h-8 w-8" />
            <h1 className="text-3xl font-bold tracking-tight">Topics</h1>
          </div>
          <p className="text-muted-foreground">
            View all topics and their customer feedback relationships
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium text-red-800">Error Loading Topics</p>
              <p className="text-red-700">{error}</p>
              <p className="text-sm text-red-600">
                Please ensure the database views are created. Check <code className="bg-red-100 px-1 py-0.5 rounded">migrations/001_customer_feedback_topics_many_to_many.sql</code>
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Topics</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feedbacks</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFeedbacks}</div>
            <p className="text-xs text-muted-foreground">
              Across all topics
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Customers</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Engaged with topics
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg per Topic</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgFeedbacksPerTopic}</div>
            <p className="text-xs text-muted-foreground">
              Feedbacks per topic
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Topics</CardTitle>
          <CardDescription>Filter topics by name or category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => setSearchTerm('')}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Topics Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Topics ({filteredTopics.length})</CardTitle>
          <CardDescription>
            Topics with feedback statistics and sentiment breakdown
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Topic Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Feedbacks</TableHead>
                  <TableHead>Customers</TableHead>
                  <TableHead>Positive</TableHead>
                  <TableHead>Neutral</TableHead>
                  <TableHead>Negative</TableHead>
                  <TableHead>Sentiment Score</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTopics.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      No topics found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTopics.map((topic) => (
                    <TableRow key={topic.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <Layers className="h-4 w-4 text-muted-foreground" />
                          <span>{topic.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {topic.category ? (
                          <Badge variant="outline">{topic.category}</Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="h-3 w-3 text-muted-foreground" />
                          <span className="font-semibold">{topic.feedback_count}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span>{topic.unique_customers}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="h-3 w-3 text-green-600" />
                          <span className="text-green-600 font-medium">{topic.positive_count}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Minus className="h-3 w-3 text-gray-600" />
                          <span className="text-gray-600 font-medium">{topic.neutral_count}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <TrendingDown className="h-3 w-3 text-red-600" />
                          <span className="text-red-600 font-medium">{topic.negative_count}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`font-bold ${getSentimentColor(topic.positive_percentage)}`}>
                          {topic.positive_percentage.toFixed(1)}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedTopic(topic)
                                loadTopicFeedbacks(topic.id)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Layers className="h-5 w-5" />
                                Topic Details: {topic.name}
                              </DialogTitle>
                              <DialogDescription>
                                Statistics and customer feedback relationships
                              </DialogDescription>
                            </DialogHeader>
                            {selectedTopic && (
                              <div className="space-y-6">
                                {/* Topic Info */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Topic Name</label>
                                    <p className="font-medium">{selectedTopic.name}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Category</label>
                                    <p>{selectedTopic.category || '-'}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Total Feedbacks</label>
                                    <p className="font-bold text-lg">{selectedTopic.feedback_count}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Unique Customers</label>
                                    <p className="font-bold text-lg">{selectedTopic.unique_customers}</p>
                                  </div>
                                </div>

                                {/* Sentiment Breakdown */}
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Sentiment Breakdown</label>
                                  <div className="grid grid-cols-3 gap-4">
                                    <Card>
                                      <CardContent className="pt-6">
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <p className="text-sm text-muted-foreground">Positive</p>
                                            <p className="text-2xl font-bold text-green-600">{selectedTopic.positive_count}</p>
                                          </div>
                                          <TrendingUp className="h-8 w-8 text-green-600" />
                                        </div>
                                      </CardContent>
                                    </Card>
                                    <Card>
                                      <CardContent className="pt-6">
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <p className="text-sm text-muted-foreground">Neutral</p>
                                            <p className="text-2xl font-bold text-gray-600">{selectedTopic.neutral_count}</p>
                                          </div>
                                          <Minus className="h-8 w-8 text-gray-600" />
                                        </div>
                                      </CardContent>
                                    </Card>
                                    <Card>
                                      <CardContent className="pt-6">
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <p className="text-sm text-muted-foreground">Negative</p>
                                            <p className="text-2xl font-bold text-red-600">{selectedTopic.negative_count}</p>
                                          </div>
                                          <TrendingDown className="h-8 w-8 text-red-600" />
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </div>

                                {/* Positive Sentiment Percentage */}
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Overall Sentiment Score</label>
                                  <div className="flex items-center space-x-4">
                                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                                      <div 
                                        className={`h-4 rounded-full ${
                                          selectedTopic.positive_percentage >= 70 ? 'bg-green-600' :
                                          selectedTopic.positive_percentage >= 40 ? 'bg-yellow-600' :
                                          'bg-red-600'
                                        }`}
                                        style={{ width: `${selectedTopic.positive_percentage}%` }}
                                      ></div>
                                    </div>
                                    <span className={`font-bold text-xl ${getSentimentColor(selectedTopic.positive_percentage)}`}>
                                      {selectedTopic.positive_percentage.toFixed(1)}%
                                    </span>
                                  </div>
                                </div>

                                {/* Related Feedbacks */}
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                                    Related Customer Feedbacks ({topicFeedbacks.length})
                                  </label>
                                  {loadingFeedbacks ? (
                                    <div className="flex items-center justify-center py-8">
                                      <Loader2 className="h-6 w-6 animate-spin" />
                                      <span className="ml-2">Loading feedbacks...</span>
                                    </div>
                                  ) : (
                                    <div className="bg-muted rounded-lg p-4 max-h-40 overflow-y-auto">
                                      {topicFeedbacks.length > 0 ? (
                                        <div className="space-y-2">
                                          {topicFeedbacks.slice(0, 10).map((feedbackId, index) => (
                                            <div key={feedbackId} className="text-sm">
                                              <span className="text-muted-foreground">#{index + 1}</span>{' '}
                                              <code className="bg-background px-2 py-1 rounded text-xs">{feedbackId}</code>
                                            </div>
                                          ))}
                                          {topicFeedbacks.length > 10 && (
                                            <p className="text-xs text-muted-foreground mt-2">
                                              + {topicFeedbacks.length - 10} more feedbacks
                                            </p>
                                          )}
                                        </div>
                                      ) : (
                                        <p className="text-sm text-muted-foreground">No feedbacks linked to this topic yet.</p>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {/* Timestamps */}
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                  <div>
                                    <label className="text-xs text-muted-foreground">Created At</label>
                                    <p className="text-sm flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {selectedTopic.created_at ? new Date(selectedTopic.created_at).toLocaleString() : '-'}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-xs text-muted-foreground">Updated At</label>
                                    <p className="text-sm flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {selectedTopic.updated_at ? new Date(selectedTopic.updated_at).toLocaleString() : '-'}
                                    </p>
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
    </div>
  )
}

