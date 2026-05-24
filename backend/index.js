const express = require('express');
const cors = require('cors');

const incidents = [
  {
    id: 'INC-001',
    title: 'SQL Injection Attempt',
    severity: 'High',
    status: 'Open',
    createdAt: new Date(),
    updatedAt: new Date(),
    assignedTo: 'John Smith',
    sourceIp: '192.168.1.15',
    targetIp: '10.0.0.5',
    country: 'Germany',
    attackType: 'SQL Injection',
    affectedSystems: ['Auth Service', 'Database'],
    description: 'Detected malicious SQL queries',
    isResolved: false,
    riskScore: 87,
    tags: ['database', 'critical'],
    detectionMethod: 'WAF',
    responseTime: 15,
    attachmentsCount: 2,
    lastActivity: new Date(),
  },
  {
    id: 'INC-002',
    title: 'Brute Force Login',
    severity: 'Medium',
    status: 'Investigating',
    createdAt: new Date(),
    updatedAt: new Date(),
    assignedTo: 'Alice Brown',
    sourceIp: '172.16.0.10',
    targetIp: '10.0.0.20',
    country: 'Netherlands',
    attackType: 'Brute Force',
    affectedSystems: ['Admin Panel'],
    description: 'Multiple failed login attempts',
    isResolved: false,
    riskScore: 55,
    tags: ['authentication'],
    detectionMethod: 'SIEM',
    responseTime: 30,
    attachmentsCount: 1,
    lastActivity: new Date(),
  },
];

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

app.get('/api/incidents', (req, res) => {
  const page = Number(req.query.page) || 0;
  const pageSize = Number(req.query.pageSize) || 10;
  const start = page * pageSize;
  const end = start + pageSize;

  const paginatedItems = incidents.slice(start, end);
  
  res.json({
    items: paginatedItems,
    total: incidents.length,
    page,
    pageSize,
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});