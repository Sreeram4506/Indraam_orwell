export type ContactSubmission = {
  id: string;
  createdAt: number;
  name?: string;
  email?: string;
  business?: string;
  phone?: string;
  message?: string;
  interests?: string[];
};

export const CONTACT_STORAGE_KEY = 'contact_submissions_v1';

export function safeParse<T>(value: string | null): T | undefined {
  if (!value) return undefined;
  try {
    return JSON.parse(value) as T;
  } catch {
    return undefined;
  }
}

export function loadContactSubmissions() {
  try {
    const existing = safeParse<ContactSubmission[]>(localStorage.getItem(CONTACT_STORAGE_KEY));
    return Array.isArray(existing) ? existing : [];
  } catch {
    return [];
  }
}

export function formatSubmissionDate(ts: number) {
  return new Date(ts).toLocaleString();
}
