import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
const envPath = join(__dirname, '.env.local');
try {
  const envContent = readFileSync(envPath, 'utf8');
  const envLines = envContent.split('\n');
  
  envLines.forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
} catch (error) {
  console.log('Could not load .env.local file');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🚀 Setting up Supabase table...');
console.log('URL:', supabaseUrl);
console.log('Has Key:', !!supabaseKey);

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupTable() {
  try {
    console.log('\n🗑️ Dropping existing table if it exists...');
    
    // Note: We can't drop tables via the client, but we can check if it needs to be recreated
    // The user will need to run the SQL commands in Supabase dashboard
    
    console.log('\n📋 Table creation SQL needed:');
    console.log(`
-- Drop existing table if it has wrong schema
DROP TABLE IF EXISTS customer_feedbacks;

-- Create the customer_feedbacks table with correct schema
CREATE TABLE customer_feedbacks (
    id SERIAL PRIMARY KEY,
    link TEXT,
    post_copy TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    account_id TEXT,
    category TEXT CHECK (category IN ('General', 'Product', 'Service', 'Technical', 'Billing')),
    type_of_post TEXT CHECK (type_of_post IN ('Review', 'Complaint', 'Question', 'Compliment', 'Others')),
    topic TEXT CHECK (topic IN ('Product Info', 'Pricing', 'Support', 'Features', 'Bug Report', 'General Inquiry')),
    product TEXT,
    sentiment TEXT CHECK (sentiment IN ('Positive', 'Negative', 'Neutral')) NOT NULL,
    source TEXT CHECK (source IN ('DM Facebook', 'DM Instagram', 'Comment Facebook', 'Comment Instagram', 'Email', 'Phone', 'Chat', 'Others')),
    reply TEXT,
    status TEXT CHECK (status IN ('Pending', 'In Progress', 'Resolved', 'Closed')) DEFAULT 'Pending',
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_customer_feedbacks_date ON customer_feedbacks(date);
CREATE INDEX idx_customer_feedbacks_sentiment ON customer_feedbacks(sentiment);
CREATE INDEX idx_customer_feedbacks_status ON customer_feedbacks(status);
CREATE INDEX idx_customer_feedbacks_category ON customer_feedbacks(category);
CREATE INDEX idx_customer_feedbacks_topic ON customer_feedbacks(topic);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customer_feedbacks_updated_at 
    BEFORE UPDATE ON customer_feedbacks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE customer_feedbacks ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access (for development)
CREATE POLICY "Allow anonymous read access" ON customer_feedbacks
    FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert access" ON customer_feedbacks
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous update access" ON customer_feedbacks
    FOR UPDATE USING (true);

CREATE POLICY "Allow anonymous delete access" ON customer_feedbacks
    FOR DELETE USING (true);
`);

    console.log('\n📝 Sample data insertion SQL:');
    console.log(`
-- Insert sample data for testing
INSERT INTO customer_feedbacks (
    link, post_copy, date, time, account_id, category, type_of_post, 
    topic, product, sentiment, source, reply, status, details
) VALUES 
(
    'https://facebook.com/post1',
    'Love the new features in your app! The interface is so much cleaner now.',
    '2024-01-15',
    '10:30:00',
    'user123',
    'Product',
    'Compliment',
    'Features',
    'Mobile App',
    'Positive',
    'Comment Facebook',
    'Thank you for your feedback! We''re glad you''re enjoying the new features.',
    'Resolved',
    'Customer praised the new UI design and improved user experience.'
),
(
    'https://instagram.com/post2',
    'Having trouble with the checkout process. It keeps freezing on the payment page.',
    '2024-01-14',
    '14:45:00',
    'user456',
    'Technical',
    'Complaint',
    'Bug Report',
    'Website',
    'Negative',
    'DM Instagram',
    'We''re sorry to hear about this issue. Our team is investigating the checkout problem.',
    'In Progress',
    'Technical issue with payment gateway integration causing checkout failures.'
),
(
    'https://facebook.com/post3',
    'What are your business hours? I need to contact support.',
    '2024-01-13',
    '09:15:00',
    'user789',
    'General',
    'Question',
    'General Inquiry',
    'Support',
    'Neutral',
    'Comment Facebook',
    'Our support team is available Monday-Friday 9AM-6PM EST. You can reach us at support@company.com',
    'Resolved',
    'Customer inquiry about business hours and contact information.'
) ON CONFLICT (id) DO NOTHING;
`);

    console.log('\n⚠️ IMPORTANT: You need to run the above SQL commands in your Supabase dashboard:');
    console.log('1. Go to https://supabase.com/dashboard');
    console.log('2. Select your project');
    console.log('3. Go to SQL Editor');
    console.log('4. Copy and paste the table creation SQL above');
    console.log('5. Run the SQL');
    console.log('6. Then copy and paste the sample data SQL');
    console.log('7. Run the sample data SQL');
    
    console.log('\n🔄 After running the SQL, this script will test the connection...');
    
    // Wait for user to set up the table
    console.log('\n⏳ Waiting 10 seconds for you to run the SQL commands...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    console.log('\n🧪 Testing connection after setup...');
    
    // Test the connection
    const { count, error: countError } = await supabase
      .from('customer_feedbacks')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.log('❌ Table still not accessible:', countError.message);
      console.log('Please make sure you ran the SQL commands in Supabase dashboard');
      return;
    }

    console.log('✅ Table accessible with', count, 'records');

    // Test insert
    const { data: insertData, error: insertError } = await supabase
      .from('customer_feedbacks')
      .insert({
        post_copy: 'Test post from script',
        date: '2024-01-16',
        time: '15:30:00',
        sentiment: 'Neutral'
      })
      .select();

    if (insertError) {
      console.log('❌ Insert test failed:', insertError.message);
    } else {
      console.log('✅ Insert test successful!');
      
      // Clean up test record
      if (insertData?.[0]?.id) {
        await supabase
          .from('customer_feedbacks')
          .delete()
          .eq('id', insertData[0].id);
        console.log('🧹 Cleaned up test record');
      }
    }

    // Test our dashboard functions
    console.log('\n📊 Testing dashboard functions...');
    
    const { count: totalCount } = await supabase
      .from('customer_feedbacks')
      .select('*', { count: 'exact', head: true });
    
    console.log('Total feedback count:', totalCount);

    const { data: sentimentData } = await supabase
      .from('customer_feedbacks')
      .select('sentiment');
    
    console.log('Sentiment data available:', sentimentData?.length || 0, 'records');

    console.log('\n🎉 Setup complete! Your dashboard-metrics.ts should now work properly.');

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

setupTable();