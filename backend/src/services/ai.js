const SYSTEM_PROMPT = `You are a professional freelance proposal writer. When given a job description and my skills, write a compelling, concise client proposal under 200 words. Focus on the client's pain point, not my skills. End with a clear call to action. Tone: confident but not salesy. Return only the proposal text, no preamble.`;

export async function generateProposal({ jobDescription, mySkills }) {
  const ollamaBase = (process.env.OLLAMA_URL || 'http://127.0.0.1:11434').replace(/\/$/, '');
  const groqKey = process.env.GROQ_API_KEY;
  const groqModel = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

  const userContent = `Job description:\n${jobDescription}\n\nMy skills:\n${mySkills}`;

  if (groqKey) {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${groqKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: groqModel,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userContent },
        ],
        temperature: 0.7,
        max_tokens: 600,
      }),
    });
    if (!r.ok) {
      const t = await r.text();
      throw new Error(`Groq error ${r.status}: ${t}`);
    }
    const data = await r.json();
    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error('Empty model response');
    return text;
  }

  const r = await fetch(`${ollamaBase}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.OLLAMA_MODEL || 'llama3',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userContent },
      ],
      stream: false,
    }),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`Ollama error ${r.status}: ${t}`);
  }
  const data = await r.json();
  const text = data.message?.content?.trim();
  if (!text) throw new Error('Empty model response');
  return text;
}
