// Test script for dashboard metrics
// This script tests the dashboard metrics functions to ensure they work with Supabase

const { getDashboardMetrics, calculateOverallSentimentScore, calculateActivePainPoints } = require('./lib/dashboard-metrics.ts');

async function testDashboardMetrics() {
  console.log('Testing Dashboard Metrics Functions...\n');

  try {
    // Test individual functions
    console.log('1. Testing calculateOverallSentimentScore...');
    const sentimentResult = await calculateOverallSentimentScore();
    console.log('Sentiment Result:', sentimentResult);
    console.log('✓ Sentiment calculation completed\n');

    console.log('2. Testing calculateActivePainPoints...');
    const painPoints = await calculateActivePainPoints();
    console.log('Pain Points:', painPoints);
    console.log('✓ Pain points calculation completed\n');

    console.log('3. Testing getDashboardMetrics (all metrics)...');
    const allMetrics = await getDashboardMetrics();
    console.log('All Metrics:', JSON.stringify(allMetrics, null, 2));
    console.log('✓ All metrics calculation completed\n');

    // Check for fallback usage
    if (allMetrics.isUsingFallback) {
      console.log('⚠️  Using fallback data due to database issues:');
      if (allMetrics.errors) {
        allMetrics.errors.forEach(error => console.log(`   - ${error}`));
      }
    } else {
      console.log('✅ Successfully connected to Supabase database');
    }

  } catch (error) {
    console.error('❌ Error testing dashboard metrics:', error);
  }
}

// Run the test
testDashboardMetrics();