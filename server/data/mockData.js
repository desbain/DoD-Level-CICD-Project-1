const missions = [
  {
    id: 'OP-7741',
    name: 'IRON SENTINEL',
    type: 'Reconnaissance',
    status: 'Active',
    priority: 'High',
    location: 'Sector 7-Alpha',
    commander: 'COL Rodriguez',
    personnel: 48,
    startDate: '2026-02-10T06:00:00Z',
    progress: 72
  },
  {
    id: 'OP-7742',
    name: 'STEEL THUNDER',
    type: 'Logistics',
    status: 'Active',
    priority: 'Critical',
    location: 'FOB Bravo',
    commander: 'LTC Nakamura',
    personnel: 156,
    startDate: '2026-02-08T14:30:00Z',
    progress: 45
  },
  {
    id: 'OP-7743',
    name: 'NIGHT HAWK',
    type: 'Surveillance',
    status: 'Pending',
    priority: 'Medium',
    location: 'Grid Reference 4419',
    commander: 'MAJ Chen',
    personnel: 24,
    startDate: '2026-02-15T22:00:00Z',
    progress: 0
  },
  {
    id: 'OP-7744',
    name: 'GHOST WALKER',
    type: 'Intelligence',
    status: 'Active',
    priority: 'Critical',
    location: 'Sector 3-Delta',
    commander: 'COL Petrov',
    personnel: 12,
    startDate: '2026-02-05T03:00:00Z',
    progress: 88
  },
  {
    id: 'OP-7745',
    name: 'DAWN PATROL',
    type: 'Patrol',
    status: 'Complete',
    priority: 'Low',
    location: 'Perimeter Zone 6',
    commander: 'CPT Williams',
    personnel: 32,
    startDate: '2026-02-01T05:00:00Z',
    progress: 100
  },
  {
    id: 'OP-7746',
    name: 'COBRA STRIKE',
    type: 'Training',
    status: 'Active',
    priority: 'High',
    location: 'Range Complex Delta',
    commander: 'LTC Okafor',
    personnel: 200,
    startDate: '2026-02-12T08:00:00Z',
    progress: 33
  }
];

const personnel = {
  total: 2847,
  deployed: 1203,
  available: 1089,
  onLeave: 312,
  training: 243,
  breakdown: [
    { branch: 'Infantry', count: 890, ready: 756 },
    { branch: 'Armor', count: 420, ready: 385 },
    { branch: 'Aviation', count: 315, ready: 280 },
    { branch: 'Engineering', count: 380, ready: 342 },
    { branch: 'Signals', count: 290, ready: 268 },
    { branch: 'Medical', count: 275, ready: 250 },
    { branch: 'Logistics', count: 277, ready: 260 }
  ]
};

const equipment = {
  categories: [
    { name: 'Ground Vehicles', total: 340, operational: 298, readiness: 87.6 },
    { name: 'Aircraft', total: 85, operational: 71, readiness: 83.5 },
    { name: 'Communications', total: 1200, operational: 1140, readiness: 95.0 },
    { name: 'Weapons Systems', total: 2800, operational: 2716, readiness: 97.0 },
    { name: 'Medical Equipment', total: 450, operational: 432, readiness: 96.0 },
    { name: 'Engineering Assets', total: 180, operational: 153, readiness: 85.0 }
  ],
  overallReadiness: 91.2
};

const alerts = [
  {
    id: 'ALT-001',
    severity: 'critical',
    title: 'Perimeter Breach Detected - Sector 4',
    message: 'Unauthorized movement detected at checkpoint Charlie. QRF deployed.',
    timestamp: '2026-02-14T23:42:00Z',
    acknowledged: false
  },
  {
    id: 'ALT-002',
    severity: 'high',
    title: 'Communications Disruption - Grid 7',
    message: 'Intermittent signal loss on encrypted channel BRAVO-9. Investigating.',
    timestamp: '2026-02-14T23:15:00Z',
    acknowledged: false
  },
  {
    id: 'ALT-003',
    severity: 'medium',
    title: 'Supply Convoy Delayed - Route ALPHA',
    message: 'Convoy ETA pushed 4 hours due to weather. Adjusted logistics timeline.',
    timestamp: '2026-02-14T22:30:00Z',
    acknowledged: true
  },
  {
    id: 'ALT-004',
    severity: 'low',
    title: 'Scheduled Maintenance - Radar Array 3',
    message: 'Planned downtime 0200-0600 for firmware update. Backup systems active.',
    timestamp: '2026-02-14T21:00:00Z',
    acknowledged: true
  },
  {
    id: 'ALT-005',
    severity: 'high',
    title: 'ISR Asset Reallocation Required',
    message: 'Drone coverage gap identified in Sector 3-Delta. Requesting reallocation.',
    timestamp: '2026-02-14T20:45:00Z',
    acknowledged: false
  },
  {
    id: 'ALT-006',
    severity: 'critical',
    title: 'Cybersecurity Incident - Network Segment 12',
    message: 'Anomalous traffic pattern detected. SOC investigating potential intrusion.',
    timestamp: '2026-02-14T20:12:00Z',
    acknowledged: false
  },
  {
    id: 'ALT-007',
    severity: 'medium',
    title: 'Personnel Rotation Alert',
    message: 'Rotation schedule for FOB Bravo updated. 42 personnel affected.',
    timestamp: '2026-02-14T19:30:00Z',
    acknowledged: true
  }
];

module.exports = { missions, personnel, equipment, alerts };
