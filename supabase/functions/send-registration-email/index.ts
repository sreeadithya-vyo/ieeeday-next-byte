import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, eventTitle, type, note } = await req.json();

    let subject = "";
    let html = "";

    if (type === "submitted") {
      subject = `Registration Received - ${eventTitle}`;
      html = `
        <h1>Registration Received!</h1>
        <p>Dear ${name},</p>
        <p>We have received your registration for <strong>${eventTitle}</strong>.</p>
        <p>Your payment proof is currently under review. You will receive a confirmation email once it's approved.</p>
        <p>Thank you for registering!</p>
        <p>Best regards,<br>IEEE Day 2025 Team</p>
      `;
    } else if (type === "confirmed") {
      subject = `✅ Registration Confirmed - ${eventTitle}`;
      html = `
        <h1>Registration Confirmed! ✅</h1>
        <p>Dear ${name},</p>
        <p>Congratulations! Your registration for <strong>${eventTitle}</strong> has been confirmed.</p>
        <p>Your payment has been verified and you're all set for the event.</p>
        <p>Event Details:</p>
        <ul>
          <li>Event: ${eventTitle}</li>
          <li>Please check the event page for timings and venue details</li>
        </ul>
        <p>We look forward to seeing you there!</p>
        <p>Best regards,<br>IEEE Day 2025 Team</p>
      `;
    } else if (type === "rejected") {
      subject = `❌ Payment Verification Issue - ${eventTitle}`;
      html = `
        <h1>Payment Verification Issue</h1>
        <p>Dear ${name},</p>
        <p>We're sorry to inform you that we couldn't verify your payment for <strong>${eventTitle}</strong>.</p>
        ${note ? `<p>Reason: ${note}</p>` : ""}
        <p>Please contact the chapter chair or re-submit your payment proof with the correct transaction details.</p>
        <p>If you have any questions, please don't hesitate to reach out.</p>
        <p>Best regards,<br>IEEE Day 2025 Team</p>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "IEEE Day 2025 <onboarding@resend.dev>",
      to: [email],
      subject,
      html,
    });

    return new Response(
      JSON.stringify(emailResponse),
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
