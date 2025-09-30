import { supabase } from './supabase'
import { 
  CustomerFeedback, 
  CustomerFeedbackCategory,
  CustomerFeedbackTypeOfPost,
  CustomerFeedbackTopic,
  CustomerFeedbackSentiment,
  CustomerFeedbackSource,
  CustomerFeedbackStatus
} from '@/types/interface/customer-feedbacks'
import { extendedCustomerFeedbackData } from './customer-feedback-data'

export interface CustomerFeedbackFilters {
  sentiment?: string
  topic?: string
  category?: string
  status?: string
  dateFrom?: string
  dateTo?: string
  searchTerm?: string
}

// Database row type for customer feedback
interface DatabaseRow {
  id?: string
  ID?: string
  link?: string
  Link?: string
  post_copy?: string
  'Post Copy'?: string
  date?: string
  Date?: string
  time?: string
  Time?: string
  date_responses?: string
  'Date responses'?: string
  account_id?: string
  'Account ID'?: string
  customer_id?: string
  'Customer ID'?: string
  category?: string
  Category?: string
  type_of_post?: string
  'Type of post'?: string
  topic?: string
  Topic?: string
  product?: string
  Product?: string
  sentiment?: string
  Sentiment?: string
  source?: string
  Source?: string
  reply?: string
  Reply?: string
  status?: string
  Status?: string
  details?: string
  Details?: string
  [key: string]: unknown
}

// Transform database row to CustomerFeedback interface
export function transformDatabaseRowToCustomerFeedback(row: DatabaseRow): CustomerFeedback {
  return {
    ID: (row.id || row.ID || '') as string,
    Link: row.link || row.Link || '',
    'Post Copy': row.post_copy || row['Post Copy'] || '',
    Date: row.date || row.Date || '',
    Time: row.time || row.Time || '',
    'Date responses': row.date_responses || row['Date responses'] || '',
    'Account ID': row.account_id || row['Account ID'] || '',
    'Customer ID': row.customer_id || row['Customer ID'] || '',
    Category: (row.category || row.Category || 'General') as CustomerFeedbackCategory,
    'Type of post': (row.type_of_post || row['Type of post'] || 'Others') as CustomerFeedbackTypeOfPost,
    Topic: (row.topic || row.Topic || 'Product Info') as CustomerFeedbackTopic,
    Product: row.product || row.Product || '',
    Sentiment: (row.sentiment || row.Sentiment || 'Neutral') as CustomerFeedbackSentiment,
    Source: (row.source || row.Source || 'DM Facebook') as CustomerFeedbackSource,
    Reply: row.reply || row.Reply || '',
    Status: (row.status || row.Status || 'Pending') as CustomerFeedbackStatus,
    Details: row.details || row.Details || ''
  }
}

// Transform CustomerFeedback to database row format
export function transformCustomerFeedbackToDatabase(feedback: CustomerFeedback, includeId: boolean = true) {
  const baseData = {
    link: feedback.Link,
    post_copy: feedback['Post Copy'],
    date: feedback.Date,
    time: feedback.Time,
    date_responses: feedback['Date responses'],
    account_id: feedback['Account ID'],
    customer_id: feedback['Customer ID'],
    category: feedback.Category,
    type_of_post: feedback['Type of post'],
    topic: feedback.Topic,
    product: feedback.Product,
    sentiment: feedback.Sentiment,
    source: feedback.Source,
    reply: feedback.Reply,
    status: feedback.Status,
    details: feedback.Details,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  if (includeId) {
    return { id: feedback.ID, ...baseData }
  }
  
  return baseData
}

// Fetch all customer feedbacks with optional filters
export async function fetchCustomerFeedbacks(filters?: CustomerFeedbackFilters): Promise<{
  data: CustomerFeedback[]
  error: string | null
  isUsingFallback: boolean
}> {
  try {
    let query = supabase
      .from('customer_feedbacks')
      .select('*')

    // Apply filters
    if (filters) {
      if (filters.sentiment && filters.sentiment !== 'all') {
        query = query.eq('sentiment', filters.sentiment)
      }
      if (filters.topic && filters.topic !== 'all') {
        query = query.eq('topic', filters.topic)
      }
      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category)
      }
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status)
      }
      if (filters.dateFrom) {
        query = query.gte('date', filters.dateFrom)
      }
      if (filters.dateTo) {
        query = query.lte('date', filters.dateTo)
      }
      if (filters.searchTerm) {
        query = query.or(`post_copy.ilike.%${filters.searchTerm}%,account_id.ilike.%${filters.searchTerm}%,product.ilike.%${filters.searchTerm}%,reply.ilike.%${filters.searchTerm}%`)
      }
    }

    // Order by date descending
    query = query.order('date', { ascending: false })

    const { data, error } = await query

    if (error) {
      console.log('Supabase error, using fallback data:', error.message)
      
      // Apply filters to fallback data if needed
      let fallbackData = extendedCustomerFeedbackData
      
      if (filters) {
        fallbackData = fallbackData.filter(feedback => {
          if (filters.sentiment && filters.sentiment !== 'all' && feedback.Sentiment !== filters.sentiment) {
            return false
          }
          if (filters.topic && filters.topic !== 'all' && feedback.Topic !== filters.topic) {
            return false
          }
          if (filters.category && filters.category !== 'all' && feedback.Category !== filters.category) {
            return false
          }
          if (filters.status && filters.status !== 'all' && feedback.Status !== filters.status) {
            return false
          }
          if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase()
            const matchesSearch = 
              feedback['Post Copy'].toLowerCase().includes(searchLower) ||
              feedback['Account ID'].toLowerCase().includes(searchLower) ||
              feedback.Product.toLowerCase().includes(searchLower) ||
              feedback.Reply.toLowerCase().includes(searchLower)
            if (!matchesSearch) return false
          }
          return true
        })
      }
      
      return {
        data: fallbackData,
        error: `Using sample data: ${error.message}`,
        isUsingFallback: true
      }
    }

    // Transform data to match interface
    const transformedData = data?.map(transformDatabaseRowToCustomerFeedback) || []

    return {
      data: transformedData,
      error: null,
      isUsingFallback: false
    }
  } catch (err) {
    console.error('Error fetching customer feedbacks:', err)
    return {
      data: extendedCustomerFeedbackData,
      error: 'Failed to connect to database. Using sample data.',
      isUsingFallback: true
    }
  }
}

// Fetch a single customer feedback by ID
export async function fetchCustomerFeedbackById(id: string): Promise<{
  data: CustomerFeedback | null
  error: string | null
}> {
  try {
    const { data, error } = await supabase
      .from('customer_feedbacks')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      // Try to find in fallback data
      const fallbackItem = extendedCustomerFeedbackData.find(item => item.ID === id)
      return {
        data: fallbackItem || null,
        error: fallbackItem ? null : 'Feedback not found'
      }
    }

    return {
      data: data ? transformDatabaseRowToCustomerFeedback(data) : null,
      error: null
    }
  } catch (err) {
    console.error('Error fetching customer feedback:', err)
    return {
      data: null,
      error: 'Failed to fetch customer feedback'
    }
  }
}

// Create a new customer feedback
export async function createCustomerFeedback(feedback: Omit<CustomerFeedback, 'ID'>): Promise<{
  data: CustomerFeedback | null
  error: string | null
}> {
  try {
    const dbData = transformCustomerFeedbackToDatabase({
      ...feedback,
      ID: '' // Will be generated by database
    }, false) // Don't include ID for creation

    const { data, error } = await supabase
      .from('customer_feedbacks')
      .insert([dbData])
      .select()
      .single()

    if (error) {
      console.error('Error creating customer feedback:', error)
      return { data: null, error: error.message }
    }

    if (!data) {
      return { data: null, error: 'No data returned from insert' }
    }

    return {
      data: transformDatabaseRowToCustomerFeedback(data),
      error: null
    }
  } catch (error) {
    console.error('Error creating customer feedback:', error)
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

// Update an existing customer feedback
export async function updateCustomerFeedback(id: string, updates: Partial<CustomerFeedback>): Promise<{
  data: CustomerFeedback | null
  error: string | null
}> {
  try {
    const dbUpdates = transformCustomerFeedbackToDatabase({
      ID: id,
      ...updates
    } as CustomerFeedback)

    const { data, error } = await supabase
      .from('customer_feedbacks')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return {
        data: null,
        error: error.message
      }
    }

    return {
      data: data ? transformDatabaseRowToCustomerFeedback(data) : null,
      error: null
    }
  } catch (err) {
    console.error('Error updating customer feedback:', err)
    return {
      data: null,
      error: 'Failed to update customer feedback'
    }
  }
}

// Delete a customer feedback
export async function deleteCustomerFeedback(id: string): Promise<{
  success: boolean
  error: string | null
}> {
  try {
    const { error } = await supabase
      .from('customer_feedbacks')
      .delete()
      .eq('id', id)

    if (error) {
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true,
      error: null
    }
  } catch (err) {
    console.error('Error deleting customer feedback:', err)
    return {
      success: false,
      error: 'Failed to delete customer feedback'
    }
  }
}

// Get statistics for customer feedbacks
export async function getCustomerFeedbackStats(): Promise<{
  data: {
    total: number
    positive: number
    negative: number
    neutral: number
    complaints: number
    resolved: number
    byCategory: Record<string, number>
    byTopic: Record<string, number>
  } | null
  error: string | null
  isUsingFallback: boolean
}> {
  try {
    const { data: feedbacks, error, isUsingFallback } = await fetchCustomerFeedbacks()

    if (error && !isUsingFallback) {
      return { data: null, error, isUsingFallback: false }
    }

    const stats = {
      total: feedbacks.length,
      positive: feedbacks.filter(f => f.Sentiment === 'Positive').length,
      negative: feedbacks.filter(f => f.Sentiment === 'Negative').length,
      neutral: feedbacks.filter(f => f.Sentiment === 'Neutral').length,
      complaints: feedbacks.filter(f => f['Type of post'] === 'Complaint').length,
      resolved: feedbacks.filter(f => f.Status === 'Clear').length,
      byCategory: feedbacks.reduce((acc, f) => {
        acc[f.Category] = (acc[f.Category] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      byTopic: feedbacks.reduce((acc, f) => {
        acc[f.Topic] = (acc[f.Topic] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    }

    return {
      data: stats,
      error: isUsingFallback ? error : null,
      isUsingFallback
    }
  } catch (err) {
    console.error('Error getting customer feedback stats:', err)
    return {
      data: null,
      error: 'Failed to get statistics',
      isUsingFallback: false
    }
  }
}