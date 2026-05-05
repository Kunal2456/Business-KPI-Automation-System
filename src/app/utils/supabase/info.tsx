// Supabase Configuration
// Project: ShelfIQ Production

// Extract project ID from the project URL
export const projectId = 'ownnkpnqnffowxygutql';

// Public anon key (safe to use in frontend)
export const publicAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93bm5rcG5xbmZmb3d4eWd1dHFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQwNzU4MywiZXhwIjoyMDg0OTgzNTgzfQ.Iz4BWQc3VXHbAnimf9x2NUJJvp-PVDIKzVZEDivf8Ik';

// Service role key (NEVER expose in frontend - only for server-side operations)
// Store this in environment variables for production
export const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93bm5rcG5xbmZmb3d4eWd1dHFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5NDA3NTgzLCJleHAiOjIwODQ5ODM1ODN9.P1cWiEg6nldRIiPpFqpZCoBeOEBfuMNXNh2hR9GNxZQ';

// Full Supabase URL
export const supabaseUrl = `https://${projectId}.supabase.co`;

// Export for easy import
export default {
  projectId,
  publicAnonKey,
  serviceRoleKey,
  supabaseUrl
};
