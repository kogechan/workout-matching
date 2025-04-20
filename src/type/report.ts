export type ReportStatus = 'pending' | 'reviewing' | 'resolved' | 'dismissed';

export interface Report {
  id: string;
  reporter_id: string;
  reported_id: string;
  reason: string;
  details?: string | null;
  status: ReportStatus;
  created_at: string;
  updated_at: string;
}
