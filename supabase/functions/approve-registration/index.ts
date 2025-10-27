import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { registration_id, action, note } = await req.json();

    if (!registration_id || !action) {
      return new Response(
        JSON.stringify({ error: "registration_id and action are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify the user's token
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user is admin
    const { data: roles } = await supabaseClient
      .from("user_roles")
      .select("role, chapter")
      .eq("user_id", user.id);

    const isAdmin = roles?.some(r => 
      r.role === "elite_master" || r.role === "super_admin" || r.role === "event_admin"
    );

    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: "Insufficient permissions" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get registration and event details
    const { data: registration, error: regError } = await supabaseClient
      .from("registrations")
      .select("*, events(title, chapter, registration_amount)")
      .eq("id", registration_id)
      .single();

    if (regError || !registration) {
      return new Response(
        JSON.stringify({ error: "Registration not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check chapter access for event admins
    const eventAdminRole = roles?.find(r => r.role === "event_admin");
    if (eventAdminRole && eventAdminRole.chapter !== registration.events.chapter) {
      return new Response(
        JSON.stringify({ error: "You can only manage registrations for your chapter" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update registration
    const updateData: any = {
      verified_by: user.id,
      verified_at: new Date().toISOString(),
    };

    if (action === "verify") {
      updateData.payment_status = "verified";
      updateData.status = "confirmed";
    } else if (action === "reject") {
      updateData.payment_status = "rejected";
      updateData.status = "rejected";
      if (note) {
        updateData.rejection_note = note;
      }
    }

    const { error: updateError } = await supabaseClient
      .from("registrations")
      .update(updateData)
      .eq("id", registration_id);

    if (updateError) {
      throw updateError;
    }

    // Create payment record when verified
    if (action === "verify") {
      const IEEE_DISCOUNT = 50;
      const baseAmount = Number(registration.events.registration_amount) || 200;
      const finalAmount = registration.is_ieee_member ? Math.max(baseAmount - IEEE_DISCOUNT, 0) : baseAmount;

      console.log('Creating payment record:', {
        registration_id,
        amount: finalAmount,
        is_ieee_member: registration.is_ieee_member,
        base_amount: baseAmount,
        transaction_id: registration.transaction_id
      });

      const { data: paymentData, error: paymentError } = await supabaseClient
        .from("payments")
        .insert({
          registration_id: registration_id,
          amount: finalAmount,
          method: "phonepe",
          status: "verified",
          verified_by: user.id,
          verified_at: new Date().toISOString(),
          transaction_id: registration.transaction_id,
          proof_url: registration.payment_proof_url,
          currency: "INR",
        })
        .select();

      if (paymentError) {
        console.error('Error creating payment record:', paymentError);
        throw new Error(`Failed to create payment record: ${paymentError.message}`);
      }

      console.log('Payment record created successfully:', paymentData);
    }

    // Log audit trail
    await supabaseClient
      .from("audit_logs")
      .insert({
        user_id: user.id,
        action: action === "verify" ? "APPROVE_PAYMENT" : "REJECT_PAYMENT",
        resource_type: "registration",
        resource_id: registration_id,
        metadata: { note },
      });

    // Send email notification
    await supabaseClient.functions.invoke("send-registration-email", {
      body: {
        email: registration.participant_email,
        name: registration.participant_name,
        eventTitle: registration.events.title,
        type: action === "verify" ? "confirmed" : "rejected",
        note,
      },
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
