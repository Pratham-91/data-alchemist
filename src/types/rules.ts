export interface BusinessRule {
  id: string;
  name: string;
  description: string;
  type: 'validation' | 'transformation' | 'constraint';
  status: 'active' | 'inactive' | 'draft';
  conditions: string[];
  actions: string[];
  priority: 'low' | 'medium' | 'high';
}

export const defaultRules: BusinessRule[] = [
  {
    id: '1',
    name: 'Client Priority Validation',
    description: 'Ensure client priority levels are between 1-5',
    type: 'validation',
    status: 'active',
    conditions: ['PriorityLevel >= 1', 'PriorityLevel <= 5'],
    actions: ['Flag as invalid if out of range'],
    priority: 'high',
  },
  {
    id: '2',
    name: 'Worker Skill Matching',
    description: 'Match worker skills with task requirements',
    type: 'constraint',
    status: 'active',
    conditions: ['Worker.Skills contains Task.RequiredSkills'],
    actions: ['Assign worker to task', 'Log assignment'],
    priority: 'medium',
  },
  {
    id: '3',
    name: 'Task Duration Limit',
    description: 'Limit task duration to maximum 30 days',
    type: 'validation',
    status: 'draft',
    conditions: ['Task.Duration <= 30'],
    actions: ['Warn if duration exceeds limit'],
    priority: 'low',
  },
]; 