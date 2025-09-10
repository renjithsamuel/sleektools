import { IToolUsage, IAppUsage, ISystemHealth, IDailyUsage, ICategoryUsage } from '../types/Admin';

export const mockToolUsages: IToolUsage[] = [
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    category: 'Formatters',
    usageCount: 15420,
    lastUsed: new Date('2024-03-15T14:30:00'),
    averageSessionTime: 180,
    isEnabled: true,
  },
  {
    id: 'base64-encoder',
    name: 'Base64 Encoder/Decoder',
    category: 'Converters',
    usageCount: 8932,
    lastUsed: new Date('2024-03-15T13:45:00'),
    averageSessionTime: 120,
    isEnabled: true,
  },
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    category: 'Generators',
    usageCount: 12847,
    lastUsed: new Date('2024-03-15T16:20:00'),
    averageSessionTime: 90,
    isEnabled: true,
  },
  {
    id: 'text-compare',
    name: 'Text Compare',
    category: 'Utilities',
    usageCount: 6521,
    lastUsed: new Date('2024-03-15T11:15:00'),
    averageSessionTime: 240,
    isEnabled: true,
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    category: 'Validators',
    usageCount: 9876,
    lastUsed: new Date('2024-03-15T15:50:00'),
    averageSessionTime: 150,
    isEnabled: true,
  },
  {
    id: 'sql-formatter',
    name: 'SQL Formatter',
    category: 'Formatters',
    usageCount: 4321,
    lastUsed: new Date('2024-03-15T10:30:00'),
    averageSessionTime: 200,
    isEnabled: false,
  },
  {
    id: 'xml-formatter',
    name: 'XML Formatter',
    category: 'Formatters',
    usageCount: 3456,
    lastUsed: new Date('2024-03-14T18:45:00'),
    averageSessionTime: 160,
    isEnabled: true,
  },
  {
    id: 'yaml-validator',
    name: 'YAML Validator',
    category: 'Validators',
    usageCount: 2890,
    lastUsed: new Date('2024-03-15T09:20:00'),
    averageSessionTime: 140,
    isEnabled: true,
  },
];

export const mockAppUsage: IAppUsage = {
  totalUsers: 25847,
  activeUsers: 3421,
  totalSessions: 89234,
  averageSessionDuration: 285,
  totalToolUsages: 156789,
  popularTool: 'JSON Formatter',
};

export const mockSystemHealth: ISystemHealth = {
  status: 'healthy',
  cpuUsage: 23.5,
  memoryUsage: 67.8,
  responseTime: 142,
  uptime: '99.98',
  errorRate: 0.02,
};

export const mockDailyUsage: IDailyUsage[] = [
  { date: '2024-03-09', usage: 1240 },
  { date: '2024-03-10', usage: 1180 },
  { date: '2024-03-11', usage: 1350 },
  { date: '2024-03-12', usage: 1420 },
  { date: '2024-03-13', usage: 1380 },
  { date: '2024-03-14', usage: 1500 },
  { date: '2024-03-15', usage: 1680 },
];

export const mockCategoryUsage: ICategoryUsage[] = [
  { category: 'Formatters', usage: 42, color: '#4F46E5' },
  { category: 'Converters', usage: 28, color: '#DC2626' },
  { category: 'Generators', usage: 18, color: '#7C2D12' },
  { category: 'Validators', usage: 12, color: '#059669' },
];
