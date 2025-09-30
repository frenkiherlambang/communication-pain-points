import { supabase } from './supabase'
import { CustomerFeedback } from '@/types/interface/customer-feedbacks'

// Database response types
interface DatabaseFeedbackRow {
  id: string
  sentiment: string | null
  type_of_post: string | null
  topic: string | null
  status: string | null
  date: string | null
  time: string | null
  date_responses: string | null
}

export interface DashboardMetrics {
  overallSentimentScore: number
  activePainPoints: {
    total: number
    high: number
    medium: number
    low: number
  }
  crisisRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  averageResponseTime: number
  totalFeedbacks: number
  isUsingFallback?: boolean
  errors?: string[]
}

/**
 * Calculate overall sentiment score from customer feedback data
 * Returns a score from 0-10 based on sentiment distribution
 */
export async function calculateOverallSentimentScore(): Promise<{
  score: number
  isUsingFallback: boolean
  error?: string
}> {
  try {
    const { data, error } = await supabase
      .from('customer_feedbacks')
      .select('sentiment')
      .not('sentiment', 'is', null)

    if (error) {
      console.error('Error fetching sentiment data:', error)
      // Return fallback score based on typical customer feedback patterns
      return {
        score: 6.5, // Slightly positive baseline
        isUsingFallback: true,
        error: `Database error: ${error.message}`
      }
    }

    if (!data || data.length === 0) {
      return {
        score: 5.0, // Neutral baseline when no data
        isUsingFallback: true,
        error: 'No sentiment data available'
      }
    }

    const sentimentCounts = data.reduce((acc, feedback) => {
      const sentiment = feedback.sentiment?.toLowerCase()
      if (sentiment === 'positive') acc.positive++
      else if (sentiment === 'negative') acc.negative++
      else acc.neutral++
      return acc
    }, { positive: 0, negative: 0, neutral: 0 })

    const total = data.length
    const positiveRatio = sentimentCounts.positive / total
    const negativeRatio = sentimentCounts.negative / total
    
    // Calculate score: positive feedback adds to score, negative subtracts
    // Neutral is considered baseline (5/10)
    const score = 5 + (positiveRatio * 5) - (negativeRatio * 5)
    
    return {
      score: Math.round(score * 10) / 10, // Round to 1 decimal place
      isUsingFallback: false
    }
  } catch (error) {
    console.error('Error calculating sentiment score:', error)
    return {
      score: 5.0,
      isUsingFallback: true,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Calculate active pain points based on complaints and negative feedback
 * Categorizes pain points by severity based on topic and sentiment
 */
export async function calculateActivePainPoints(): Promise<{
  total: number
  high: number
  medium: number
  low: number
}> {
  try {
    const { data, error } = await supabase
      .from('customer_feedbacks')
      .select('sentiment, type_of_post, topic, status')
      .or('sentiment.eq.Negative,type_of_post.eq.Complaint')

    if (error) {
      console.error('Error fetching pain points data:', error)
      return { total: 0, high: 0, medium: 0, low: 0 }
    }

    if (!data || data.length === 0) {
      return { total: 0, high: 0, medium: 0, low: 0 }
    }

    const painPoints = data.reduce((acc, feedback) => {
      const isComplaint = feedback.type_of_post === 'Complaint'
      const isNegative = feedback.sentiment === 'Negative'
      const isPending = feedback.status === 'Pending'
      const topic = feedback.topic

      // Determine severity based on multiple factors
      let severity: 'high' | 'medium' | 'low' = 'low'

      if (isComplaint && isNegative && isPending) {
        // High severity: Complaint + Negative sentiment + Pending status
        severity = 'high'
      } else if ((isComplaint && isNegative) || (isComplaint && isPending) || 
                 (isNegative && isPending)) {
        // Medium severity: Two of the three factors
        severity = 'medium'
      } else if (isComplaint || isNegative) {
        // Low severity: Only one factor
        severity = 'low'
      }

      // Escalate severity for critical topics
      const criticalTopics = ['Technical', 'Service Center', 'Pricing']
      if (criticalTopics.includes(topic) && severity === 'low') {
        severity = 'medium'
      } else if (criticalTopics.includes(topic) && severity === 'medium') {
        severity = 'high'
      }

      acc[severity]++
      acc.total++
      return acc
    }, { total: 0, high: 0, medium: 0, low: 0 })

    return painPoints
  } catch (error) {
    console.error('Error calculating pain points:', error)
    return { total: 0, high: 0, medium: 0, low: 0 }
  }
}

/**
 * Calculate crisis risk level based on pain points and recent trends
 */
export async function calculateCrisisRiskLevel(): Promise<'LOW' | 'MEDIUM' | 'HIGH'> {
  try {
    const painPoints = await calculateActivePainPoints()
    
    // Get recent feedback (last 7 days) to check for trends
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const { data: recentData, error } = await supabase
      .from('customer_feedbacks')
      .select('sentiment, type_of_post')
      .gte('date', sevenDaysAgo.toISOString().split('T')[0])
      .or('sentiment.eq.Negative,type_of_post.eq.Complaint')

    if (error) {
      console.error('Error fetching recent data for crisis assessment:', error)
    }

    const recentNegativeCount = recentData?.length || 0
    const highPainPoints = painPoints.high
    
    // Crisis level logic
    if (highPainPoints > 5 || recentNegativeCount > 10) {
      return 'HIGH'
    } else if (highPainPoints > 2 || recentNegativeCount > 5) {
      return 'MEDIUM'
    } else {
      return 'LOW'
    }
  } catch (error) {
    console.error('Error calculating crisis risk level:', error)
    return 'LOW'
  }
}

/**
 * Calculate average response time in hours
 * Based on the difference between feedback date and response date
 */
export async function calculateAverageResponseTime(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('customer_feedbacks')
      .select('date, time, date_responses, status')
      .not('date_responses', 'is', null)
      .eq('status', 'Clear') // Only include resolved feedbacks

    if (error) {
      console.error('Error fetching response time data:', error)
      return 0
    }

    if (!data || data.length === 0) {
      return 0
    }

    const responseTimes = data
      .map(feedback => {
        try {
          const feedbackDateTime = new Date(`${feedback.date}T${feedback.time || '00:00:00'}`)
          const responseDate = new Date(`${feedback.date_responses}T23:59:59`) // Assume end of day for response
          
          if (isNaN(feedbackDateTime.getTime()) || isNaN(responseDate.getTime())) {
            return null
          }

          const diffInMs = responseDate.getTime() - feedbackDateTime.getTime()
          const diffInHours = diffInMs / (1000 * 60 * 60)
          
          return diffInHours > 0 ? diffInHours : null
        } catch (error) {
          return null
        }
      })
      .filter((time): time is number => time !== null && time > 0)

    if (responseTimes.length === 0) {
      return 0
    }

    const averageHours = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
    return Math.round(averageHours * 10) / 10 // Round to 1 decimal place
  } catch (error) {
    console.error('Error calculating average response time:', error)
    return 0
  }
}

/**
 * Get total number of customer feedbacks
 */
export async function getTotalFeedbackCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('customer_feedbacks')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('Error fetching total feedback count:', error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error('Error getting total feedback count:', error)
    return 0
  }
}

/**
 * Get all dashboard metrics in a single call
 */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    const [
      sentimentResult,
      activePainPoints,
      crisisRiskLevel,
      averageResponseTime,
      totalFeedbacks
    ] = await Promise.all([
      calculateOverallSentimentScore(),
      calculateActivePainPoints(),
      calculateCrisisRiskLevel(),
      calculateAverageResponseTime(),
      getTotalFeedbackCount()
    ])

    const errors: string[] = []
    let isUsingFallback = false

    if (sentimentResult.isUsingFallback) {
      isUsingFallback = true
      if (sentimentResult.error) {
        errors.push(`Sentiment calculation: ${sentimentResult.error}`)
      }
    }

    const result: DashboardMetrics = {
      overallSentimentScore: sentimentResult.score,
      activePainPoints,
      crisisRiskLevel,
      averageResponseTime,
      totalFeedbacks
    }

    if (isUsingFallback) {
      result.isUsingFallback = true
    }

    if (errors.length > 0) {
      result.errors = errors
    }

    return result
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error)
    return {
      overallSentimentScore: 5.0,
      activePainPoints: { total: 0, high: 0, medium: 0, low: 0 },
      crisisRiskLevel: 'LOW',
      averageResponseTime: 0,
      totalFeedbacks: 0,
      isUsingFallback: true,
      errors: [error instanceof Error ? error.message : 'Unknown error occurred']
    }
  }
}