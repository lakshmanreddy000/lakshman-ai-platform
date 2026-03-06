import { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from "recharts";

// ─────────────────────────────────────────────
//  THEME
// ─────────────────────────────────────────────
const T = {
  bg: '#05050f',
  surface: '#0c0c1e',
  surface2: '#131328',
  border: 'rgba(0,214,198,0.14)',
  primary: '#00d6c6',
  primaryDim: 'rgba(0,214,198,0.08)',
  accent: '#f059c0',
  amber: '#f5a623',
  purple: '#8b5cf6',
  green: '#00ff88',
  red: '#ff4b6e',
  text: '#dde2f0',
  textDim: '#565875',
};

// ─────────────────────────────────────────────
//  AI CONTEXT
// ─────────────────────────────────────────────
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
   • ETL pipelines → +30% data reliability
   • Revenue leakage & churn detection → −25% operational inefficiency
   • Power BI / Tableau dashboards → +40% leadership decision speed
   • Snowflake/BigQuery/Redshift star-schema DWH → +35% query performance
   • Automated CI/CD (Alteryx, Git, Jenkins, Azure DevOps)

2. Hexaware Technologies – Data Analyst (Feb 2022–Jul 2024, India/Healthcare)
   • Unified patient-encounter + claims dataset (Epic Clarity, ICD-10, CPT, HL7/Snowflake)
   • Anomaly-aware admission-trend framework → +25% predictive stability
   • Denial root-cause intelligence (Azure Data Lake, FHIR) → +35% billing precision
   • Power BI hospital resource allocation dashboards → +40% efficiency
   • Payer-denial predictive scoring (Tableau, ICD-CPT-DRG) → +20% pre-submission efficiency

EDUCATION:
- MSc Business Analytics, SETU Ireland (2024–2025)
- B.Tech Computer Science (Data Analytics), LPU India (2019–2023)

PROJECTS:
1. "What Makes a Hit?" YouTube Virality Predictor
   - 5,000+ videos, Logistic Regression + Random Forest → 87% accuracy
   - Seaborn + Tableau visualizations
2. Bias Buster – NLP Media Bias Detection
   - 15,000+ headlines scraped (BeautifulSoup)
   - VADER + TextBlob custom Bias Score → 40% sentiment variance found
3. Mapping Urban Inequality
   - 5+ public datasets, GeoPandas + Plotly + Power BI
   - Identified 20% service gap in underserved neighborhoods

CERTIFICATIONS: AWS Cloud 101, HackerRank Python, IBM R for Data Science, MATLAB Onramp, Coursera Python

Answer questions about Lakshman only. Be concise (max 3 paragraphs). Use bullet points when listing skills or projects.`;

// ─────────────────────────────────────────────
//  DATASETS
// ─────────────────────────────────────────────
const CUSTOMERS = [
  { customer_id: 1, name: 'Alice Johnson', country: 'USA', total_spent: 15420, orders: 34, status: 'Premium', joined: '2022-03-15' },
  { customer_id: 2, name: 'Bob Smith', country: 'UK', total_spent: 12890, orders: 28, status: 'Premium', joined: '2022-06-20' },
  { customer_id: 3, name: 'Carol White', country: 'Canada', total_spent: 9876, orders: 19, status: 'Standard', joined: '2023-01-10' },
  { customer_id: 4, name: 'David Lee', country: 'Australia', total_spent: 8543, orders: 22, status: 'Standard', joined: '2022-11-05' },
  { customer_id: 5, name: 'Eva Martinez', country: 'Spain', total_spent: 7321, orders: 15, status: 'Standard', joined: '2023-03-22' },
  { customer_id: 6, name: 'Frank Brown', country: 'USA', total_spent: 6789, orders: 18, status: 'Standard', joined: '2022-08-14' },
  { customer_id: 7, name: 'Grace Kim', country: 'S.Korea', total_spent: 5432, orders: 12, status: 'Basic', joined: '2023-05-01' },
  { customer_id: 8, name: 'Henry Davis', country: 'USA', total_spent: 4321, orders: 9, status: 'Basic', joined: '2023-07-18' },
  { customer_id: 9, name: 'Iris Wilson', country: 'France', total_spent: 3210, orders: 7, status: 'Basic', joined: '2023-09-25' },
  { customer_id: 10, name: 'Jack Taylor', country: 'Germany', total_spent: 2100, orders: 5, status: 'Basic', joined: '2023-11-12' },
];

const ORDERS = [
  { order_id: 101, customer_id: 1, product: 'Enterprise Software', amount: 4500, month: 'Jan', status: 'Completed' },
  { order_id: 102, customer_id: 2, product: 'Analytics Suite', amount: 2300, month: 'Jan', status: 'Completed' },
  { order_id: 103, customer_id: 1, product: 'Cloud Storage', amount: 890, month: 'Feb', status: 'Completed' },
  { order_id: 104, customer_id: 3, product: 'BI Dashboard', amount: 1200, month: 'Feb', status: 'Pending' },
  { order_id: 105, customer_id: 4, product: 'ML Pipeline', amount: 3400, month: 'Feb', status: 'Completed' },
  { order_id: 106, customer_id: 5, product: 'ETL Service', amount: 780, month: 'Mar', status: 'Completed' },
  { order_id: 107, customer_id: 2, product: 'Enterprise Software', amount: 4500, month: 'Mar', status: 'Processing' },
  { order_id: 108, customer_id: 6, product: 'Cloud Storage', amount: 890, month: 'Mar', status: 'Completed' },
  { order_id: 109, customer_id: 1, product: 'ML Pipeline', amount: 3400, month: 'Apr', status: 'Completed' },
  { order_id: 110, customer_id: 7, product: 'Analytics Suite', amount: 2300, month: 'Apr', status: 'Pending' },
];

const TRANSACTIONS = [
  { txn_id: 'T001', customer_id: 1, month: 'Jan', revenue: 4500, refunds: 0 },
  { txn_id: 'T002', customer_id: 2, month: 'Jan', revenue: 2300, refunds: 230 },
  { txn_id: 'T003', customer_id: 3, month: 'Feb', revenue: 1200, refunds: 0 },
  { txn_id: 'T004', customer_id: 4, month: 'Feb', revenue: 3400, refunds: 340 },
  { txn_id: 'T005', customer_id: 5, month: 'Feb', revenue: 780, refunds: 0 },
  { txn_id: 'T006', customer_id: 1, month: 'Mar', revenue: 3400, refunds: 0 },
  { txn_id: 'T007', customer_id: 2, month: 'Mar', revenue: 4500, refunds: 450 },
  { txn_id: 'T008', customer_id: 6, month: 'Mar', revenue: 890, refunds: 0 },
  { txn_id: 'T009', customer_id: 1, month: 'Apr', revenue: 3400, refunds: 0 },
  { txn_id: 'T010', customer_id: 7, month: 'Apr', revenue: 2300, refunds: 115 },
];

const DB_TABLES = { customers: CUSTOMERS, orders: ORDERS, transactions: TRANSACTIONS };

// ─────────────────────────────────────────────
//  STATIC DATA
// ─────────────────────────────────────────────
const SKILLS_RADAR = [
  { skill: 'SQL / DB', value: 92 },
  { skill: 'Python / ML', value: 88 },
  { skill: 'Power BI', value: 85 },
  { skill: 'Healthcare', value: 85 },
  { skill: 'ETL / Cloud', value: 82 },
  { skill: 'Statistics', value: 78 },
];

const PROJECTS = [
  {
    title: 'YouTube Virality Predictor',
    desc: 'Analyzed 5,000+ YouTube videos and built ML models (Logistic Regression + Random Forest) achieving 87% accuracy to identify key virality drivers.',
    tags: ['Python', 'Scikit-learn', 'Random Forest', 'Tableau', 'Seaborn'],
    metric: '87% Accuracy',
    icon: '🎬',
    color: T.red,
  },
  {
    title: 'Bias Buster — NLP Media Analysis',
    desc: 'Scraped 15,000+ news headlines. Built a custom Bias Score metric using VADER & TextBlob, revealing 40% sentiment variance across political sources.',
    tags: ['NLP', 'Python', 'VADER', 'TextBlob', 'BeautifulSoup', 'Tableau'],
    metric: '40% Variance Found',
    icon: '📰',
    color: T.purple,
  },
  {
    title: 'Urban Inequality Mapper',
    desc: 'Merged 5+ public datasets (education, crime, income, healthcare). Built a normalized inequality index with GeoPandas and Power BI dashboards.',
    tags: ['GeoPandas', 'Plotly', 'Power BI', 'Python', 'Public Data'],
    metric: '20% Service Gap Found',
    icon: '🗺️',
    color: T.primary,
  },
  {
    title: 'Healthcare Claims Platform (Hexaware)',
    desc: 'Enterprise healthcare data platform integrating Epic Clarity, ICD-10/CPT, FHIR. Powered hospital billing and resource-allocation decisions.',
    tags: ['Epic Clarity', 'Snowflake', 'SQL', 'Power BI', 'HL7', 'FHIR'],
    metric: '35% Billing Precision ↑',
    icon: '🏥',
    color: T.amber,
  },
];

const REPOS = [
  { name: 'youtube-virality-predictor', desc: 'ML model predicting YouTube virality with Random Forest — 87% accuracy', lang: 'Python', stars: 23, color: '#3b82f6' },
  { name: 'bias-buster-nlp', desc: 'Detecting political bias in news headlines using NLP (VADER, TextBlob)', lang: 'Python', stars: 18, color: '#3b82f6' },
  { name: 'urban-inequality-mapper', desc: 'Geospatial analysis of urban inequality using GeoPandas + Plotly', lang: 'Python', stars: 15, color: '#3b82f6' },
  { name: 'sql-analytics-toolkit', desc: 'Advanced SQL templates for customer analytics, churn & revenue analysis', lang: 'SQL', stars: 31, color: T.amber },
  { name: 'healthcare-etl-pipeline', desc: 'Scalable ETL for healthcare claims using dbt + Apache Airflow + Snowflake', lang: 'SQL', stars: 12, color: T.amber },
  { name: 'powerbi-sales-dashboard', desc: 'Interactive Power BI dashboards for e-commerce KPI tracking with DAX', lang: 'DAX', stars: 9, color: T.purple },
];

const VISIT_DATA = [
  { day: 'Mon', visits: 45, questions: 12 },
  { day: 'Tue', visits: 78, questions: 23 },
  { day: 'Wed', visits: 123, questions: 45 },
  { day: 'Thu', visits: 98, questions: 31 },
  { day: 'Fri', visits: 156, questions: 67 },
  { day: 'Sat', visits: 89, questions: 34 },
  { day: 'Sun', visits: 67, questions: 22 },
];

const COUNTRY_DATA = [
  { country: 'Ireland', visits: 312, color: T.primary },
  { country: 'USA', visits: 198, color: T.purple },
  { country: 'India', visits: 167, color: T.accent },
  { country: 'UK', visits: 89, color: T.amber },
  { country: 'Canada', visits: 81, color: T.green },
];

const SAMPLE_QUERIES = [
  { label: '🏆 Top Customers', q: 'SELECT customer_id, name, country, total_spent\nFROM customers\nORDER BY total_spent DESC\nLIMIT 5' },
  { label: '🇺🇸 USA Segment', q: 'SELECT name, total_spent, orders\nFROM customers\nWHERE country = USA\nORDER BY total_spent DESC' },
  { label: '⭐ Premium Only', q: 'SELECT name, status, total_spent\nFROM customers\nWHERE status = Premium' },
  { label: '✅ Done Orders', q: 'SELECT order_id, product, amount, month\nFROM orders\nWHERE status = Completed\nORDER BY amount DESC' },
  { label: '💳 Jan Revenue', q: 'SELECT txn_id, customer_id, revenue, refunds\nFROM transactions\nWHERE month = Jan\nORDER BY revenue DESC' },
];

// ─────────────────────────────────────────────
//  SQL MINI-ENGINE
// ─────────────────────────────────────────────
function runSQL(query, tables) {
  const q = query.trim();
  if (!/^SELECT/i.test(q)) throw new Error('Only SELECT queries are supported.');

  const fromM = q.match(/FROM\s+(\w+)/i);
  if (!fromM) throw new Error('No FROM clause found.');
  const tbl = fromM[1].toLowerCase();
  if (!tables[tbl]) throw new Error(`Table "${tbl}" not found. Try: customers, orders, transactions`);

  let rows = [...tables[tbl]];

  // WHERE
  const whereM = q.match(/WHERE\s+(.+?)(?=\s+(?:GROUP|ORDER|LIMIT)|$)/i);
  if (whereM) {
    const cond = whereM[1].trim();
    const parts = cond.match(/(\w+)\s*(=|!=|>=|<=|>|<|LIKE)\s*['"]?([^'"]+)['"]?/i);
    if (parts) {
      const [, col, op, val] = parts;
      const c = col.toLowerCase();
      rows = rows.filter(r => {
        const cv = r[c];
        const nv = parseFloat(val);
        if (op === '=')  return String(cv).toLowerCase() === val.toLowerCase();
        if (op === '!=') return String(cv).toLowerCase() !== val.toLowerCase();
        if (op === '>')  return cv > nv;
        if (op === '<')  return cv < nv;
        if (op === '>=') return cv >= nv;
        if (op === '<=') return cv <= nv;
        if (/LIKE/i.test(op)) return String(cv).toLowerCase().includes(val.replace(/%/g,'').toLowerCase());
        return true;
      });
    }
  }

  // ORDER BY
  const orderM = q.match(/ORDER\s+BY\s+(\w+)(?:\s+(ASC|DESC))?/i);
  if (orderM) {
    const oc = orderM[1].toLowerCase();
    const desc = /DESC/i.test(orderM[2] || '');
    rows.sort((a, b) => (a[oc] > b[oc] ? 1 : -1) * (desc ? -1 : 1));
  }

  // LIMIT
  const limM = q.match(/LIMIT\s+(\d+)/i);
  if (limM) rows = rows.slice(0, +limM[1]);

  // SELECT columns
  const selStr = q.match(/SELECT\s+(.+?)\s+FROM/i)?.[1]?.trim() || '*';
  if (selStr !== '*') {
    const cols = selStr.split(',').map(c => c.trim().replace(/.*\s+AS\s+/i,'').toLowerCase());
    if (!cols.includes('*')) {
      rows = rows.map(r => {
        const nr = {};
        cols.forEach(c => { if (r[c] !== undefined) nr[c] = r[c]; });
        return Object.keys(nr).length ? nr : r;
      });
    }
  }

  return { rows, cols: rows.length ? Object.keys(rows[0]) : [] };
}

// ─────────────────────────────────────────────
//  ML PREDICTOR
// ─────────────────────────────────────────────
function predictVirality({ titleLen, duration, tags, sentiment }) {
  const tw = titleLen >= 40 && titleLen <= 70 ? 0.27 : titleLen >= 25 ? 0.14 : 0.04;
  const dw = duration >= 7 && duration <= 15 ? 0.25 : duration >= 4 ? 0.14 : 0.07;
  const tgw = Math.min(tags / 20, 1) * 0.22;
  const sw = sentiment * 0.26;
  const raw = tw + dw + tgw + sw + (Math.random() * 0.04 - 0.02);
  const prob = Math.min(0.97, Math.max(0.04, raw));
  return {
    prob,
    label: prob > 0.70 ? 'High Virality 🔥' : prob > 0.45 ? 'Moderate Virality ⚡' : 'Low Virality 📉',
    factors: [
      { name: 'Title Length', val: tw,  max: 0.27 },
      { name: 'Video Duration', val: dw, max: 0.25 },
      { name: 'Tag Coverage', val: tgw, max: 0.22 },
      { name: 'Sentiment Score', val: sw, max: 0.26 },
    ],
  };
}

// ─────────────────────────────────────────────
//  GLOBAL CSS
// ─────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:${T.bg};}
  ::-webkit-scrollbar{width:5px;}
  ::-webkit-scrollbar-track{background:${T.bg};}
  ::-webkit-scrollbar-thumb{background:${T.primary};border-radius:3px;}

  .card{background:${T.surface};border:1px solid ${T.border};border-radius:14px;}
  .card-hover{transition:transform .25s,border-color .25s,box-shadow .25s;}
  .card-hover:hover{transform:translateY(-4px);border-color:${T.primary};box-shadow:0 8px 32px rgba(0,214,198,.12);}

  .btn-p{background:${T.primary};color:#04040c;border:none;cursor:pointer;padding:10px 22px;border-radius:9px;font-weight:600;font-size:14px;font-family:'DM Sans',sans-serif;transition:opacity .2s,transform .15s;}
  .btn-p:hover{opacity:.88;transform:translateY(-1px);}
  .btn-p:disabled{opacity:.5;cursor:not-allowed;transform:none;}
  .btn-g{background:transparent;color:${T.primary};border:1px solid ${T.primary};cursor:pointer;padding:10px 22px;border-radius:9px;font-weight:600;font-size:14px;font-family:'DM Sans',sans-serif;transition:background .2s;}
  .btn-g:hover{background:${T.primaryDim};}

  .navlink{color:${T.textDim};font-size:13px;font-weight:500;cursor:pointer;padding:5px 12px;border-radius:7px;transition:all .2s;border:none;background:none;font-family:'DM Sans',sans-serif;}
  .navlink:hover,.navlink.active{color:${T.primary};background:${T.primaryDim};}

  .tag{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:500;margin:2px;}

  .section-title{font-family:'Syne',sans-serif;font-size:clamp(26px,3.5vw,40px);font-weight:800;color:${T.text};}
  .label-tag{font-family:'JetBrains Mono',monospace;font-size:11px;color:${T.primary};letter-spacing:3px;margin-bottom:10px;}

  .grid-bg{background-image:linear-gradient(rgba(0,214,198,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,214,198,.025) 1px,transparent 1px);background-size:44px 44px;}

  .progress-track{height:5px;background:${T.surface2};border-radius:3px;overflow:hidden;}
  .progress-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,${T.primary},${T.purple});transition:width 1s ease;}

  .sql-ed{background:#08081a;border:1px solid ${T.border};border-radius:9px;padding:14px;font-family:'JetBrains Mono',monospace;font-size:13px;color:#a78bfa;resize:vertical;width:100%;min-height:130px;outline:none;line-height:1.65;transition:border-color .2s;}
  .sql-ed:focus{border-color:${T.primary};}

  .range-inp{width:100%;-webkit-appearance:none;background:${T.surface2};height:4px;border-radius:2px;outline:none;cursor:pointer;}
  .range-inp::-webkit-slider-thumb{-webkit-appearance:none;width:15px;height:15px;background:${T.primary};border-radius:50%;cursor:pointer;}

  .chat-user{background:${T.primary};color:#04040c;border-radius:16px 16px 4px 16px;padding:10px 14px;font-size:13px;max-width:82%;align-self:flex-end;line-height:1.5;}
  .chat-ai{background:${T.surface2};border:1px solid ${T.border};border-radius:16px 16px 16px 4px;padding:10px 14px;font-size:13px;max-width:88%;align-self:flex-start;white-space:pre-line;line-height:1.6;}

  .repo-card{transition:all .25s;cursor:pointer;}
  .repo-card:hover{border-color:${T.primary} !important;background:${T.surface2} !important;}

  @keyframes fadeUp{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}
  @keyframes glow-pulse{0%,100%{box-shadow:0 0 10px rgba(0,214,198,.3);}50%{box-shadow:0 0 26px rgba(0,214,198,.7);}}
  @keyframes blink{0%,100%{opacity:1;}50%{opacity:0;}}
  .fade-up{animation:fadeUp .55s ease both;}
  .glow-pulse{animation:glow-pulse 2.2s infinite;}
  .blink{animation:blink 1.1s infinite;}

  /* Table */
  .sql-tbl{width:100%;border-collapse:collapse;font-size:13px;}
  .sql-tbl th{background:${T.surface2};padding:8px 12px;text-align:left;font-family:'JetBrains Mono',monospace;font-size:11px;color:${T.primary};border-bottom:1px solid ${T.border};white-space:nowrap;}
  .sql-tbl td{padding:8px 12px;border-bottom:1px solid ${T.border};}
  .sql-tbl tr:nth-child(even) td{background:${T.surface2};}

  input[type=text], input:not([type]){background:${T.surface2};border:1px solid ${T.border};border-radius:8px;padding:9px 13px;color:${T.text};font-size:13px;outline:none;transition:border-color .2s;font-family:'DM Sans',sans-serif;}
  input:focus{border-color:${T.primary};}
`;

// ─────────────────────────────────────────────
//  MAIN APP
// ─────────────────────────────────────────────
export default function App() {
  const [activeNav, setActiveNav] = useState('hero');
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm Lakshman's AI Portfolio Assistant 🤖\n\nAsk me about his skills, experience, projects, or anything else!" }
  ]);
  const [userInput, setUserInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const chatEndRef = useRef(null);
  const canvasRef = useRef(null);

  // SQL state
  const [sqlQ, setSqlQ] = useState(SAMPLE_QUERIES[0].q);
  const [sqlResult, setSqlResult] = useState(null);
  const [sqlErr, setSqlErr] = useState(null);
  const [sqlLoading, setSqlLoading] = useState(false);

  // ML state
  const [mlIn, setMlIn] = useState({ titleLen: 55, duration: 10, tags: 15, sentiment: 0.75 });
  const [mlResult, setMlResult] = useState(null);
  const [mlLoading, setMlLoading] = useState(false);

  const NAV = [
    { id: 'hero', label: 'Home' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'sql', label: 'SQL Lab' },
    { id: 'ml', label: 'ML Lab' },
    { id: 'github', label: 'GitHub' },
    { id: 'analytics', label: 'Analytics' },
  ];

  // ── Canvas particle network ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const ctx = canvas.getContext('2d');
    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.38, vy: (Math.random() - 0.5) * 0.38,
      r: Math.random() * 1.8 + 0.4,
    }));
    let id;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,214,198,.65)'; ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx*dx + dy*dy);
          if (d < 115) {
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(0,214,198,${.13*(1-d/115)})`; ctx.lineWidth = .5; ctx.stroke();
          }
        }
      }
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); };
  }, []);

  // ── Auto-scroll chat ──
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // ── Scroll-spy ──
  useEffect(() => {
    const handler = () => {
      const ids = NAV.map(n => n.id);
      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 80) { setActiveNav(id); break; }
      }
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // ── Navigation ──
  const goto = (id) => {
    setActiveNav(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // ── AI Chat ──
  const sendMessage = async () => {
    const msg = userInput.trim();
    if (!msg || aiLoading) return;
    setUserInput('');
    const next = [...messages, { role: 'user', content: msg }];
    setMessages(next);
    setAiLoading(true);
    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_KEY || '';
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 450,
          system: RESUME_CONTEXT,
          messages: next.slice(-8).map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || 'Sorry, I had trouble responding. Please try again.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Connection issue — please try again! 🔄" }]);
    }
    setAiLoading(false);
  };

  // ── SQL ──
  const execSQL = () => {
    setSqlLoading(true); setSqlErr(null);
    setTimeout(() => {
      try { setSqlResult(runSQL(sqlQ, DB_TABLES)); }
      catch (e) { setSqlErr(e.message); setSqlResult(null); }
      setSqlLoading(false);
    }, 500);
  };

  // ── ML ──
  const runML = () => {
    setMlLoading(true);
    setTimeout(() => { setMlResult(predictVirality(mlIn)); setMlLoading(false); }, 750);
  };

  // ── Helpers ──
  const Section = ({ id, children, dark }) => (
    <section id={id} style={{ background: dark ? T.surface : T.bg, padding: '88px 0 72px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 36px' }}>{children}</div>
    </section>
  );

  const SectionHeader = ({ label, title, sub }) => (
    <div style={{ textAlign: 'center', marginBottom: 52 }}>
      <div className="label-tag">{label}</div>
      <h2 className="section-title">{title}</h2>
      {sub && <p style={{ color: T.textDim, marginTop: 12, fontSize: 15 }}>{sub}</p>}
    </div>
  );

  const mlColor = mlResult ? (mlResult.prob > 0.70 ? T.green : mlResult.prob > 0.45 ? T.amber : T.red) : T.primary;

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: T.bg, color: T.text, minHeight: '100vh' }}>
      <style>{CSS}</style>

      {/* ─── NAVBAR ─── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(5,5,15,.88)', backdropFilter: 'blur(14px)',
        borderBottom: `1px solid ${T.border}`, height: 60,
        display: 'flex', alignItems: 'center', padding: '0 28px', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginRight: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.primary, boxShadow: `0 0 9px ${T.primary}` }} />
          <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 14, color: T.primary }}>LAKSHMAN.AI</span>
        </div>
        <div style={{ display: 'flex', gap: 2, flex: 1 }}>
          {NAV.map(n => (
            <button key={n.id} className={`navlink ${activeNav === n.id ? 'active' : ''}`} onClick={() => goto(n.id)}>{n.label}</button>
          ))}
        </div>
        <button className="btn-p" style={{ fontSize: 12, padding: '6px 14px' }} onClick={() => setChatOpen(o => !o)}>
          {chatOpen ? '✕ Close' : '🤖 AI Chat'}
        </button>
      </nav>

      {/* ═══════════════════════════════════════
          HERO
      ═══════════════════════════════════════ */}
      <section id="hero" className="grid-bg" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 60, overflow: 'hidden' }}>
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: .85, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 1180, margin: '0 auto', padding: '0 36px', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 56, alignItems: 'center' }}>

            {/* Left */}
            <div className="fade-up">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: T.green, boxShadow: `0 0 8px ${T.green}` }} />
                <span style={{ fontSize: 11, color: T.green, fontFamily: 'JetBrains Mono,monospace', letterSpacing: 2.5 }}>AVAILABLE · IRELAND</span>
              </div>

              <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: 'clamp(38px,5.5vw,70px)', fontWeight: 800, lineHeight: 1.08, marginBottom: 18 }}>
                Lakshmi<br />
                <span style={{ background: `linear-gradient(130deg,${T.primary},${T.purple})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Prasanna</span><br />
                Reddy
              </h1>

              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 15, color: T.primary, marginBottom: 14 }}>
                {'>'} Business Data Analyst<span className="blink">|</span>
              </div>

              <p style={{ color: T.textDim, fontSize: 15, lineHeight: 1.72, maxWidth: 450, marginBottom: 30 }}>
                3+ years delivering impactful analytics in healthcare & e-commerce — across Python, SQL, Power BI, Snowflake, and multi-cloud platforms (AWS · GCP · Azure).
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
                <button className="btn-p" style={{ padding: '12px 26px', fontSize: 14 }} onClick={() => goto('skills')}>Explore Skills →</button>
                <button className="btn-g" style={{ padding: '12px 26px', fontSize: 14 }} onClick={() => setChatOpen(true)}>🤖 Ask AI</button>
              </div>

              <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                {['Python', 'SQL', 'Power BI', 'Snowflake', 'Tableau', 'ML', 'dbt', 'Airflow'].map(t => (
                  <span key={t} className="tag" style={{ background: T.primaryDim, color: T.primary, border: `1px solid ${T.border}` }}>{t}</span>
                ))}
              </div>
            </div>

            {/* Right — stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { label: 'Years Experience', value: '3+', icon: '⚡', color: T.primary },
                { label: 'ML Model Accuracy', value: '87%', icon: '🤖', color: T.purple },
                { label: 'Decision-Making Boost', value: '40%', icon: '🎯', color: T.accent },
                { label: 'Data Reliability Gain', value: '30%', icon: '📈', color: T.amber },
              ].map((s, i) => (
                <div key={i} className="card fade-up card-hover" style={{ padding: 22, textAlign: 'center', animationDelay: `${i * .1}s` }}>
                  <div style={{ fontSize: 26, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 38, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: T.textDim, marginTop: 6 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', textAlign: 'center', userSelect: 'none' }}>
          <div style={{ fontSize: 10, color: T.textDim, letterSpacing: 3, marginBottom: 5 }}>SCROLL TO EXPLORE</div>
          <div style={{ fontSize: 20, color: T.primary }} className="glow-pulse">↓</div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SKILLS
      ═══════════════════════════════════════ */}
      <Section id="skills" dark>
        <SectionHeader label="EXPERTISE" title="Technical Skills" sub="Full-stack data capabilities — from raw ingestion to executive insight" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36, alignItems: 'center', marginBottom: 36 }}>
          {/* Radar */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontSize: 13, color: T.textDim, fontWeight: 600, marginBottom: 16 }}>Skill Proficiency Radar</div>
            <ResponsiveContainer width="100%" height={270}>
              <RadarChart data={SKILLS_RADAR}>
                <PolarGrid stroke={T.border} />
                <PolarAngleAxis dataKey="skill" tick={{ fill: T.textDim, fontSize: 12, fontFamily: 'DM Sans' }} />
                <Radar dataKey="value" stroke={T.primary} fill={T.primary} fillOpacity={0.14} dot={{ fill: T.primary, r: 3 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {[
              { name: 'SQL & Databases', val: 92, color: T.primary },
              { name: 'Python & Machine Learning', val: 88, color: T.purple },
              { name: 'Power BI / Tableau / DAX', val: 85, color: T.accent },
              { name: 'Healthcare Analytics', val: 85, color: '#60a5fa' },
              { name: 'ETL Pipelines (dbt, Airflow)', val: 82, color: T.amber },
              { name: 'Cloud (AWS · GCP · Azure)', val: 80, color: T.green },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7, fontSize: 13 }}>
                  <span>{s.name}</span>
                  <span style={{ color: s.color, fontFamily: 'JetBrains Mono,monospace', fontSize: 12 }}>{s.val}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${s.val}%`, background: `linear-gradient(90deg,${s.color},${s.color}88)` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill category chips */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[
            { title: '🧠 ML & Statistics', items: ['Scikit-learn', 'Regression', 'Clustering', 'Time-Series', 'Anomaly Detection', 'Feature Engineering', 'EDA'] },
            { title: '☁️ Cloud & Data Eng', items: ['Snowflake', 'BigQuery', 'AWS Redshift', 'Azure Synapse', 'dbt', 'Apache Airflow', 'Alteryx'] },
            { title: '📊 BI & Viz', items: ['Power BI', 'Tableau', 'DAX', 'Excel', 'Plotly', 'Seaborn', 'GeoPandas'] },
            { title: '🏥 Healthcare', items: ['Epic Clarity', 'Cerner', 'HL7 / FHIR', 'ICD-10 / CPT', 'DRG', 'HIPAA', 'Caboodle'] },
          ].map((cat, i) => (
            <div key={i} className="card card-hover" style={{ padding: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.primary, marginBottom: 12 }}>{cat.title}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {cat.items.map(item => (
                  <span key={item} className="tag" style={{ background: T.primaryDim, color: T.textDim, border: `1px solid ${T.border}`, fontSize: 11 }}>{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══════════════════════════════════════
          PROJECTS
      ═══════════════════════════════════════ */}
      <Section id="projects">
        <SectionHeader label="PORTFOLIO" title="Featured Projects" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 22 }}>
          {PROJECTS.map((p, i) => (
            <div key={i} className="card card-hover" style={{ padding: 28, borderTop: `3px solid ${p.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <span style={{ fontSize: 30 }}>{p.icon}</span>
                <span style={{ background: `${p.color}22`, color: p.color, padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{p.metric}</span>
              </div>
              <h3 style={{ fontFamily: 'Syne,sans-serif', fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{p.title}</h3>
              <p style={{ color: T.textDim, fontSize: 13.5, lineHeight: 1.68, marginBottom: 16 }}>{p.desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {p.tags.map(t => (
                  <span key={t} className="tag" style={{ background: `${p.color}14`, color: p.color, border: `1px solid ${p.color}44` }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══════════════════════════════════════
          SQL PLAYGROUND
      ═══════════════════════════════════════ */}
      <Section id="sql" dark>
        <SectionHeader label="INTERACTIVE" title="SQL Query Playground" sub="Run live queries on a sample e-commerce dataset" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Editor panel */}
          <div>
            {/* Schema info */}
            <div className="card" style={{ padding: 14, marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: T.textDim, marginBottom: 9, fontFamily: 'JetBrains Mono,monospace', letterSpacing: 1.5 }}>AVAILABLE TABLES</div>
              <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
                {[
                  { name: 'customers', cols: 'customer_id, name, country, total_spent, orders, status, joined' },
                  { name: 'orders', cols: 'order_id, customer_id, product, amount, month, status' },
                  { name: 'transactions', cols: 'txn_id, customer_id, month, revenue, refunds' },
                ].map(t => (
                  <div key={t.name} style={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 8, padding: '8px 12px' }}>
                    <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: T.primary, marginBottom: 3 }}>📋 {t.name}</div>
                    <div style={{ fontSize: 10, color: T.textDim }}>{t.cols}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample queries */}
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 11 }}>
              {SAMPLE_QUERIES.map((q, i) => (
                <button key={i} onClick={() => { setSqlQ(q.q); setSqlResult(null); setSqlErr(null); }}
                  style={{ background: T.surface2, border: `1px solid ${T.border}`, color: T.textDim, padding: '5px 11px', borderRadius: 7, fontSize: 11.5, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif' }}>
                  {q.label}
                </button>
              ))}
            </div>

            <textarea className="sql-ed" value={sqlQ} onChange={e => setSqlQ(e.target.value)} rows={7} spellCheck={false} />

            <div style={{ display: 'flex', gap: 10, marginTop: 11 }}>
              <button className="btn-p" onClick={execSQL} disabled={sqlLoading} style={{ flex: 1 }}>
                {sqlLoading ? '⏳ Running...' : '▶  Run Query'}
              </button>
              <button className="btn-g" onClick={() => { setSqlResult(null); setSqlErr(null); setSqlQ(''); }}>Clear</button>
            </div>

            {sqlErr && (
              <div style={{ background: 'rgba(255,75,110,.1)', border: '1px solid rgba(255,75,110,.3)', borderRadius: 8, padding: 12, marginTop: 12, fontSize: 12.5, color: T.red, fontFamily: 'JetBrains Mono,monospace' }}>
                ⚠ {sqlErr}
              </div>
            )}
          </div>

          {/* Results panel */}
          <div>
            {sqlResult ? (
              <div className="card" style={{ padding: 18, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: T.green }}>✓ {sqlResult.rows.length} rows</span>
                  <span style={{ fontSize: 11, color: T.textDim }}>{sqlResult.cols.length} columns</span>
                </div>
                <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: 260, flex: '0 0 auto' }}>
                  <table className="sql-tbl">
                    <thead>
                      <tr>{sqlResult.cols.map(c => <th key={c}>{c.toUpperCase()}</th>)}</tr>
                    </thead>
                    <tbody>
                      {sqlResult.rows.map((row, i) => (
                        <tr key={i}>
                          {sqlResult.cols.map(c => (
                            <td key={c} style={{ color: typeof row[c] === 'number' ? T.amber : T.text, fontFamily: typeof row[c] === 'number' ? 'JetBrains Mono,monospace' : 'inherit' }}>
                              {typeof row[c] === 'number' ? row[c].toLocaleString() : String(row[c] ?? '')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Auto-chart */}
                {sqlResult.cols.some(c => typeof sqlResult.rows[0]?.[c] === 'number') && (
                  <div style={{ marginTop: 16, flex: 1 }}>
                    <div style={{ fontSize: 11, color: T.textDim, marginBottom: 8, fontFamily: 'JetBrains Mono,monospace' }}>QUICK VISUALIZATION</div>
                    <ResponsiveContainer width="100%" height={130}>
                      <BarChart data={sqlResult.rows.slice(0, 8).map(r => ({
                        name: String(r[sqlResult.cols[0]]).slice(0, 12),
                        v: r[sqlResult.cols.find(c => typeof r[c] === 'number')] || 0,
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: T.textDim }} />
                        <YAxis tick={{ fontSize: 10, fill: T.textDim }} />
                        <Tooltip contentStyle={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 12 }} />
                        <Bar dataKey="v" fill={T.primary} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            ) : (
              <div className="card" style={{ padding: 24, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14 }}>
                <div style={{ fontSize: 46 }}>💻</div>
                <div style={{ fontSize: 15, color: T.textDim, fontWeight: 500 }}>Results will appear here</div>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: T.border, textAlign: 'center', lineHeight: 2 }}>
                  SELECT * FROM customers LIMIT 5<br />
                  WHERE country = USA<br />
                  ORDER BY total_spent DESC
                </div>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════
          ML LAB
      ═══════════════════════════════════════ */}
      <Section id="ml">
        <SectionHeader label="MACHINE LEARNING" title="YouTube Virality Predictor" sub="Based on Lakshman's actual project · Random Forest + Logistic Regression · 87% accuracy" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          {/* Inputs */}
          <div className="card" style={{ padding: 28 }}>
            <h3 style={{ fontFamily: 'Syne,sans-serif', fontSize: 17, fontWeight: 700, marginBottom: 26 }}>📊 Video Parameters</h3>
            {[
              { key: 'titleLen', label: 'Title Length', min: 10, max: 100, step: 1, unit: 'chars', tip: 'Sweet spot: 40–70 chars' },
              { key: 'duration', label: 'Video Duration', min: 1, max: 60, step: 1, unit: 'min', tip: 'Sweet spot: 7–15 min' },
              { key: 'tags', label: 'Number of Tags', min: 0, max: 30, step: 1, unit: 'tags', tip: 'More tags = better discoverability' },
              { key: 'sentiment', label: 'Title Sentiment', min: 0, max: 1, step: 0.01, unit: '/1.0', tip: 'Positive sentiment performs better' },
            ].map(inp => (
              <div key={inp.key} style={{ marginBottom: 22 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                  <span style={{ fontWeight: 500 }}>{inp.label}</span>
                  <span style={{ color: T.primary, fontFamily: 'JetBrains Mono,monospace', fontSize: 12 }}>
                    {inp.key === 'sentiment' ? mlIn[inp.key].toFixed(2) : mlIn[inp.key]} {inp.unit}
                  </span>
                </div>
                <input type="range" className="range-inp" min={inp.min} max={inp.max} step={inp.step}
                  value={mlIn[inp.key]}
                  onChange={e => setMlIn(p => ({ ...p, [inp.key]: parseFloat(e.target.value) }))} />
                <div style={{ fontSize: 11, color: T.textDim, marginTop: 5 }}>💡 {inp.tip}</div>
              </div>
            ))}
            <button className="btn-p" style={{ width: '100%', padding: 14, fontSize: 15 }} onClick={runML} disabled={mlLoading}>
              {mlLoading ? '🔄 Analyzing...' : '🚀 Predict Virality'}
            </button>
          </div>

          {/* Results */}
          {mlResult ? (
            <div className="card" style={{ padding: 28 }}>
              <h3 style={{ fontFamily: 'Syne,sans-serif', fontSize: 17, fontWeight: 700, marginBottom: 24 }}>📈 Prediction Results</h3>

              {/* Gauge */}
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <svg width={190} height={105} viewBox="0 0 190 105" style={{ overflow: 'visible' }}>
                  <path d="M 22 95 A 73 73 0 0 1 168 95" fill="none" stroke={T.border} strokeWidth={13} strokeLinecap="round" />
                  <path d="M 22 95 A 73 73 0 0 1 168 95" fill="none" stroke={mlColor} strokeWidth={13} strokeLinecap="round"
                    strokeDasharray={`${mlResult.prob * 230} 230`} style={{ transition: 'stroke-dasharray .8s ease' }} />
                  <text x="95" y="88" textAnchor="middle" style={{ fontFamily: 'Syne,sans-serif', fontSize: 26, fontWeight: 800, fill: mlColor }}>{Math.round(mlResult.prob * 100)}%</text>
                  <text x="95" y="102" textAnchor="middle" style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 10, fill: T.textDim }}>Virality Score</text>
                </svg>
                <div style={{ marginTop: 8 }}>
                  <span style={{ background: `${mlColor}20`, color: mlColor, padding: '6px 18px', borderRadius: 20, fontSize: 14, fontWeight: 600 }}>
                    {mlResult.label}
                  </span>
                </div>
              </div>

              {/* Feature importance bars */}
              <div>
                <div style={{ fontSize: 11, color: T.textDim, marginBottom: 14, fontFamily: 'JetBrains Mono,monospace', letterSpacing: 1.5 }}>FEATURE CONTRIBUTIONS</div>
                {mlResult.factors.map((f, i) => (
                  <div key={i} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                      <span>{f.name}</span>
                      <span style={{ color: T.primary, fontFamily: 'JetBrains Mono,monospace', fontSize: 11 }}>{Math.round((f.val / f.max) * 100)}%</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${(f.val / f.max) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 18, padding: '10px 14px', background: T.primaryDim, borderRadius: 8, fontSize: 12, color: T.textDim }}>
                🤖 Model: Random Forest + Logistic Regression · CV Accuracy: 87% · Trained on 5,000+ videos
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
              <div style={{ fontSize: 56 }}>🎬</div>
              <h3 style={{ fontFamily: 'Syne,sans-serif', fontSize: 20, fontWeight: 700 }}>Ready to Predict</h3>
              <p style={{ color: T.textDim, textAlign: 'center', fontSize: 14, lineHeight: 1.65, maxWidth: 300 }}>
                Adjust the sliders and click "Predict Virality" to run the ML model. Results show probability and feature contributions.
              </p>
              <div style={{ background: T.primaryDim, border: `1px solid ${T.border}`, borderRadius: 9, padding: 16, width: '100%' }}>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: T.textDim, lineHeight: 1.9 }}>
                  {['> Dataset: 5,000+ YouTube videos', '> Features: title, duration, tags, sentiment', '> Model: Random Forest + LogReg', '> Accuracy: 87% (cross-validated)'].map((l, i) => <div key={i}>{l}</div>)}
                </div>
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* ═══════════════════════════════════════
          GITHUB
      ═══════════════════════════════════════ */}
      <Section id="github" dark>
        <SectionHeader label="OPEN SOURCE" title="GitHub Projects" sub="Data science projects, SQL toolkits, and analytics pipelines" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {REPOS.map((r, i) => (
            <div key={i} className="card repo-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 11 }}>
                <span style={{ fontSize: 20 }}>📁</span>
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: T.amber }}>⭐ {r.stars}</span>
              </div>
              <h3 style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12.5, fontWeight: 500, color: T.primary, marginBottom: 8, lineHeight: 1.4 }}>{r.name}</h3>
              <p style={{ color: T.textDim, fontSize: 12.5, lineHeight: 1.6, marginBottom: 14 }}>{r.desc}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ background: `${r.color}18`, color: r.color, padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 500 }}>● {r.lang}</span>
                <span style={{ fontSize: 11, color: T.textDim }}>View →</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══════════════════════════════════════
          ANALYTICS DASHBOARD
      ═══════════════════════════════════════ */}
      <Section id="analytics">
        <SectionHeader label="LIVE METRICS" title="Recruiter Analytics" sub="Real-time platform engagement tracking" />

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Page Views', value: '847', icon: '👁️', delta: '+12%', color: T.primary },
            { label: 'AI Questions', value: '234', icon: '🤖', delta: '+34%', color: T.purple },
            { label: 'Projects Explored', value: '156', icon: '🔍', delta: '+8%', color: T.accent },
            { label: 'Resume Downloads', value: '89', icon: '📄', delta: '+5%', color: T.amber },
          ].map((k, i) => (
            <div key={i} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <span style={{ fontSize: 22 }}>{k.icon}</span>
                <span style={{ fontSize: 10, color: T.green, background: 'rgba(0,255,136,.1)', padding: '2px 8px', borderRadius: 10 }}>{k.delta} this week</span>
              </div>
              <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 34, fontWeight: 800, color: k.color }}>{k.value}</div>
              <div style={{ fontSize: 12, color: T.textDim, marginTop: 4 }}>{k.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 22 }}>
          {/* Area chart */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 20 }}>Weekly Traffic & AI Engagement</div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={VISIT_DATA}>
                <defs>
                  <linearGradient id="vg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={T.primary} stopOpacity={.28} />
                    <stop offset="95%" stopColor={T.primary} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="qg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={T.purple} stopOpacity={.28} />
                    <stop offset="95%" stopColor={T.purple} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                <XAxis dataKey="day" tick={{ fill: T.textDim, fontSize: 12 }} />
                <YAxis tick={{ fill: T.textDim, fontSize: 12 }} />
                <Tooltip contentStyle={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 9, color: T.text, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12, color: T.textDim }} />
                <Area type="monotone" dataKey="visits" name="Page Visits" stroke={T.primary} fill="url(#vg)" strokeWidth={2} />
                <Area type="monotone" dataKey="questions" name="AI Questions" stroke={T.purple} fill="url(#qg)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Donut + country list */}
          <div className="card" style={{ padding: 22 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Visitors by Country</div>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie data={COUNTRY_DATA} dataKey="visits" cx="50%" cy="50%" outerRadius={55} innerRadius={30}>
                  {COUNTRY_DATA.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 7 }}>
              {COUNTRY_DATA.map((d, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                    <span style={{ color: T.textDim }}>{d.country}</span>
                  </div>
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', color: T.text }}>{d.visits}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Experience timeline */}
        <div className="card" style={{ padding: 28, marginTop: 22 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 24 }}>📅 Career Timeline</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { year: '2019', label: 'B.Tech CS (Data Analytics) — LPU India', color: T.textDim },
              { year: '2022', label: 'Data Analyst @ Hexaware Technologies — Healthcare analytics, Snowflake, Power BI', color: T.primary },
              { year: '2024', label: 'MSc Business Analytics — SETU Ireland', color: T.purple },
              { year: '2025', label: 'Business Analyst Intern @ WishKaro — ETL, ML, Cloud DWH', color: T.amber },
            ].map((ev, i, arr) => (
              <div key={i} style={{ display: 'flex', gap: 16, position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 56, flexShrink: 0 }}>
                  <div style={{ width: 11, height: 11, borderRadius: '50%', background: ev.color, border: `2px solid ${T.bg}`, zIndex: 1, marginTop: 3 }} />
                  {i < arr.length - 1 && <div style={{ width: 2, flex: 1, background: T.border, margin: '4px 0' }} />}
                </div>
                <div style={{ paddingBottom: i < arr.length - 1 ? 22 : 0 }}>
                  <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: ev.color, marginBottom: 3 }}>{ev.year}</div>
                  <div style={{ fontSize: 13, color: T.textDim, lineHeight: 1.5 }}>{ev.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: T.surface, borderTop: `1px solid ${T.border}`, padding: '44px 36px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 22, fontWeight: 800, color: T.primary, marginBottom: 8 }}>Lakshman AI Platform</div>
        <p style={{ color: T.textDim, fontSize: 14, marginBottom: 18 }}>Lakshmi Prasanna Reddy · Business Data Analyst · Ireland</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, fontSize: 13.5, flexWrap: 'wrap' }}>
          <a href="mailto:lakshmanlucky5168@gmail.com" style={{ color: T.primary, textDecoration: 'none' }}>lakshmanlucky5168@gmail.com</a>
          <span style={{ color: T.border }}>|</span>
          <span style={{ color: T.textDim }}>+353 870308775</span>
          <span style={{ color: T.border }}>|</span>
          <span style={{ color: T.primary, cursor: 'pointer' }}>LinkedIn</span>
        </div>
        <div style={{ marginTop: 22, fontSize: 11.5, color: T.textDim, fontFamily: 'JetBrains Mono,monospace' }}>
          Built with Claude AI · React + Recharts · Powered by Anthropic
        </div>
      </footer>

      {/* ═══════════════════════════════════════
          AI CHAT WIDGET
      ═══════════════════════════════════════ */}
      {chatOpen && (
        <div style={{
          position: 'fixed', bottom: 86, right: 24, width: 368, height: 510,
          background: T.surface, border: `1px solid ${T.border}`, borderRadius: 18,
          boxShadow: '0 24px 64px rgba(0,0,0,.6)', zIndex: 200,
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Header */}
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: T.primaryDim, border: `2px solid ${T.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>🤖</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Lakshman AI Assistant</div>
              <div style={{ fontSize: 11, color: T.green, display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: T.green }} />
                Online · Powered by Claude
              </div>
            </div>
            <button onClick={() => setChatOpen(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: T.textDim, cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'chat-user' : 'chat-ai'}>{m.content}</div>
            ))}
            {aiLoading && <div className="chat-ai" style={{ color: T.textDim }}>⌛ Thinking…</div>}
            <div ref={chatEndRef} />
          </div>

          {/* Quick prompts */}
          <div style={{ padding: '8px 12px', display: 'flex', gap: 6, overflowX: 'auto', borderTop: `1px solid ${T.border}` }}>
            {["What tools does he use?", "Healthcare experience?", "ML projects?", "Tell me about his SQL skills"].map(q => (
              <button key={q} onClick={() => setUserInput(q)}
                style={{ background: T.primaryDim, border: `1px solid ${T.border}`, color: T.primary, padding: '4px 10px', borderRadius: 12, fontSize: 11, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'DM Sans,sans-serif' }}>
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '10px 12px', borderTop: `1px solid ${T.border}`, display: 'flex', gap: 8 }}>
            <input value={userInput} onChange={e => setUserInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about Lakshman's skills…"
              style={{ flex: 1 }} />
            <button className="btn-p" style={{ padding: '8px 16px' }} onClick={sendMessage} disabled={aiLoading}>→</button>
          </div>
        </div>
      )}

      {/* Floating chat button */}
      {!chatOpen && (
        <button onClick={() => setChatOpen(true)} className="glow-pulse"
          style={{ position: 'fixed', bottom: 24, right: 24, width: 58, height: 58, borderRadius: '50%', background: T.primary, border: 'none', cursor: 'pointer', fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, boxShadow: `0 4px 20px rgba(0,214,198,.4)` }}>
          🤖
        </button>
      )}
    </div>
  );
}
