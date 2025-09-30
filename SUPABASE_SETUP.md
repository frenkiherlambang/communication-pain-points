# Supabase Setup Instructions

## Issue Summary
The `net::ERR_ABORTED` error occurs because:
1. The `customer_feedbacks` table exists but has a different schema than expected
2. Row Level Security (RLS) policies are blocking anonymous access
3. The table may be empty or have incorrect column names

## Solution Steps

### 1. Access Your Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Navigate to your project: `hgqulhladggcelpdpxpr`
3. Go to the **SQL Editor** tab

### 2. Create/Update the Customer Feedbacks Table

Run the following SQL in the Supabase SQL Editor:

```sql
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
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

### 3. Set Up Row Level Security (RLS) Policies

```sql
-- Enable RLS on the table
ALTER TABLE customer_feedbacks ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to read all records
CREATE POLICY "Allow anonymous read access" ON customer_feedbacks
    FOR SELECT
    TO anon
    USING (true);

-- Allow anonymous users to insert records
CREATE POLICY "Allow anonymous insert access" ON customer_feedbacks
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Allow anonymous users to update records
CREATE POLICY "Allow anonymous update access" ON customer_feedbacks
    FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);

-- Allow anonymous users to delete records
CREATE POLICY "Allow anonymous delete access" ON customer_feedbacks
    FOR DELETE
    TO anon
    USING (true);
```

### 4. Insert Sample Data (Optional)

```sql
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
```

### 5. Verify the Setup

After running the SQL commands, test the connection by visiting:
`http://localhost:3000/api/test-supabase`

You should see:
- `success: true`
- `tableExists: true`
- `recordCount: 3` (if you inserted sample data)
- `insertTest.success: true`

### 6. Test the Customer Feedbacks Page

Visit `http://localhost:3000/customer-feedbacks` to see the page working with real Supabase data instead of fallback sample data.

## Troubleshooting

### If you still see errors:

1. **Check your Supabase project URL**: Ensure `NEXT_PUBLIC_SUPABASE_URL` in `.env.local` matches your project URL
2. **Verify API key**: Ensure `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
3. **Restart the development server**: Run `npm run dev` after making changes
4. **Check Supabase logs**: Go to Supabase Dashboard > Logs to see any database errors

### Common Issues:

- **"Table doesn't exist"**: Make sure you ran the CREATE TABLE command
- **"RLS policy violation"**: Ensure you created the RLS policies for anonymous access
- **"Column not found"**: The table schema doesn't match - drop and recreate the table
- **Empty data**: The table exists but has no records - insert sample data or check your queries

## Environment Variables

Your `.env.local` should contain:
```
NEXT_PUBLIC_SUPABASE_URL=https://hgqulhladggcelpdpxpr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anonymous_key_here
```

## Next Steps

Once the table is set up correctly:
1. The customer feedbacks page will load real data from Supabase
2. You can add, edit, and delete customer feedback records
3. The API will no longer fall back to sample data
4. All CRUD operations will work properly