import { HistoryItem } from '../types/tools';

const HISTORY_KEY = 'sleektools_history';
const MAX_HISTORY_ITEMS = 100;

export class HistoryManager {
  static getHistory(): HistoryItem[] {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (!stored) return [];

      const items = JSON.parse(stored) as HistoryItem[];
      // Convert timestamp strings back to Date objects
      return items.map(item => ({
        ...item,
        timestamp: new Date(item.timestamp),
      }));
    } catch (error) {
      console.error('Error loading history:', error);
      return [];
    }
  }

  static addToHistory(item: Omit<HistoryItem, 'id' | 'timestamp'>): void {
    if (typeof window === 'undefined') return;

    try {
      const history = this.getHistory();

      // Check if this is a duplicate of the most recent item for this tool
      const lastItemForTool = history.find(h => h.toolId === item.toolId);
      if (
        lastItemForTool &&
        lastItemForTool.input === item.input &&
        lastItemForTool.output === item.output
      ) {
        // Don't add duplicate entries
        return;
      }

      const newItem: HistoryItem = {
        ...item,
        id: this.generateId(),
        timestamp: new Date(),
      };

      // Add to beginning of array
      history.unshift(newItem);

      // Keep only the latest items
      const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);

      localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  }

  static getHistoryByTool(toolId: string): HistoryItem[] {
    return this.getHistory().filter(item => item.toolId === toolId);
  }

  static deleteHistoryItem(id: string): void {
    if (typeof window === 'undefined') return;

    try {
      const history = this.getHistory();
      const filtered = history.filter(item => item.id !== id);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting history item:', error);
    }
  }

  static clearHistory(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  }

  static clearHistoryByTool(toolId: string): void {
    if (typeof window === 'undefined') return;

    try {
      const history = this.getHistory();
      const filtered = history.filter(item => item.toolId !== toolId);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error clearing tool history:', error);
    }
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
