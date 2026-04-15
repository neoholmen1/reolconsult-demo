import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://pwkdqyczahdlsragcoep.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3a2RxeWN6YWhkbHNyYWdjb2VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MjYxMjYsImV4cCI6MjA4ODIwMjEyNn0.eMSnoDwcrtfbG_Aq6OB0zccgC7rRzckAgwh7-42MeTA'
)
