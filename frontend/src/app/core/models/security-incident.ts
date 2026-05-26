export interface SecurityIncident {
  id: string;
  title: string;
  severity: 'Low' | 'Medium' | 'High' ;
  status: 'Open' | 'Investigating' | 'Resolved';
  createdAt: Date;
  updatedAt: Date;
  assignedTo: string;
  sourceIp: string;
  targetIp: string;
  country: string;
  attackType: string;
  affectedSystems: string[];
  description: string;
  isResolved: boolean;
  riskScore: number;
  tags: string[];
  detectionMethod: string;
  responseTime: number;
  attachmentsCount: number;
  lastActivity: Date;
}
