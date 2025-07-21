const fs = require('fs').promises;
const path = require('path');

/**
 * ==============================================================================
 * "GPT-Powered" Weekly Analytics Report Generator
 * ==============================================================================
 *
 * This script simulates a GPT-powered analysis by reading data from various
 * mock sources and compiling it into a comprehensive, human-readable
 * weekly report in Markdown format.
 *
 * How it works:
 * 1.  Reads the mock JSON data for Google Analytics, Render logs, and monetization.
 * 2.  Generates a Markdown-formatted report summarizing the key insights.
 * 3.  Writes the report to a file named `weekly-analytics-report.md`.
 *
 * In a real-world scenario, this script would be modified to:
 * - Fetch data directly from service APIs (Google Analytics, Stripe, Render).
 * - Potentially send the structured data to a real GPT API for a more
 *   nuanced, natural-language summary.
 *
 * ==============================================================================
 */

async function generateReport() {
  try {
    // 1. Read all data sources
    const gaData = JSON.parse(await fs.readFile(path.join(__dirname, 'mock-ga-data.json'), 'utf8'));
    const renderData = JSON.parse(await fs.readFile(path.join(__dirname, 'mock-render-logs.json'), 'utf8'));
    const monetizationData = JSON.parse(await fs.readFile(path.join(__dirname, 'mock-monetization-data.json'), 'utf8'));

    // 2. "AI" generates the report content
    const reportContent = `
# 📈 Weekly Analytics Report: ${new Date().toLocaleDateString()}

## executive Summary
This week saw strong player engagement with **${gaData.weeklyUsers}** active users. Monetization is healthy, driven by the introductory package, but server error rates are slightly elevated and require monitoring. The daily puzzle remains the most popular feature.

---

## 🙋‍♂️ Player Engagement (Google Analytics)

- **Weekly Active Users**: ${gaData.weeklyUsers}
- **Average Session Duration**: ${gaData.avgSessionDuration}

### User Retention
- **Week 1**: ${gaData.userRetention.week1}
- **Week 2**: ${gaData.userRetention.week2}
- **Week 3**: ${gaData.userRetention.week3}

### Popular Content
- **Most Visited Page**: "${gaData.topPages[0].page}" (${gaData.topPages[0].views} views)
- **Most Played Puzzle Type**: ${gaData.popularPuzzles[0].type} (${gaData.popularPuzzles[0].plays} plays)

---

## 💰 Monetization Performance (Stripe)

- **Weekly Revenue**: $${monetizationData.weeklyRevenue.toFixed(2)}
- **New Subscriptions / Purchases**: ${monetizationData.newSubscriptions}
- **Purchase Conversion Rate**: ${monetizationData.conversionRate}
- **Most Popular Package**: "${monetizationData.topPackages[0].package}" (${monetizationData.topPackages[0].purchases} purchases)

---

## ⚙️ System Health (Render Logs)

- **Total API Requests**: ${renderData.totalRequests.toLocaleString()}
- **API Error Rate**: **${renderData.errorRate}**
- **Slowest Endpoint**: \`${renderData.apiPerformance[2].post}\` (${renderData.apiPerformance[2].avgResponseTime})

### Top 3 Errors
1.  **${renderData.topErrors[0].error}** (${renderData.topErrors[0].count} occurrences)
2.  **${renderData.topErrors[1].error}** (${renderData.topErrors[1].count} occurrences)
3.  **${renderData.topErrors[2].error}** (${renderData.topErrors[2].count} occurrences)

---
*This report was automatically generated. For detailed data, please consult the respective service dashboards.*
`;

    // 3. Write the report to a Markdown file
    const reportPath = path.join(__dirname, 'weekly-analytics-report.md');
    await fs.writeFile(reportPath, reportContent.trim());
    console.log(`Successfully generated analytics report at ${reportPath}`);

  } catch (error) {
    console.error('Error generating analytics report:', error);
    process.exit(1);
  }
}

generateReport(); 