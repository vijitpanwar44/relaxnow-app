// SMS via MSG91. Falls back to console.log in dev when no credentials set.
async function sendViaMSG91(phone, message) {
  const authKey = process.env.MSG91_AUTH_KEY
  const senderId = process.env.MSG91_SENDER_ID || 'RLXNOW'
  const url = `https://api.msg91.com/api/sendhttp.php?authkey=${authKey}&mobiles=91${phone}&message=${encodeURIComponent(message)}&route=4&sender=${senderId}&country=91&unicode=0`
  const res = await fetch(url)
  const text = await res.text()
  if (!res.ok || text.startsWith('ERROR')) throw new Error(`MSG91: ${text}`)
}

export async function sendSms(phone, message) {
  const clean = String(phone).replace(/\D/g, '').slice(-10)
  if (process.env.MSG91_AUTH_KEY) {
    try {
      await sendViaMSG91(clean, message)
      console.log(`[SMS sent] +91${clean}`)
    } catch (err) {
      console.error(`[SMS error]`, err.message)
      console.log(`[SMS fallback] +91${clean}: ${message}`)
    }
  } else {
    console.log(`\n[SMS - Dev] +91${clean}\n> ${message}\n`)
  }
}

export async function sendOtp(phone, otp) {
  const msg = `${otp} is your RelaxNow OTP. Valid for 10 minutes. Do not share. -RelaxNow`
  return sendSms(phone, msg)
}

export async function sendBookingConfirmationSms(phone, booking) {
  const msg = `Hi ${booking.customerName}! Booking #${booking.bookingNo} confirmed. ${booking.massagerName} on ${booking.date} at ${booking.slot}. Paid: Rs.${Number(booking.totalPrice).toLocaleString()}. -RelaxNow`
  return sendSms(phone, msg)
}
