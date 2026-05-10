import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  try {
    const payload = await req.json()
    console.log("Receiving Kiwify Webhook:", payload)

    // Kiwify sends order_status. We want 'paid' or 'approved'
    const status = payload.order_status
    const email = payload.customer_email

    if ((status === 'paid' || status === 'approved') && email) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

      const { data, error } = await supabase
        .from('profiles')
        .update({ is_premium: true })
        .eq('email', email)

      if (error) throw error

      console.log(`Success: Premium activated for ${email}`)
      return new Response(JSON.stringify({ message: "Premium activated" }), { status: 200 })
    }

    return new Response(JSON.stringify({ message: "Status ignored" }), { status: 200 })
  } catch (error) {
    console.error("Webhook Error:", error.message)
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }
})
