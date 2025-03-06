
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vfqkcunfmcleomwgyzos.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcWtjdW5mbWNsZW9td2d5em9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNjUyMDQsImV4cCI6MjA1Njg0MTIwNH0.YF1pBs0xz7jS_djwKX3AG2dFZeKWUP4TBhtjWcgc9k8";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
