export interface ScrapePlugin {
  id: string;
  name: string;
  namespace: string;
  spec?: any; // JSON holding spec object
  source?: string;
  created_by?: string;
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
}