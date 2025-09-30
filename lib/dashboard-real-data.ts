import { supabase } from './supabase'
import { CustomerFeedback } from '@/types/interface/customer-feedbacks'

// Types for dashboard data
export interface SentimentTrendData {
  date: string
  positive: number
  neutral: number
  negative: number
}

export interface CustomerSegmentData {
  segment: string
  value: number
  color: string
}

export interface PainPointData {
  category: string
  issues: number
  severity: 'high' | 'medium' | 'low'
}

export interface TopicTrendData {
  topic: string
  mentions: number
  sentiment: number
}

export interface PainPointAlert {
  title: string
  description: string
  source: string
  severity: 'high' | 'medium' | 'low'
  icon: 'XCircle' | 'AlertTriangle' | 'AlertCircle'
}

// Fetch all customer feedbacks for analysis
export async function fetchAllCustomerFeedbacks(): Promise<CustomerFeedback[]> {
  try {
    const { data, error } = await supabase
      .from('customer_feedbacks')
      .select('*')
      .order('date', { ascending: false })

    if (error) {
      console.error('Error fetching customer feedbacks:', error)
      return []
    }

    // Transform database rows to CustomerFeedback interface
    return data?.map(row => ({
      ID: row.id,
      Link: row.link || '',
      post_copy: row.post_copy || '',
      date: row.date,
      time: row.time,
      dateResponses: row.date_responses || '',
      accountId: row.account_id || '',
      customerId: row.customer_id || '',
      category: row.category,
      typeOfPost: row.type_of_post,
      topic: row.topic,
      product: row.product || '',
      sentiment: row.sentiment,
      source: row.source,
      reply: row.reply || '',
      status: row.status,
      details: row.details || ''
    })) || []
      
  } catch (error) {
    console.error('Error in fetchAllCustomerFeedbacks:', error)
    return []
  }
}

// Generate sentiment trend data from real feedback
export async function generateRealSentimentTrendData(): Promise<SentimentTrendData[]> {
  try {
    const feedbacks = await fetchAllCustomerFeedbacks()
    
    // Group by date and count sentiments, keeping track of actual date objects for sorting
    const dateGroups: { [key: string]: { positive: number, neutral: number, negative: number, actualDate: Date } } = {}
    
    feedbacks.forEach(feedback => {
      const actualDate = new Date(feedback.date)
      const dateString = actualDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
      
      if (!dateGroups[dateString]) {
        dateGroups[dateString] = { positive: 0, neutral: 0, negative: 0, actualDate }
      }
      
      const sentiment = feedback.sentiment.toLowerCase()
      if (sentiment === 'positive') {
        dateGroups[dateString].positive++
      } else if (sentiment === 'negative') {
        dateGroups[dateString].negative++
      } else {
        dateGroups[dateString].neutral++
      }
    })
    
    // Convert to array and sort by actual date chronologically (earliest to latest)
    return Object.entries(dateGroups)
      .map(([date, counts]) => ({
        date,
        positive: counts.positive,
        neutral: counts.neutral,
        negative: counts.negative,
        actualDate: counts.actualDate
      }))
      .sort((a, b) => a.actualDate.getTime() - b.actualDate.getTime()) // Sort chronologically
      .slice(-30) // Last 30 days
      .map(({ date, positive, neutral, negative }) => ({ // Remove actualDate from final result
        date,
        positive,
        neutral,
        negative
      }))
  } catch (error) {
    console.error('Error generating sentiment trend data:', error)
    return []
  }
}

// Analyze customer segments from real data
export async function analyzeRealCustomerSegments(): Promise<CustomerSegmentData[]> {
  try {
    const feedbacks = await fetchAllCustomerFeedbacks()
    
    // Count by category
    const categoryCount: { [key: string]: number } = {}
    feedbacks.forEach(feedback => {
      const category = feedback.category
      categoryCount[category] = (categoryCount[category] || 0) + 1
    })
    
    const total = feedbacks.length
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1']
    
    return Object.entries(categoryCount).map(([category, count], index) => ({
      segment: category,
      value: Math.round((count / total) * 100),
      color: colors[index % colors.length]
    }))
  } catch (error) {
    console.error('Error analyzing customer segments:', error)
    return []
  }
}

// Analyze pain points from real feedback
export async function analyzeRealPainPoints(): Promise<PainPointData[]> {
  try {
    const feedbacks = await fetchAllCustomerFeedbacks()
    
    // Filter negative feedback and complaints
    const painPoints = feedbacks.filter(feedback => 
      feedback.sentiment === 'Negative' || 
      feedback.typeOfPost === 'Complaint'
    )
    
    // Group by topic and count issues
    const topicCount: { [key: string]: number } = {}
    painPoints.forEach(feedback => {
      const topic = feedback.topic
      topicCount[topic] = (topicCount[topic] || 0) + 1
    })
    
    // Determine severity based on count
    return Object.entries(topicCount).map(([topic, count]) => ({
      category: topic,
      issues: count,
      severity: count >= 5 ? 'high' : count >= 2 ? 'medium' : 'low' as 'high' | 'medium' | 'low'
    })).sort((a, b) => b.issues - a.issues)
  } catch (error) {
    console.error('Error analyzing pain points:', error)
    return []
  }
}

// Generate pain point alerts from real data
export async function generateRealPainPointAlerts(): Promise<PainPointAlert[]> {
  try {
    const feedbacks = await fetchAllCustomerFeedbacks()
    
    // Get recent negative feedback (last 7 days)
    const recentDate = new Date()
    recentDate.setDate(recentDate.getDate() - 7)
    
    const recentNegative = feedbacks.filter(feedback => {
      const feedbackDate = new Date(feedback.date)
      return feedbackDate >= recentDate && 
             (feedback.sentiment === 'Negative' || feedback.typeOfPost === 'Complaint')
    })
    
    // Group by product and topic to identify patterns
    const productIssues: { [key: string]: number } = {}
    const topicIssues: { [key: string]: number } = {}
    
    recentNegative.forEach(feedback => {
      if (feedback.product) { 
        productIssues[feedback.product] = (productIssues[feedback.product] || 0) + 1
      }
      topicIssues[feedback.topic] = (topicIssues[feedback.topic] || 0) + 1
    })
    
    const alerts: PainPointAlert[] = []
    
    // Product-specific alerts
    Object.entries(productIssues).forEach(([product, count]) => {
      if (count >= 3) {
        alerts.push({
          title: `${product} Issues`,
          description: `Multiple reports of issues with ${product}`,
          source: 'From customer feedback',
          severity: count >= 5 ? 'high' : 'medium',
          icon: count >= 5 ? 'XCircle' : 'AlertTriangle'
        })
      }
    })
    
    // Topic-specific alerts
    Object.entries(topicIssues).forEach(([topic, count]) => {
      if (count >= 3 && topic !== 'Product Info') {
        alerts.push({
          title: `${topic} Concerns`,
          description: `Increased ${topic.toLowerCase()} related issues`,
          source: 'Multiple customer complaints',
          severity: count >= 5 ? 'high' : 'medium',
          icon: count >= 5 ? 'XCircle' : 'AlertTriangle'
        })
      }
    })
    
    // Add general monitoring alert if we have data
    if (recentNegative.length > 0) {
      alerts.push({
        title: 'Customer Feedback Monitoring',
        description: `${recentNegative.length} negative feedback items in the last 7 days`,
        source: 'Ongoing monitoring',
        severity: 'low',
        icon: 'AlertCircle'
      })
    }
    
    return alerts.slice(0, 3) // Return top 3 alerts
  } catch (error) {
    console.error('Error generating pain point alerts:', error)
    return []
  }
}

// Analyze topic trends from real data
export async function analyzeRealTopicTrends(): Promise<TopicTrendData[]> {
  try {
    const feedbacks = await fetchAllCustomerFeedbacks()
    
    // Group by topic and calculate sentiment
    const topicData: { [key: string]: { mentions: number, positiveCount: number, totalCount: number } } = {}
    
    feedbacks.forEach(feedback => {
      const topic = feedback.topic
      if (!topicData[topic]) {
        topicData[topic] = { mentions: 0, positiveCount: 0, totalCount: 0 }
      }
      
      topicData[topic].mentions++
      topicData[topic].totalCount++
      
      if (feedback.sentiment === 'Positive') {
        topicData[topic].positiveCount++
      }
    })
    
    // Calculate sentiment score and return sorted by mentions
    return Object.entries(topicData)
      .map(([topic, data]) => ({
        topic,
        mentions: data.mentions,
        sentiment: data.totalCount > 0 ? data.positiveCount / data.totalCount : 0.5
      }))
      .sort((a, b) => b.mentions - a.mentions)
      .slice(0, 8) // Top 8 topics
  } catch (error) {
    console.error('Error analyzing topic trends:', error)
    return []
  }
}

// Calculate customer journey metrics from real data
export async function calculateRealCustomerJourneyMetrics(): Promise<{
  initialContact: number
  responseProvided: number
  issueResolution: number
  customerSatisfaction: number
}> {
  try {
    const feedbacks = await fetchAllCustomerFeedbacks()
    
    const totalFeedbacks = feedbacks.length
    const withResponses = feedbacks.filter(f => f.reply && f.reply.trim() !== '').length
    const resolved = feedbacks.filter(f => f.status === 'Clear').length
    const positive = feedbacks.filter(f => f.sentiment === 'Positive').length
    
    return {
      initialContact: totalFeedbacks,
      responseProvided: withResponses,
      issueResolution: resolved,
      customerSatisfaction: positive
    }
  } catch (error) {
    console.error('Error calculating customer journey metrics:', error)
    return {
      initialContact: 0,
      responseProvided: 0,
      issueResolution: 0,
      customerSatisfaction: 0
    }
  }
}

// Calculate segment performance from real data
export async function calculateRealSegmentPerformance(): Promise<CustomerSegmentData[]> {
  try {
    const feedbacks = await fetchAllCustomerFeedbacks()
    const journeyMetrics = await calculateRealCustomerJourneyMetrics()
    
    // Group by category and calculate completion rates
    const categoryMetrics: { [key: string]: { total: number, resolved: number } } = {}
    
    feedbacks.forEach(feedback => {
      const category = feedback.category
      if (!categoryMetrics[category]) {
        categoryMetrics[category] = { total: 0, resolved: 0 }
      }
      
      categoryMetrics[category].total++
      if (feedback.status === 'Clear') {
        categoryMetrics[category].resolved++
      }
    })
    
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300']
    
    return Object.entries(categoryMetrics).map(([category, metrics], index) => ({
      segment: category,
      value: metrics.total > 0 ? Math.round((metrics.resolved / metrics.total) * 100) : 0,
      color: colors[index % colors.length]
    }))
  } catch (error) {
    console.error('Error calculating segment performance:', error)
    return []
  }
}