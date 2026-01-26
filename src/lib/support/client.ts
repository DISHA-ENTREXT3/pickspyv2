import { createSupportClient } from "@entrext/support-client";

export const supportClient = createSupportClient({
  endpoint: import.meta.env.VITE_SUPPORT_URL || "https://ldewwmfkymjmokopulys.supabase.co/functions/v1/submit-support",
  anonKey: import.meta.env.VITE_SUPPORT_ANON_KEY || ""
});
