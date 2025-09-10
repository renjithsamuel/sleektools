export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: ToolCategory;
  route: string;
  featured?: boolean;
}

export interface ToolCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

export interface HistoryItem {
  id: string;
  toolId: string;
  input: string;
  output: string;
  timestamp: Date;
  title?: string;
}

export interface FormatterOptions {
  indent?: number;
  sortKeys?: boolean;
  minify?: boolean;
}
