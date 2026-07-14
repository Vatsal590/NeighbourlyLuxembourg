import { Resend } from 'resend'

let _resend: Resend | null = null
export function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  if (!_resend) _resend = new Resend(key)
  return _resend
}

export interface EmailMessage {
  to: string
  subject: string
  html: string
  text?: string
  from?: string
}

export async function sendEmail(msg: EmailMessage) {
  const resend = getResend()
  const from = msg.from ?? 'Neighbourly Luxembourg <noreply@neighbourly.lu>'
  if (!resend) {
    // eslint-disable-next-line no-console
    console.warn('[email] Resend not configured, skipping', { to: msg.to, subject: msg.subject })
    return { ok: false, skipped: true }
  }
  try {
    const { data, error } = await resend.emails.send({ from, to: msg.to, subject: msg.subject, html: msg.html, text: msg.text })
    if (error) return { ok: false, error }
    return { ok: true, id: data?.id }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Unknown error' }
  }
}
