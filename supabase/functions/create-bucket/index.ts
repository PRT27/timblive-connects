
// Supabase Edge Function to create storage buckets
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Admin key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    // Create profiles bucket if it doesn't exist
    const { data: profilesBucket, error: profilesError } = await supabaseAdmin.storage.createBucket(
      "profiles",
      {
        public: true,
        fileSizeLimit: 1024 * 1024, // 1MB
        allowedMimeTypes: ["image/png", "image/jpeg", "image/gif"],
      }
    );

    if (profilesError && !profilesError.message.includes("already exists")) {
      throw profilesError;
    }

    // Create content bucket if it doesn't exist
    const { data: contentBucket, error: contentError } = await supabaseAdmin.storage.createBucket(
      "content",
      {
        public: true,
        fileSizeLimit: 50 * 1024 * 1024, // 50MB
        allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "video/mp4", "audio/mpeg", "audio/mp3"],
      }
    );

    if (contentError && !contentError.message.includes("already exists")) {
      throw contentError;
    }

    return new Response(
      JSON.stringify({
        message: "Storage buckets created successfully",
        profiles: profilesBucket || "Bucket already exists",
        content: contentBucket || "Bucket already exists",
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 500,
      }
    );
  }
});
