# Database Migrations

This directory contains SQL migration scripts for the database schema.

## Migration 001: Customer Feedback Topics Many-to-Many

**File:** `001_customer_feedback_topics_many_to_many.sql`

### Purpose
Converts the customer feedback topic relationship from a simple text field to a proper many-to-many relationship, allowing each feedback to be associated with multiple topics.

### What This Migration Does

1. **Creates the `topics` table** with:
   - `id` (UUID primary key)
   - `name` (unique text, required)
   - `category` (optional text for grouping topics)
   - Timestamps (`created_at`, `updated_at`)

2. **Creates the `customer_feedback_topic` pivot table** with:
   - `id` (UUID primary key)
   - `customer_feedback_id` (foreign key to customer_feedbacks)
   - `topic_id` (foreign key to topics)
   - `assigned_at` timestamp
   - Unique constraint on (customer_feedback_id, topic_id) to prevent duplicates

3. **Migrates existing data**:
   - Extracts unique topic values from `customer_feedbacks.topic` column
   - Creates topic records in the `topics` table
   - Creates relationships in the `customer_feedback_topic` pivot table

4. **Creates helpful views**:
   - `customer_feedbacks_with_topics`: Shows feedbacks with their associated topics as arrays
   - `topic_statistics`: Provides analytics on topics (feedback count, sentiment breakdown, etc.)

### How to Run

#### Option 1: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `001_customer_feedback_topics_many_to_many.sql`
4. Click **Run**

#### Option 2: Using psql
```bash
psql -h <your-host> -U <your-user> -d <your-database> -f migrations/001_customer_feedback_topics_many_to_many.sql
```

### Important Notes

⚠️ **The migration does NOT automatically drop the old `topic` column** from `customer_feedbacks`. This is intentional to allow for:
- Gradual migration testing
- Rollback capability if needed
- Verification that the new structure works correctly

When you're confident the new structure is working:
1. Uncomment the line in the migration:
   ```sql
   alter table customer_feedbacks drop column if exists topic;
   ```
2. Run this ALTER statement separately

### Benefits of This Approach

1. **Multiple Topics per Feedback**: A single customer feedback can now be tagged with multiple topics
2. **Centralized Topic Management**: Topics are defined once and reused across all feedbacks
3. **Better Analytics**: The `topic_statistics` view provides instant insights into topic performance
4. **Data Integrity**: Foreign key constraints ensure data consistency
5. **Performance**: Proper indexes on the pivot table ensure fast queries

### Example Queries

#### Get all feedbacks for a specific topic:
```sql
SELECT cf.* 
FROM customer_feedbacks cf
JOIN customer_feedback_topic cft ON cf.id = cft.customer_feedback_id
JOIN topics t ON cft.topic_id = t.id
WHERE t.name = 'Product Info';
```

#### Get all topics for a specific feedback:
```sql
SELECT t.* 
FROM topics t
JOIN customer_feedback_topic cft ON t.id = cft.topic_id
WHERE cft.customer_feedback_id = '<feedback-uuid>';
```

#### Use the view to get feedbacks with topics:
```sql
SELECT * FROM customer_feedbacks_with_topics
WHERE 'Product Info' = ANY(topics);
```

#### Get topic statistics:
```sql
SELECT * FROM topic_statistics
ORDER BY feedback_count DESC
LIMIT 10;
```

### Rollback

If you need to rollback this migration:

```sql
-- Drop the views
DROP VIEW IF EXISTS customer_feedbacks_with_topics;
DROP VIEW IF EXISTS topic_statistics;

-- Drop the pivot table
DROP TABLE IF EXISTS customer_feedback_topic;

-- Drop the topics table
DROP TABLE IF EXISTS topics;

-- The old topic column in customer_feedbacks should still be intact
```

