import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  const { error } = await supabase
    .from('messages')
    .insert([{ name, email, message }]);

  if (error) {
    return res.status(500).json({ error: 'Failed to save message' });
  }

  return res.status(200).json({ success: true });
}
