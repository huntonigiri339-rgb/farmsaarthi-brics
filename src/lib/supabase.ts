import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://otygxihmvtenuxakjtlv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90eWd4aWhtdnRlbnV4YWtqdGx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4NjkzNzEsImV4cCI6MjEwNjQ0NTM3MX0.0GK7PefFth18tuRM0zyMZF3d0N364zlEWxhUqbDM3ck'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)