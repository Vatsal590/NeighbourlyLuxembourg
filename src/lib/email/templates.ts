import { SITE } from '@/lib/constants'

export function emailLayout(title: string, body: string) {
  return `<!doctype html><html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8fafc;padding:24px;color:#0f172a">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0">
    <tr><td style="padding:24px 24px 0 24px"><h1 style="font-size:22px;margin:0">${escape(title)}</h1></td></tr>
    <tr><td style="padding:16px 24px 24px 24px;line-height:1.6;font-size:16px">${body}</td></tr>
    <tr><td style="padding:12px 24px;background:#f1f5f9;font-size:13px;color:#475569">${SITE.name} · ${SITE.url}</td></tr>
  </table></body></html>`
}

export function welcomeEmail(fullName: string, role: string) {
  return {
    subject: `Welcome to ${SITE.name}`,
    html: emailLayout(`Welcome, ${fullName}!`, `<p>We are happy to have you join us as a <strong>${role}</strong>. ${SITE.name} helps older adults in Luxembourg stay independent and connected.</p><p>You can update your profile and preferences any time from your account.</p>`)
  }
}

export function urgentRequestEmail(title: string, link: string) {
  return {
    subject: `Urgent request: ${title}`,
    html: emailLayout('An urgent request was created', `<p>An urgent help request was just created in your area.</p><p><strong>${escape(title)}</strong></p><p><a href="${link}" style="display:inline-block;background:#0ea5e9;color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none">Open request</a></p>`)
  }
}

export function verificationStatusEmail(status: 'approved' | 'rejected', notes?: string) {
  return {
    subject: `Volunteer verification: ${status}`,
    html: emailLayout(
      `Verification ${status}`,
      `<p>Your volunteer verification has been <strong>${status}</strong>.</p>${notes ? `<p>${escape(notes)}</p>` : ''}<p>Thank you for helping build a kinder Luxembourg.</p>`
    )
  }
}

function escape(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!))
}
