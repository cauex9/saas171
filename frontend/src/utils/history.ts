import type { AnalysisResult } from '../types';

const STORAGE_KEY = 'socialdash_analyses_history';

export function getAnalysesHistory(): AnalysisResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is AnalysisResult => Boolean(item && typeof item === 'object' && typeof item.id === 'string' && typeof item.name === 'string'))
      : [];
  } catch (error) {
    console.error('Falha ao ler histórico:', error);
    return [];
  }
}

export function saveAnalysisToHistory(analysis: AnalysisResult): AnalysisResult[] {
  const updated = [analysis, ...getAnalysesHistory().filter(item => item.id !== analysis.id)];
  // Propagate quota/security failures: do not claim an analysis was saved if it wasn't.
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function clearAnalysesHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getAnalysisById(id: string): AnalysisResult | undefined {
  return getAnalysesHistory().find(item => item.id === id);
}
