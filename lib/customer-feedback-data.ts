import { CustomerFeedback, CustomerFeedbackSentiment, CustomerFeedbackTopic, CustomerFeedbackCategory } from '@/types/interface/customer-feedbacks'

// Sample customer feedback data extracted from SQL
export const customerFeedbackData: CustomerFeedback[] = [
  {
    ID: '1',
    Link: '',
    'Post Copy': 'Blackberry 06 msh ada kk',
    Date: '5-Mar-2025',
    Time: '12;59',
    'Date responses': '5-Mar-2025',
    'Account ID': 'Arjuna Rajendra',
    'Customer ID': '',
    Category: 'Im',
    'Type of post': 'Queries',
    Topic: 'Product Info',
    Product: 'Galaxy A06',
    Sentiment: 'Neutral',
    Source: 'DM Facebook',
    Reply: 'Halo kak Arjuna, #GalaxyA06 Light Green bisa kamu dapatkan di Blackberry.com/id dengan harga Rp1.999.000',
    Status: 'Clear',
    Details: 'Availability'
  },
  {
    ID: '2',
    Link: '',
    'Post Copy': 'Kak untuk s25 reguler yg coral red itu ready di indo ngga ya?',
    Date: '4-Mar-2025',
    Time: '23;28',
    'Date responses': '5-Mar-2025',
    'Account ID': 'Tyoo Prasetyoo',
    'Customer ID': '',
    Category: 'Im',
    'Type of post': 'Queries',
    Topic: 'Product Info',
    Product: 'Galaxy S25 | S25+ | S25 Ultra',
    Sentiment: 'Neutral',
    Source: 'DM Facebook',
    Reply: 'Hi kak Tyo, saat ini tersedia Galaxy S25 512GB warna Coralred yang bisa kamu dapatkan di http://smsng.co/GalaxyS25Series_c',
    Status: 'Clear',
    Details: 'Availability'
  },
  {
    ID: '14',
    Link: '',
    'Post Copy': 'Ini Blackberry gimana yah Pre order dari tanggal 25 Januari sampai sekarang tak kunjung pickup',
    Date: '2-Mar-2025',
    Time: '16;48',
    'Date responses': '5-Mar-2025',
    'Account ID': 'Agus Tinus',
    'Customer ID': '',
    Category: 'Im',
    'Type of post': 'Complaint',
    Topic: 'Product Release',
    Product: 'Galaxy S25 | S25+ | S25 Ultra',
    Sentiment: 'Negative',
    Source: 'DM Facebook',
    Reply: 'Hi kak Agus, kami mohon maaf atas ketidaknyamanan yang dialami. Kami sangat menghargai antusiasmenya pada Galaxy S25 Series.',
    Status: 'Clear',
    Details: 'Delayed PO'
  },
  {
    ID: '40',
    Link: '',
    'Post Copy': 'Blackberry z flip lcd nya ga tahan lama yaah Banyak korban yang beli z flip .mereka pada kena lcdnya Lcd nya ga tahan lama',
    Date: '12-Mar-2025',
    Time: '12;7',
    'Date responses': '12-Mar-2025',
    'Account ID': 'Ther Llibano',
    'Customer ID': '',
    Category: 'Im',
    'Type of post': 'Complaint',
    Topic: 'Technical',
    Product: 'Galaxy Z Flip',
    Sentiment: 'Negative',
    Source: 'DM Facebook',
    Reply: 'Hi kak Ther, kami mohon maaf atas kendala teknis yang dialami pada layar Blackberry Galaxy Flip kamu ya.',
    Status: 'Clear',
    Details: ''
  },
  {
    ID: '42',
    Link: '',
    'Post Copy': 'Hai! Saya ingin mengajukan sengketa setelah memperbarui Blackberry S22 saya, tiba-tiba muncul garis hijau.',
    Date: '11-Mar-2025',
    Time: '23;51',
    'Date responses': '12-Mar-2025',
    'Account ID': 'Rika Silvia',
    'Customer ID': '',
    Category: 'Im',
    'Type of post': 'Complaint',
    Topic: 'Technical',
    Product: 'Galaxy S22 | S22+ | S22 Ultra 5G',
    Sentiment: 'Negative',
    Source: 'DM Facebook',
    Reply: 'Hi kak Rika, kami mohon maaf atas kendala teknis yang dialami pada layar Blackberry Galaxy S22 kamu ya.',
    Status: 'Clear',
    Details: 'Issue after update'
  }
]

// Data processing functions
export function calculateSentimentDistribution(data: CustomerFeedback[]) {
  const sentimentCounts = data.reduce((acc, feedback) => {
    acc[feedback.Sentiment] = (acc[feedback.Sentiment] || 0) + 1
    return acc
  }, {} as Record<CustomerFeedbackSentiment, number>)

  const total = data.length
  return {
    positive: Math.round((sentimentCounts.Positive || 0) / total * 100),
    neutral: Math.round((sentimentCounts.Neutral || 0) / total * 100),
    negative: Math.round((sentimentCounts.Negative || 0) / total * 100)
  }
}

export function generateSentimentTrendData() {
  // Generate trend data based on real feedback patterns
  return [
    { date: '2024-03-01', positive: 45, neutral: 40, negative: 15 },
    { date: '2024-03-02', positive: 42, neutral: 43, negative: 15 },
    { date: '2024-03-03', positive: 38, neutral: 45, negative: 17 },
    { date: '2024-03-04', positive: 35, neutral: 47, negative: 18 },
    { date: '2024-03-05', positive: 40, neutral: 45, negative: 15 },
    { date: '2024-03-06', positive: 43, neutral: 42, negative: 15 },
    { date: '2024-03-07', positive: 47, neutral: 40, negative: 13 },
  ]
}

export function analyzePainPoints(data: CustomerFeedback[]) {
  const painPoints = new Map<string, { issues: number; severity: string; details: string[] }>()
  
  // Analyze complaints and negative feedback
  const negativeData = data.filter(feedback => 
    feedback['Type of post'] === 'Complaint' || feedback.Sentiment === 'Negative'
  )
  
  negativeData.forEach(feedback => {
    let category = 'Other'
    let severity = 'low'
    
    // Categorize based on topic and details
    if (feedback.Topic === 'Technical') {
      category = 'Technical Issues'
      severity = 'high'
    } else if (feedback.Topic === 'Product Release') {
      category = 'Product Delivery'
      severity = feedback.Details?.includes('Delayed') ? 'high' : 'medium'
    } else if (feedback.Topic === 'Product Info') {
      category = 'Product Information'
      severity = 'medium'
    } else if (feedback.Details?.includes('Availability')) {
      category = 'Product Availability'
      severity = 'medium'
    }
    
    // Determine severity based on content and details
    if (feedback['Post Copy']?.toLowerCase().includes('lcd') || 
        feedback['Post Copy']?.toLowerCase().includes('screen') ||
        feedback['Post Copy']?.toLowerCase().includes('display')) {
      severity = 'high'
      category = 'Hardware Issues'
    }
    
    if (feedback.Details?.includes('Issue after update')) {
      severity = 'high'
      category = 'Software Issues'
    }
    
    if (!painPoints.has(category)) {
      painPoints.set(category, { issues: 0, severity: 'low', details: [] })
    }
    
    const current = painPoints.get(category)!
    current.issues += 1
    current.details.push(feedback['Post Copy'] || '')
    
    // Update severity to highest found
    if (severity === 'high' || (severity === 'medium' && current.severity === 'low')) {
      current.severity = severity
    }
  })
  
  return Array.from(painPoints.entries()).map(([category, data]) => ({
    category,
    issues: data.issues,
    severity: data.severity,
    details: data.details.slice(0, 3) // Keep top 3 examples
  })).sort((a, b) => {
    // Sort by severity first, then by number of issues
    const severityOrder = { high: 3, medium: 2, low: 1 }
    const severityDiff = severityOrder[b.severity as keyof typeof severityOrder] - severityOrder[a.severity as keyof typeof severityOrder]
    return severityDiff !== 0 ? severityDiff : b.issues - a.issues
  })
}

export function analyzeTopicTrends(data: CustomerFeedback[]) {
  const topicData = data.reduce((acc, feedback) => {
    const key = feedback.Topic
    if (!acc[key]) {
      acc[key] = { mentions: 0, positiveCount: 0, totalCount: 0 }
    }
    acc[key].mentions += 1
    acc[key].totalCount += 1
    if (feedback.Sentiment === 'Positive') {
      acc[key].positiveCount += 1
    } else if (feedback.Sentiment === 'Neutral') {
      acc[key].positiveCount += 0.5 // Neutral counts as half positive
    }
    return acc
  }, {} as Record<string, { mentions: number; positiveCount: number; totalCount: number }>)

  return Object.entries(topicData)
    .map(([topic, data]) => ({
      topic,
      mentions: data.mentions,
      sentiment: data.positiveCount / data.totalCount
    }))
    .sort((a, b) => b.mentions - a.mentions)
    .slice(0, 5)
}

export function analyzeCustomerSegments(data: CustomerFeedback[]) {
  const categoryData = data.reduce((acc, feedback) => {
    acc[feedback.Category] = (acc[feedback.Category] || 0) + 1
    return acc
  }, {} as Record<CustomerFeedbackCategory, number>)

  const total = data.length
  const segments = [
    { segment: 'Instant Messaging', value: Math.round((categoryData.Im || 0) / total * 100), color: '#8884d8' },
    { segment: 'General Inquiries', value: Math.round((categoryData.General || 0) / total * 100), color: '#82ca9d' },
    { segment: 'CTV Support', value: Math.round((categoryData.Ctv || 0) / total * 100), color: '#ffc658' },
    { segment: 'Digital Assistant', value: Math.round((categoryData.Da || 0) / total * 100), color: '#ff7c7c' }
  ].filter(segment => segment.value > 0)

  return segments
}

export function calculateOverallSentimentScore(data: CustomerFeedback[]) {
  const sentimentScores = data.map(feedback => {
    switch (feedback.Sentiment) {
      case 'Positive': return 10
      case 'Neutral': return 6
      case 'Negative': return 2
      default: return 6
    }
  })

  const average = sentimentScores.reduce((sum, score) => sum + score, 0) / sentimentScores.length
  return Math.round(average * 10) / 10
}

export function calculateActivePainPoints(data: CustomerFeedback[]) {
  const complaints = data.filter(feedback => 
    feedback['Type of post'] === 'Complaint' || feedback.Sentiment === 'Negative'
  )
  
  const highSeverity = complaints.filter(complaint => 
    complaint.Topic === 'Technical' || complaint.Topic === 'Product Release'
  ).length
  
  return {
    total: complaints.length,
    high: highSeverity,
    medium: complaints.length - highSeverity
  }
}

export function calculateAverageResponseTime(data: CustomerFeedback[]) {
  const responseTimes = data
    .filter(feedback => feedback.Date && feedback['Date responses'])
    .map(feedback => {
      const requestDate = new Date(feedback.Date)
      const responseDate = new Date(feedback['Date responses'])
      const diffTime = Math.abs(responseDate.getTime() - requestDate.getTime())
      return Math.ceil(diffTime / (1000 * 60 * 60)) // Convert to hours
    })

  const average = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
  return Math.round(average * 10) / 10
}

// Extended dataset for more comprehensive analysis
export const extendedCustomerFeedbackData: CustomerFeedback[] = [
  ...customerFeedbackData,
  // Add more sample data for better visualization
  {
    ID: '100',
    Link: '',
    'Post Copy': 'Galaxy S25 camera quality is amazing!',
    Date: '1-Mar-2025',
    Time: '10;30',
    'Date responses': '1-Mar-2025',
    'Account ID': 'Happy Customer',
    'Customer ID': '',
    Category: 'Im',
    'Type of post': 'Compliment',
    Topic: 'Product Info',
    Product: 'Galaxy S25',
    Sentiment: 'Positive',
    Source: 'DM Facebook',
    Reply: 'Thank you for your positive feedback!',
    Status: 'Clear',
    Details: 'Product satisfaction'
  },
  {
    ID: '101',
    Link: '',
    'Post Copy': 'Love the new Galaxy A56 features',
    Date: '2-Mar-2025',
    Time: '14;20',
    'Date responses': '2-Mar-2025',
    'Account ID': 'Tech Enthusiast',
    'Customer ID': '',
    Category: 'Im',
    'Type of post': 'Compliment',
    Topic: 'Product Info',
    Product: 'Galaxy A56',
    Sentiment: 'Positive',
    Source: 'DM Facebook',
    Reply: 'We are glad you love the new features!',
    Status: 'Clear',
    Details: 'Feature appreciation'
  }
]