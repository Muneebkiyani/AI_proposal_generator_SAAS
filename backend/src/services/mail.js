const RESEND_ENDPOINT = 'https://api.resend.com/emails';

export async function sendPasswordResetEmail({ to, resetUrl }) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from =
    process.env.EMAIL_FROM ||
    process.env.RESEND_FROM ||
    'Proposal AI <onboarding@resend.dev>';

  if (apiKey) {
    const r = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: 'Reset your Proposal AI password',
        html: `
          <p>We received a request to reset your password.</p>
          <p><a href="${resetUrl}" style="font-weight:700">Set a new password</a></p>
          <p>This link expires in one hour. If you did not request this, ignore this email.</p>
        `,
      }),
    });

    const text = await r.text();
    if (!r.ok) {
      console.error('[mail] Resend error', r.status, text);
      throw new Error('Email provider rejected the send');
    }
    return { channel: 'resend' };
  }

  console.info(
    '[mail] RESEND_API_KEY not set — password reset URL (share manually in dev):\n',
    resetUrl,
  );
  return { channel: 'log' };
}
