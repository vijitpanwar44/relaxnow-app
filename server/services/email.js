import nodemailer from 'nodemailer'

function createTransport() {
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_PORT === '465',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    })
  }
  return null
}

export async function sendBookingNotification({ massagerEmail, massagerName, customerName, customerEmail, customerPhone, date, slot, duration, totalPrice, bookingNo, notes }) {
  const transport = createTransport()

  if (!transport) {
    console.log(`[Email] Not configured — would send to ${massagerEmail}:`)
    console.log(`  Booking ${bookingNo}: ${customerName} on ${date} at ${slot} (${duration} min, ₹${totalPrice})`)
    return
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background: linear-gradient(135deg, #44403c, #92400e); padding: 32px; border-radius: 12px 12px 0 0;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">New Booking — RelaxNow</h1>
      </div>
      <div style="background: #fff; padding: 28px; border: 1px solid #e7e5e4; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="color: #57534e; margin-top: 0;">Hi <strong>${massagerName}</strong>, you have a new booking!</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; border-radius: 8px; overflow: hidden;">
          <tr style="background: #fef3c7;">
            <td style="padding: 10px 14px; color: #78716c; font-size: 13px;">Booking #</td>
            <td style="padding: 10px 14px; font-weight: bold; color: #92400e;">${bookingNo}</td>
          </tr>
          <tr style="background: #fafaf9;">
            <td style="padding: 10px 14px; color: #78716c; font-size: 13px;">Client</td>
            <td style="padding: 10px 14px; font-weight: 600;">${customerName}</td>
          </tr>
          <tr style="background: #fff;">
            <td style="padding: 10px 14px; color: #78716c; font-size: 13px;">Date</td>
            <td style="padding: 10px 14px; font-weight: 600;">${date}</td>
          </tr>
          <tr style="background: #fafaf9;">
            <td style="padding: 10px 14px; color: #78716c; font-size: 13px;">Time</td>
            <td style="padding: 10px 14px; font-weight: 600;">${slot}</td>
          </tr>
          <tr style="background: #fff;">
            <td style="padding: 10px 14px; color: #78716c; font-size: 13px;">Duration</td>
            <td style="padding: 10px 14px; font-weight: 600;">${duration} minutes</td>
          </tr>
          <tr style="background: #fafaf9;">
            <td style="padding: 10px 14px; color: #78716c; font-size: 13px;">Amount</td>
            <td style="padding: 10px 14px; font-weight: bold; color: #b45309;">₹${Number(totalPrice).toLocaleString()}</td>
          </tr>
          ${notes ? `<tr style="background: #fff;"><td style="padding: 10px 14px; color: #78716c; font-size: 13px;">Notes</td><td style="padding: 10px 14px; font-style: italic;">${notes}</td></tr>` : ''}
        </table>
        <p style="font-size: 13px; color: #78716c; margin-bottom: 4px;">Client contact: <a href="mailto:${customerEmail}" style="color: #92400e;">${customerEmail}</a> · ${customerPhone}</p>
        <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 20px 0;" />
        <p style="font-size: 12px; color: #a8a29e; margin: 0;">RelaxNow · Premium Massage Booking Platform</p>
      </div>
    </div>
  `

  await transport.sendMail({
    from: process.env.EMAIL_FROM || '"RelaxNow" <noreply@relaxnow.com>',
    to: massagerEmail,
    subject: `New Booking ${bookingNo}: ${customerName} — ${date} at ${slot}`,
    html,
  })
}
