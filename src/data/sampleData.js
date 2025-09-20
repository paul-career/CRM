export const sampleClients = [
  {
    id: 1,
    name: 'John Smith',
    company: 'Tech Solutions Inc.',
    contact: '+1 (555) 123-4567',
    email: 'john.smith@techsolutions.com',
    status: 'active',
    location: 'New York, USA',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    company: 'Marketing Pro LLC',
    contact: '+1 (555) 234-5678',
    email: 'sarah.j@marketingpro.com',
    status: 'active',
    location: 'London, UK',
    createdAt: '2024-01-20'
  },
  {
    id: 3,
    name: 'Michael Brown',
    company: 'Design Studio',
    contact: '+1 (555) 345-6789',
    email: 'mike@designstudio.com',
    status: 'inactive',
    location: 'Paris, France',
    createdAt: '2024-01-10'
  },
  {
    id: 4,
    name: 'Emily Davis',
    company: 'Consulting Group',
    contact: '+1 (555) 456-7890',
    email: 'emily.davis@consulting.com',
    status: 'pending',
    location: 'Tokyo, Japan',
    createdAt: '2024-01-25'
  },
  {
    id: 5,
    name: 'Robert Wilson',
    company: 'Innovation Labs',
    contact: '+1 (555) 567-8901',
    email: 'robert.w@innovationlabs.com',
    status: 'active',
    location: 'Sydney, Australia',
    createdAt: '2024-01-18'
  }
];

export const sampleLeads = [
  {
    id: 1,
    leadName: 'Alex Thompson',
    source: 'Website',
    contact: '+1 (555) 111-2222',
    email: 'alex.thompson@email.com',
    status: 'not-started',
    assignedTo: 'admin@crm.com',
    company: 'Thompson Enterprises',
    notes: 'Interested in enterprise solution',
    createdAt: '2025-08-01T10:00:00Z',
    callHistory: []
  },
  {
    id: 2,
    leadName: 'Lisa Chen',
    source: 'LinkedIn',
    contact: '+1 (555) 222-3333',
    email: 'lisa.chen@company.com',
    status: 'in-progress',
    assignedTo: 'sales@crm.com',
    company: 'Chen Industries',
    notes: 'Follow up on pricing discussion',
    createdAt: '2025-08-02T11:30:00Z',
    callHistory: [
      {
        id: 1,
        date: '2025-08-03T14:00:00Z',
        notes: 'Initial contact made, interested in demo',
        nextFollowUp: '2025-08-06'
      }
    ]
  },
  {
    id: 3,
    leadName: 'David Rodriguez',
    source: 'Referral',
    contact: '+1 (555) 333-4444',
    email: 'david.r@startup.com',
    status: 'completed',
    assignedTo: 'sales@crm.com',
    company: 'Rodriguez Startup',
    notes: 'Deal closed successfully',
    createdAt: '2025-07-28T09:00:00Z',
    callHistory: [
      {
        id: 1,
        date: '2025-07-29T15:20:00Z',
        notes: 'Demo completed, very interested',
        nextFollowUp: '2025-08-01'
      },
      {
        id: 2,
        date: '2025-08-01T10:00:00Z',
        notes: 'Negotiated terms, ready to close',
        nextFollowUp: null
      }
    ]
  },
  {
    id: 4,
    leadName: 'Jennifer White',
    source: 'Cold Call',
    contact: '+1 (555) 444-5555',
    email: 'jennifer.white@corp.com',
    status: 'follow-up',
    assignedTo: 'user@crm.com',
    company: 'White Corporation',
    notes: 'Needs budget approval from management',
    createdAt: '2025-08-04T16:00:00Z',
    callHistory: [
      {
        id: 1,
        date: '2025-08-05T11:00:00Z',
        notes: 'Spoke with decision maker, waiting for approval',
        nextFollowUp: '2025-08-12'
      }
    ]
  },
  {
    id: 5,
    leadName: 'Mark Anderson',
    source: 'Trade Show',
    contact: '+1 (555) 555-6666',
    email: 'mark.anderson@business.com',
    status: 'not-started',
    assignedTo: 'sales@crm.com',
    company: 'Anderson Business Solutions',
    notes: 'Met at tech conference, interested in consultation',
    createdAt: '2025-08-09T12:00:00Z',
    callHistory: []
  }
];
