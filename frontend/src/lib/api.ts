const BASE_URL = import.meta.env.VITE_API_URL || 'https://unicred-portal-apidebarghaya.in';

async function http<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  // Auth
  async login(input: { id: string; password: string; accessType: 'student' | 'recruiter' | 'university' }) {
    return http('/api/auth/login', { method: 'POST', body: JSON.stringify(input) });
  },
  async seedDemo() {
    return http('/api/auth/seed-demo', { method: 'POST' });
  },
  // Credentials
  issueCredential(input: {
    title: string;
    type: 'bachelor' | 'master' | 'certificate' | 'diploma';
    institution: string;
    dateIssued: string;
    studentId?: string;
    studentName?: string;
  }) {
    return http('/api/credentials', { method: 'POST', body: JSON.stringify(input) });
  },
  anchorCredential(id: string) {
    return http(`/api/credentials/${id}/anchor`, { method: 'POST' });
  },
  recruiterApprove(id: string) {
    return http(`/api/credentials/${id}/recruiter-approve`, { method: 'POST' });
  },
  studentAccept(id: string) {
    return http(`/api/credentials/${id}/student-accept`, { method: 'POST' });
  },
  verifyByHash(hash: string) {
    return http(`/api/credentials/verify/${hash}`);
  },
  searchCredentials(query: string) {
    return http(`/api/credentials/search/${encodeURIComponent(query)}`);
  },

  // Students
  getStudentCredentials(studentId: string) {
    // Only show credentials after both approvals
    return http(`/api/students/${studentId}/credentials`).then((items: any[]) => items.filter(i => i.recruiterApproved && i.studentAccepted));
  },
  listStudents() {
    return http(`/api/students`);
  },
  listCredentials(params?: { type?: string; status?: string; studentId?: string }) {
    const qs = new URLSearchParams(params as any).toString();
    return http(`/api/credentials${qs ? `?${qs}` : ''}`);
  },
  seedMockCredentials() {
    return http(`/api/credentials/seed-mock`, { method: 'POST' });
  },
  // Metrics
  getMetrics() {
    return http(`/api/metrics`);
  },
  getStudentMetrics(studentId: string) {
    return http(`/api/metrics/student/${studentId}`);
  },
};

export default api;

