export interface IToolUsage {
  id: string;
  name: string;
  category: string;
  usageCount: number;
  lastUsed: Date;
  averageSessionTime: number;
  isEnabled: boolean;
}

export interface IAppUsage {
  totalUsers: number;
  activeUsers: number;
  totalSessions: number;
  averageSessionDuration: number;
  totalToolUsages: number;
  popularTool: string;
}

export interface ISystemHealth {
  status: string;
  cpuUsage: number;
  memoryUsage: number;
  responseTime: number;
  uptime: string;
  errorRate: number;
}

export interface IDailyUsage {
  date: string;
  usage: number;
}

export interface ICategoryUsage {
  category: string;
  usage: number;
  color: string;
}
