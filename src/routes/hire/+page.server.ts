import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { Actions } from './$types';

export const prerender = false;

const FROM = 'Benjamin Blanke <buissness@blanke.lol>';
const INBOX = 'buissness@blanke.lol';

function escapeHtml(value: string) {
	return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char] ?? char);
}

async function sendEmail(payload: Record<string, unknown>) {
	const response = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${env.RESEND_API_KEY}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(payload)
	});
	if (!response.ok) throw new Error(`Resend failed: ${response.status}`);
}

export const actions: Actions = {
	default: async ({ request, getClientAddress }) => {
		if (!env.RESEND_API_KEY) return fail(500, { error: 'Email service is not configured.' });

		const form = await request.formData();
		const name = String(form.get('name') ?? '').trim();
		const email = String(form.get('email') ?? '').trim();
		const company = String(form.get('company') ?? '').trim();
		const project = String(form.get('project') ?? '').trim();
		const budget = String(form.get('budget') ?? '').trim();
		const message = String(form.get('message') ?? '').trim();
		const website = String(form.get('website') ?? '').trim();

		// Honeypot: return success without sending.
		if (website) return { success: true };
		if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || message.length < 10)
			return fail(400, { error: 'Please complete the required fields.' });
		if ([name, email, company, project, budget, message].some((v) => v.length > 3000))
			return fail(400, { error: 'One or more fields are too long.' });

		const safe = Object.fromEntries(Object.entries({ name, email, company, project, budget, message }).map(([k, v]) => [k, escapeHtml(v)]));
		const ref = crypto.randomUUID().slice(0, 8).toUpperCase();

		try {
			await sendEmail({
				from: FROM,
				to: [INBOX],
				reply_to: email,
				subject: `New inquiry — ${name} · ${ref}`,
				html: `<div style="background:#080808;color:#e5e5e5;padding:32px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace"><div style="max-width:640px;margin:auto;border:1px solid #333;padding:28px"><div style="color:#777;font-size:12px">BLANKE.LOL / NEW INQUIRY / ${ref}</div><h1 style="font-size:24px;margin:18px 0">Someone wants to build something.</h1><p><b>${safe.name}</b> &lt;${safe.email}&gt;</p><p>Company: ${safe.company || '—'}<br>Project: ${safe.project || '—'}<br>Budget: ${safe.budget || '—'}</p><div style="border-top:1px solid #333;margin-top:24px;padding-top:24px;white-space:pre-wrap">${safe.message}</div></div></div>`
			});

			await sendEmail({
				from: FROM,
				to: [email],
				reply_to: INBOX,
				subject: `Got it, ${name.split(' ')[0]} — ${ref}`,
				html: `<!doctype html><html><body style="margin:0;background:#080808;color:#e8e8e8;font-family:Arial,sans-serif"><div style="padding:48px 18px"><div style="max-width:580px;margin:auto"><div style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;color:#8a8a8a;font-size:12px;letter-spacing:.08em">BLANKE.LOL / INQUIRY RECEIVED</div><div style="border:1px solid #2d2d2d;background:#0d0d0d;margin-top:18px;padding:34px"><div style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;color:#aaa;font-size:13px">$ message --received</div><h1 style="font-size:28px;line-height:1.2;margin:24px 0 12px;color:#fff">Thanks, ${safe.name}.</h1><p style="font-size:16px;line-height:1.7;color:#bdbdbd;margin:0">Your message made it through. I’ll take a look and get back to you personally if the project looks like a fit.</p><div style="border-top:1px solid #292929;margin:28px 0"></div><table style="width:100%;font-size:13px;color:#888"><tr><td style="padding:5px 0">Reference</td><td style="text-align:right;color:#ddd">${ref}</td></tr><tr><td style="padding:5px 0">Project</td><td style="text-align:right;color:#ddd">${safe.project || 'General inquiry'}</td></tr></table><div style="margin-top:30px;font-size:14px;color:#aaa">— Benjamin<br><a href="https://blanke.lol" style="color:#fff;text-decoration:none">blanke.lol</a></div></div><p style="text-align:center;color:#555;font-size:11px;margin-top:18px">Sent because you submitted the Hire Me form on blanke.lol.</p></div></div></body></html>`
			});

			return { success: true, ref };
		} catch (error) {
			console.error('Hire form email error', { error, ip: getClientAddress() });
			return fail(502, { error: 'Could not send your message. Please try again.' });
		}
	}
};
