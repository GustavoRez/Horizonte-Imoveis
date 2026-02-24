const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://nevgqmhzosgsdkwdipur.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ckc1-KF-xW7vfy22BoFFUA_ubhUh0o3';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = { supabase };
