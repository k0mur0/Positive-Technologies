const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

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
    isResolved: true,
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
    isResolved: true,
    riskScore: 55,
    tags: ['authentication'],
    detectionMethod: 'SIEM',
    responseTime: 30,
    attachmentsCount: 1,
    lastActivity: new Date(),
  },
  {
    id: 'INC-003',
    title: 'Data exfiltration attempt',
    severity: 'Medium',
    status: 'Investigating',
    createdAt: new Date(),
    updatedAt: new Date(),
    assignedTo: 'Alice Brown',
    sourceIp: '172.16.0.10',
    targetIp: '10.0.0.20',
    country: 'Netherlands',
    attackType: 'Data Exfiltration',
    affectedSystems: ['Admin Panel'],
    description: 'Large volume transfer detected',
    isResolved: false,
    riskScore: 55,
    tags: ['authentication'],
    detectionMethod: 'SIEM',
    responseTime: 30,
    attachmentsCount: 1,
    lastActivity: new Date(),
  },
  {
    id: 'INC-004',
    title: 'Brute Force Login',
    severity: 'Low',
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
  {
    id: 'INC-005',
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

const notificationClients = [];

function sendEvent(client, payload) {
  client.write(`data: ${JSON.stringify(payload)}\n\n`);
}

function broadcastNotification(notification) {
  notificationClients.forEach((client) => sendEvent(client, notification));
}

function createNotification(type, message, incidentId) {
  return {
    id: `${Date.now()}-${Math.round(Math.random() * 10000)}`,
    type,
    message,
    incidentId,
    createdAt: new Date().toISOString(),
  };
}

app.get('/api/notifications/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  res.write('retry: 10000\n\n');

  notificationClients.push(res);
  // Keep connection open; notifications are broadcast when CRUD actions occur.
  // Send a single welcome event to the new client.
  const welcome = createNotification('info', 'Connected to notifications stream');
  sendEvent(res, welcome);

  req.on('close', () => {
    const index = notificationClients.indexOf(res);
    if (index !== -1) {
      notificationClients.splice(index, 1);
    }
  });
});

function getIncidentById(id) {
  return incidents.find((incident) => incident.id === id);
}

function parseDate(value) {
  return value ? new Date(value) : new Date();
}

function normalizeIncident(raw) {
  return {
    ...raw,
    createdAt: parseDate(raw.createdAt),
    updatedAt: parseDate(raw.updatedAt),
    lastActivity: parseDate(raw.lastActivity),
  };
}

app.get('/api/incidents', (req, res) => {
  const search = (req.query.search || '').toLowerCase();
  const page = Number(req.query.page) || 0;
  const pageSize = Number(req.query.pageSize) || 10;
  const start = page * pageSize;
  const end = start + pageSize;
  const sortField = req.query.sortField;
  const sortDirection = req.query.sortDirection;
  const showResolved = req.query.showResolved;
  const isResolved = req.query.isResolved;
  const severity = req.query.severity;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  let resultIncidents = [...incidents];

  const severityOrder = {
    Critical: 1,
    High: 2,
    Medium: 3,
    Low: 4,
  };

  if (search) {
    resultIncidents = resultIncidents.filter(
      (incident) =>
        incident.id.toLowerCase().includes(search) ||
        incident.title.toLowerCase().includes(search),
    );
  }

  if (severity) {
    resultIncidents = resultIncidents.filter(
      (incident) => incident.severity === severity,
    );
  }

  if (isResolved !== undefined) {
    const resolvedBool = isResolved === 'true';
    resultIncidents = resultIncidents.filter(
      (incident) => incident.isResolved === resolvedBool,
    );
  } else if (showResolved === 'false') {
    resultIncidents = resultIncidents.filter(
      (incident) => !incident.isResolved,
    );
  }

  if (startDate) {
    const startDateFilter = new Date(startDate);
    resultIncidents = resultIncidents.filter(
      (incident) => new Date(incident.createdAt) >= startDateFilter,
    );
  }

  if (endDate) {
    const endDateFilter = new Date(endDate);
    resultIncidents = resultIncidents.filter(
      (incident) => new Date(incident.createdAt) <= endDateFilter,
    );
  }

  if (sortField && sortDirection) {
    resultIncidents.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'severity') {
        aValue = severityOrder[aValue];
        bValue = severityOrder[bValue];
      }

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  const paginatedItems = resultIncidents.slice(start, end);

  res.json({
    items: paginatedItems,
    total: resultIncidents.length,
    page,
    pageSize,
  });
});

app.get('/api/incidents/:id', (req, res) => {
  const incident = getIncidentById(req.params.id);
  if (!incident) {
    return res.status(404).json({ message: 'Incident not found' });
  }
  res.json(incident);
});

app.post('/api/incidents', (req, res) => {
  const data = req.body;
  const id = `INC-${String(incidents.length + 1).padStart(3, '0')}`;
  const incident = normalizeIncident({
    ...data,
    id,
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
    lastActivity: data.lastActivity || new Date().toISOString(),
  });
  incidents.unshift(incident);
  const notification = createNotification('success', `Incident ${incident.id} created`, incident.id);
  broadcastNotification(notification);
  res.status(201).json(incident);
});

app.put('/api/incidents/:id', (req, res) => {
  const incident = getIncidentById(req.params.id);
  if (!incident) {
    return res.status(404).json({ message: 'Incident not found' });
  }
  const data = req.body;
  Object.assign(incident, normalizeIncident({
    ...incident,
    ...data,
    id: incident.id,
    createdAt: data.createdAt || incident.createdAt,
    updatedAt: data.updatedAt || new Date().toISOString(),
    lastActivity: data.lastActivity || incident.lastActivity,
  }));
  const notification = createNotification('info', `Incident ${incident.id} updated`, incident.id);
  broadcastNotification(notification);
  res.json(incident);
});

app.delete('/api/incidents/:id', (req, res) => {
  const index = incidents.findIndex((incident) => incident.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Incident not found' });
  }
  const [deleted] = incidents.splice(index, 1);
  const notification = createNotification('warning', `Incident ${deleted.id} deleted`, deleted.id);
  broadcastNotification(notification);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
