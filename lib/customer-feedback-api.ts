import { supabase, isSupabaseConfigured } from './supabase'
import { 
  CustomerFeedback, 
  CustomerFeedbackSentiment, 
  CustomerFeedbackTopic, 
  CustomerFeedbackCategory,
  CustomerFeedbackTypeOfPost,
  CustomerFeedbackSource,
  CustomerFeedbackStatus
} from '@/types/interface/customer-feedbacks'

// Filter interface for API requests
export interface CustomerFeedbackFilters {
  sentiment?: string
  topic?: string
  category?: string
  searchTerm?: string
  limit?: number
  offset?: number
}

// API response interface
export interface CustomerFeedbackApiResponse {
  data: CustomerFeedback[]
  error: string | null
  isUsingFallback: boolean
  total?: number
}

// Sample fallback data for when database is not available
const sampleCustomerFeedbacks: CustomerFeedback[] = [
  {
    ID: '00000000-0000-0000-0000-000000000001',
    Link: '',
    post_copy: 'Blackberry 06 msh ada kk',
    date: '2025-03-05',
    time: '12:59:00',
    dateResponses: '2025-03-05',
    accountId: 'Arjuna Rajendra',
    customerId: '',
    category: 'Im',
    typeOfPost: 'Queries',
    topic: 'Product Info',
    product: 'Galaxy A06',
    sentiment: 'Neutral',
    source: 'DM Facebook',
    reply: 'Halo kak Arjuna, #GalaxyA06 Light Green bisa kamu dapatkan di Blackberry.com/id dengan harga Rp1.999.000',
    status: 'Clear',
    details: 'Availability'
  },
  {
    ID: '00000000-0000-0000-0000-000000000002',
    Link: '',
    post_copy: 'Kapan rilis Galaxy A56?',
    date: '2025-03-04',
    time: '14:30:00',
    dateResponses: '2025-03-04',
    accountId: 'Budi Santoso',
    customerId: '',
    category: 'Im',
    typeOfPost: 'Queries',
    topic: 'Product Release',
    product: 'Galaxy A56',
    sentiment: 'Neutral',
    source: 'DM Facebook',
    reply: 'Halo kak Budi, untuk informasi rilis Galaxy A56 akan kami update di channel resmi kami',
    status: 'Clear',
    details: 'Product release inquiry'
  },
  {
    ID: '00000000-0000-0000-0000-000000000003',
    Link: '',
    post_copy: 'Harga Galaxy S24 Ultra berapa ya?',
    date: '2025-03-03',
    time: '10:15:00',
    dateResponses: '2025-03-03',
    accountId: 'Sari Dewi',
    customerId: '',
    category: 'Im',
    typeOfPost: 'Queries',
    topic: 'Pricing',
    product: 'Galaxy S24 Ultra',
    sentiment: 'Neutral',
    source: 'DM Facebook',
    reply: 'Halo kak Sari, Galaxy S24 Ultra tersedia dengan harga mulai dari Rp18.999.000',
    status: 'Clear',
    details: 'Pricing inquiry'
  },
  {
    ID: '00000000-0000-0000-0000-000000000004',
    Link: '',
    post_copy: 'Service center terdekat di Jakarta dimana ya?',
    date: '2025-03-02',
    time: '16:45:00',
    dateResponses: '2025-03-02',
    accountId: 'Ahmad Rizki',
    customerId: '',
    category: 'General',
    typeOfPost: 'Queries',
    topic: 'Service Center',
    product: 'General',
    sentiment: 'Neutral',
    source: 'DM Facebook',
    reply: 'Halo kak Ahmad, service center terdekat di Jakarta ada di Mall Taman Anggrek dan Plaza Indonesia',
    status: 'Clear',
    details: 'Service center location inquiry'
  },
  {
    ID: '00000000-0000-0000-0000-000000000005',
    Link: '',
    post_copy: 'Kecewa dengan layanan customer service, respon lambat sekali',
    date: '2025-03-01',
    time: '09:20:00',
    dateResponses: '2025-03-01',
    accountId: 'Maya Putri',
    customerId: '',
    category: 'General',
    typeOfPost: 'Complaint',
    topic: 'Service Center',
    product: 'Customer Service',
    sentiment: 'Negative',
    source: 'Comment Facebook',
    reply: 'Mohon maaf atas ketidaknyamanan ini kak Maya, kami akan tingkatkan kualitas layanan kami',
    status: 'Clear',
    details: 'Customer service complaint'
  },
  {
    ID: '00000000-0000-0000-0000-000000000006',
    Link: '',
    post_copy: 'Galaxy Watch 6 sangat bagus! Battery life lama dan fitur kesehatan lengkap',
    date: '2025-02-28',
    time: '11:30:00',
    dateResponses: '2025-02-28',
    accountId: 'Andi Pratama',
    customerId: '',
    category: 'General',
    typeOfPost: 'Compliment',
    topic: 'Product Info',
    product: 'Galaxy Watch 6',
    sentiment: 'Positive',
    source: 'Comment Facebook',
    reply: 'Terima kasih kak Andi atas review positifnya! Senang mendengar Galaxy Watch 6 sesuai ekspektasi',
    status: 'Clear',
    details: 'Product appreciation'
  },
  {
    ID: '00000000-0000-0000-0000-000000000007',
    Link: '',
    post_copy: 'Ada promo untuk Galaxy Buds Pro tidak?',
    date: '2025-02-27',
    time: '13:45:00',
    dateResponses: '2025-02-27',
    accountId: 'Rina Sari',
    customerId: '',
    category: 'Im',
    typeOfPost: 'Queries',
    topic: 'Promo',
    product: 'Galaxy Buds Pro',
    sentiment: 'Neutral',
    source: 'DM Facebook',
    reply: 'Halo kak Rina, saat ini ada promo cashback 500rb untuk Galaxy Buds Pro hingga akhir bulan',
    status: 'Clear',
    details: 'Promotion inquiry'
  },
  {
    ID: '00000000-0000-0000-0000-000000000008',
    Link: '',
    post_copy: 'Galaxy A15 sering hang, ada solusi tidak?',
    date: '2025-02-26',
    time: '15:20:00',
    dateResponses: '',
    accountId: 'Dedi Kurniawan',
    customerId: '',
    category: 'General',
    typeOfPost: 'Complaint',
    topic: 'Technical',
    product: 'Galaxy A15',
    sentiment: 'Negative',
    source: 'Comment Facebook',
    reply: '',
    status: 'Pending',
    details: 'Technical issue - device hanging'
  },
  {
    ID: '00000000-0000-0000-0000-000000000009',
    Link: '',
    post_copy: 'Kapan ada update One UI 6.1 untuk Galaxy S23?',
    date: '2025-02-25',
    time: '08:10:00',
    dateResponses: '2025-02-25',
    accountId: 'Fitri Handayani',
    customerId: '',
    category: 'General',
    typeOfPost: 'Queries',
    topic: 'Technical',
    product: 'Galaxy S23',
    sentiment: 'Neutral',
    source: 'Comment Facebook',
    reply: 'Halo kak Fitri, update One UI 6.1 untuk Galaxy S23 sudah tersedia, silakan cek di Settings > Software update',
    status: 'Clear',
    details: 'Software update inquiry'
  },
  {
    ID: '00000000-0000-0000-0000-000000000010',
    Link: '',
    post_copy: 'Terima kasih Samsung Indonesia, pelayanan toko offline sangat memuaskan!',
    date: '2025-02-24',
    time: '17:55:00',
    dateResponses: '2025-02-24',
    accountId: 'Tech Enthusiast',
    customerId: '',
    category: 'General',
    typeOfPost: 'Compliment',
    topic: 'Service Center',
    product: 'Store Service',
    sentiment: 'Positive',
    source: 'Comment Facebook',
    reply: 'Terima kasih atas feedback positifnya! Kami senang bisa memberikan pelayanan terbaik',
    status: 'Clear',
    details: 'Store service appreciation'
  }
]

/**
 * Database row interface matching the customer_feedbacks table schema
 */
interface DatabaseFeedbackRow {
  id: string;
  link?: string;
  post_copy?: string;
  date: string;
  time: string;
  date_responses?: string;
  account_id?: string;
  customer_id?: string;
  category: CustomerFeedbackCategory;
  type_of_post: CustomerFeedbackTypeOfPost;
  topic: CustomerFeedbackTopic;
  product?: string;
  sentiment: CustomerFeedbackSentiment;
  source: CustomerFeedbackSource;
  reply?: string;
  status: CustomerFeedbackStatus;
  details?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Transform database row to CustomerFeedback interface
 */
function transformDatabaseRow(row: DatabaseFeedbackRow): CustomerFeedback {
  return {
    ID: row.id,
    Link: row.link || '',
    post_copy: row.post_copy || '',
    date: row.date,
    time: row.time,
    dateResponses: row.date_responses || '',
    accountId: row.account_id || '',
    customerId: row.customer_id || '',
    category: row.category as CustomerFeedbackCategory,
    typeOfPost: row.type_of_post,
    topic: row.topic as CustomerFeedbackTopic,
    product: row.product || '',
    sentiment: row.sentiment as CustomerFeedbackSentiment,
    source: row.source,
    reply: row.reply || '',
    status: row.status,
    details: row.details || ''
  }
}

/**
 * Apply filters to feedback data
 */
function applyFilters(feedbacks: CustomerFeedback[], filters: CustomerFeedbackFilters): CustomerFeedback[] {
  let filtered = [...feedbacks]

  // Apply sentiment filter
  if (filters.sentiment && filters.sentiment !== 'all') {
    filtered = filtered.filter(feedback => 
      feedback.sentiment.toLowerCase() === filters.sentiment!.toLowerCase()
    )
  }

  // Apply topic filter
  if (filters.topic && filters.topic !== 'all') {
    filtered = filtered.filter(feedback => 
      feedback.topic === filters.topic
    )
  }

  // Apply category filter
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(feedback => 
      feedback.category === filters.category
    )
  }

  // Apply search term filter
  if (filters.searchTerm && filters.searchTerm.trim() !== '') {
    const searchLower = filters.searchTerm.toLowerCase()
    filtered = filtered.filter(feedback => 
      feedback.post_copy.toLowerCase().includes(searchLower) ||
      feedback.accountId.toLowerCase().includes(searchLower) ||
      feedback.product.toLowerCase().includes(searchLower) ||
      feedback.reply.toLowerCase().includes(searchLower) ||
      feedback.details.toLowerCase().includes(searchLower)
    )
  }

  return filtered
}

/**
 * Fetch customer feedbacks from Supabase with filtering support
 */
export async function fetchCustomerFeedbacks(
  filters: CustomerFeedbackFilters = {}
): Promise<CustomerFeedbackApiResponse> {
  // Check if Supabase is configured
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured, using sample data')
    const filteredData = applyFilters(sampleCustomerFeedbacks, filters)
    return {
      data: filteredData,
      error: 'Supabase configuration missing. Please check your environment variables.',
      isUsingFallback: true,
      total: filteredData.length
    }
  }

  try {
    // Build the query
    let query = supabase
      .from('customer_feedbacks')
      .select('*')

    // Apply filters at database level for better performance
    if (filters.sentiment && filters.sentiment !== 'all') {
      query = query.ilike('sentiment', filters.sentiment)
    }

    if (filters.topic && filters.topic !== 'all') {
      query = query.eq('topic', filters.topic)
    }

    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category)
    }

    if (filters.searchTerm && filters.searchTerm.trim() !== '') {
      // Use text search for multiple columns
      const searchTerm = filters.searchTerm.trim()
      query = query.or(`post_copy.ilike.%${searchTerm}%,account_id.ilike.%${searchTerm}%,product.ilike.%${searchTerm}%,reply.ilike.%${searchTerm}%,details.ilike.%${searchTerm}%`)
    }

    // Apply pagination if specified
    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1)
    }

    // Order by date descending
    query = query.order('date', { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error('Supabase query error:', error)
      // Return fallback data on database error
      const filteredData = applyFilters(sampleCustomerFeedbacks, filters)
      return {
        data: filteredData,
        error: `Database error: ${error.message}. Using sample data.`,
        isUsingFallback: true,
        total: filteredData.length
      }
    }

    if (!data || data.length === 0) {
      // Return fallback data if no data found
      const filteredData = applyFilters(sampleCustomerFeedbacks, filters)
      return {
        data: filteredData,
        error: 'No data found in database. Using sample data.',
        isUsingFallback: true,
        total: filteredData.length
      }
    }

    // Transform database rows to CustomerFeedback interface
    const transformedData = data.map(transformDatabaseRow)

    return {
      data: transformedData,
      error: null,
      isUsingFallback: false,
      total: transformedData.length
    }

  } catch (error) {
    console.error('Error fetching customer feedbacks:', error)
    // Return fallback data on any error
    const filteredData = applyFilters(sampleCustomerFeedbacks, filters)
    return {
      data: filteredData,
      error: `Failed to fetch data: ${error instanceof Error ? error.message : 'Unknown error'}. Using sample data.`,
      isUsingFallback: true,
      total: filteredData.length
    }
  }
}

/**
 * Get customer feedback statistics
 */
export async function getCustomerFeedbackStats(): Promise<{
  total: number
  positive: number
  negative: number
  neutral: number
  complaints: number
  resolved: number
  isUsingFallback: boolean
  error?: string
}> {
  const { data, error, isUsingFallback } = await fetchCustomerFeedbacks()

  const stats = {
    total: data.length,
    positive: data.filter(f => f.sentiment === 'Positive').length,
    negative: data.filter(f => f.sentiment === 'Negative').length,
    neutral: data.filter(f => f.sentiment === 'Neutral').length,
    complaints: data.filter(f => f.typeOfPost === 'Complaint').length,
    resolved: data.filter(f => f.status === 'Clear').length,
    isUsingFallback,
    error: error || undefined
  }

  return stats
}

/**
 * Get unique values for filter options
 */
export async function getFilterOptions(): Promise<{
  sentiments: string[]
  topics: string[]
  categories: string[]
  products: string[]
  isUsingFallback: boolean
}> {
  const { data, isUsingFallback } = await fetchCustomerFeedbacks()

  const sentiments = [...new Set(data.map(f => f.sentiment))].sort()
  const topics = [...new Set(data.map(f => f.topic))].sort()
  const categories = [...new Set(data.map(f => f.category))].sort()
  const products = [...new Set(data.map(f => f.product))].filter(p => p.trim() !== '').sort()

  return {
    sentiments,
    topics,
    categories,
    products,
    isUsingFallback
  }
}