import { createClient } from '@supabase/supabase-js';
import { Database } from '../schema';

export const supabase = createClient<Database>(
  'https://xrflzqomcvbmhaganhbf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyZmx6cW9tY3ZibWhhZ2FuaGJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzk2Mjk5MzUsImV4cCI6MTk5NTIwNTkzNX0.4spptG-RdgVvLBjQcfjptqv0fpT8sf-5rQnPq0yD3z4'
);
