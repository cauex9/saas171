import { createClient } from '@supabase/supabase-js';
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = url && key ? createClient(url, key) : null;
export async function authHeaders(): Promise<Record<string,string>> {
  const { data } = await supabase?.auth.getSession() ?? { data: { session: null } };
  if (!data.session?.access_token) throw new Error('Faça login para usar esta função.');
  return { Authorization: `Bearer ${data.session.access_token}` };
}
