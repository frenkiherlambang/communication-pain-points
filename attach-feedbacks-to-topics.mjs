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
  console.log('❌ Could not load .env.local file');
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Supabase credentials not found');
  process.exit(1);
}

console.log('🔗 Attaching Customer Feedbacks to Topics\n');

const supabase = createClient(supabaseUrl, supabaseKey);

async function attachFeedbacksToTopics() {
  try {
    // Step 1: Get all topics
    console.log('📋 Fetching all topics...');
    const { data: topics, error: topicsError } = await supabase
      .from('topics')
      .select('*');
    
    if (topicsError) {
      throw new Error(`Failed to fetch topics: ${topicsError.message}`);
    }
    
    console.log(`✅ Found ${topics.length} topics:\n`);
    topics.forEach(topic => console.log(`   - ${topic.name} (${topic.id})`));
    console.log();
    
    // Create a map of topic names to IDs for quick lookup
    const topicNameToId = {};
    topics.forEach(topic => {
      topicNameToId[topic.name] = topic.id;
    });
    
    // Step 2: Get all customer feedbacks with topics
    console.log('📊 Fetching customer feedbacks with topics...');
    const { data: feedbacks, error: feedbacksError } = await supabase
      .from('customer_feedbacks')
      .select('ID, topic, account_id')
      .not('topic', 'is', null)
      .neq('topic', '');
    
    if (feedbacksError) {
      throw new Error(`Failed to fetch feedbacks: ${feedbacksError.message}`);
    }
    
    console.log(`✅ Found ${feedbacks.length} customer feedbacks with topics\n`);
    
    // Step 3: Create relationships
    console.log('🔗 Creating relationships...\n');
    
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    
    for (const feedback of feedbacks) {
      const feedbackId = feedback.ID; // Use uppercase ID
      const topicId = topicNameToId[feedback.topic];
      
      if (!topicId) {
        console.log(`⚠️  Skipping feedback ${feedbackId}: topic "${feedback.topic}" not found in topics table`);
        skipCount++;
        continue;
      }
      
      // Check if relationship already exists
      const { data: existing } = await supabase
        .from('customer_feedback_topic')
        .select('id')
        .eq('customer_feedback_id', feedbackId)
        .eq('topic_id', topicId)
        .single();
      
      if (existing) {
        skipCount++;
        continue;
      }
      
      // Create the relationship
      const { error: insertError } = await supabase
        .from('customer_feedback_topic')
        .insert({
          customer_feedback_id: feedbackId,
          topic_id: topicId
        });
      
      if (insertError) {
        console.log(`❌ Error linking feedback ${feedbackId} to topic ${feedback.topic}: ${insertError.message}`);
        errorCount++;
      } else {
        successCount++;
        if (successCount % 10 === 0) {
          process.stdout.write(`✅ ${successCount}/${feedbacks.length} relationships created...\r`);
        }
      }
    }
    
    console.log('\n');
    console.log('───────────────────────────────────────────────────────');
    console.log('📊 RESULTS:\n');
    console.log(`✅ Successfully created: ${successCount} relationships`);
    console.log(`⏭️  Skipped (already exist or no matching topic): ${skipCount}`);
    console.log(`❌ Errors: ${errorCount}\n`);
    console.log('───────────────────────────────────────────────────────\n');
    
    // Step 4: Verify the results
    console.log('🔍 Verifying results...\n');
    
    const { count } = await supabase
      .from('customer_feedback_topic')
      .select('*', { count: 'exact', head: true });
    
    console.log(`📈 Total relationships in database: ${count}`);
    
    // Show a sample of feedbacks with their topics using the view
    console.log('\n📋 Sample feedbacks with topics:\n');
    const { data: sampleFeedbacks, error: viewError } = await supabase
      .from('customer_feedbacks_with_topics')
      .select('ID, account_id, topics, post_copy')
      .limit(5);
    
    if (viewError) {
      console.log(`⚠️  Could not query view: ${viewError.message}`);
    } else if (sampleFeedbacks) {
      sampleFeedbacks.forEach((fb, idx) => {
        console.log(`${idx + 1}. Account: ${fb.account_id}`);
        console.log(`   Topics: ${fb.topics ? fb.topics.join(', ') : 'none'}`);
        console.log(`   Text: ${fb.post_copy?.substring(0, 80)}...`);
        console.log();
      });
    }
    
    console.log('✨ Done! All customer feedbacks have been attached to topics.\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

attachFeedbacksToTopics();

