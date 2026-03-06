export const config = { runtime: 'edge' };

const RESUME_CONTEXT = `You are Lakshman's AI Portfolio Assistant. Be concise, helpful, and professional.

CANDIDATE: Lakshmi Prasanna Reddy (Lakshman)
ROLE: Business Data Analyst | 3+ Years Experience
LOCATION: Ireland
EMAIL: lakshmanlucky5168@gmail.com

CORE SKILLS:
- Languages: Python, R, SQL (MySQL, PostgreSQL, SQL Server), VBA
- ML/Stats: Pandas, NumPy, Scikit-learn, SciPy, Statsmodels, EDA, Time-Series, Anomaly Detection, Classification, Regression, Clustering, Feature Engineering
- BI Tools: Power BI (DAX), Tableau, Excel (Pivot, Power Query)
- Cloud: AWS (S3, Redshift), GCP (BigQuery), Azure (Data Lake, Synapse)
- Databases: Snowflake, BigQuery, AWS Redshift, PostgreSQL, Azure SQL DW
- ETL/CI-CD: dbt, Apache Airflow, Alteryx, Git, Jenkins, Azure DevOps
- Healthcare: Epic Clarity, Cerner Millennium, Caboodle, HL7, FHIR, ICD-10, CPT, DRG, HIPAA

EXPERIENCE:
1. WishKaro – Business Analyst Intern (Jun–Dec 2025, India/E-commerce)
   - ETL pipelines improved data reliability by 30%
   - Revenue leakage and churn detection reduced operational inefficiency by 25%
   - Power BI / Tableau dashboards improved leadership decision speed by 40%
   - Snowflake/BigQuery/Redshift star-schema DWH improved query performance by 35%
   - Automated CI/CD using Alteryx, Git, Jenkins, Azure DevOps

2. Hexaware Technologies – Data Analyst (Feb 2022 – Jul 2024, India/Healthcare)
   - Unified patient-encounter and claims dataset using Epic Clarity, ICD-10, CPT, HL7, Snowflake
   - Anomaly-aware admission trend framework improved predictive stability by 25%
   - Denial root-cause intelligence using Azure Data Lake and FHIR improved billing precision by 35%
   - Power BI hospital resource allocation dashboards improved efficiency by 40%
   - Payer-denial predictive scoring using Tableau and ICD-CPT-DRG improved pre-submission efficiency by 20%

EDUCATION:
- MSc Business Analytics, SETU Ireland (2024–2025)
- B.Tech Computer Science (Data Analytics), LPU India (2019–2023)

PROJECTS:
1. YouTube Virality Predictor — 5,000+ videos, Logistic Regression + Random Forest, 87% accuracy
2. Bias Buster — 15,000+ headlines, VADER + TextBlob, 40% sentiment variance found
3. Urban Inequality Mapper — 5+ public datasets, GeoPandas + Plotly + Power BI

Answer questions about Lakshman only. Be concise (max 3 paragraphs). Use bullet points when listing.`;

export default async function handler(req) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { messages } = await req.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'ANTHROPIC_API_KEY not set in Vercel environment variables.' }),
        { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 450,
        system: RESUME_CONTEXT,
        messages: messages.slice(-8),
      }),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }
}
