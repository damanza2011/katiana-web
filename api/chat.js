/**
 * KATIANA Droguería Online · Vercel Serverless Function: AI Concierge
 * Conexión segura con Gemini API para orientación farmacéutica
 */

export default async function handler(req, res) {
  // CORS y cabeceras
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Use POST.' });
  }

  const { message, history } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Mensaje requerido.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  if (!apiKey) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY no configurada en las variables de entorno de Vercel.',
      fallback: true
    });
  }

  const systemPrompt = `Eres la Dra. Katiana, químico farmacéutica orientadora digital de Droguerías KATIANA (Colombia).
Tu rol es orientar de forma cálida, profesional, ética y rigurosa a pacientes y clientes online.

REGLAS FARMACÉUTICAS ESTRICTAS:
1. NUNCA diagnostiques enfermedades graves ni prescribas antibióticos o medicamentos de control especial.
2. Ante síntomas de alarma (dolor precordial, asfixia, pérdida de conciencia, sangrado profuso), ordena acudir a Urgencias o llamar al 123.
3. Para medicamentos de venta libre (acetaminofén, ibuprofeno, loratadina, antiácidos, sueros orales), explica el principio activo, posología común segura para adultos y precauciones.
4. Recuerda siempre que si tienen fórmula médica, pueden subirla con el botón "Subir Fórmula" para despacho express en 45 minutos.
5. Los envíos son GRATIS a partir de $50.000 COP y tardan menos de 45 minutos.
6. Sé concisa (máximo 3 párrafos cortos) y usa viñetas amigables.`;

  try {
    const contents = [];

    // Incluir historial breve si existe
    if (Array.isArray(history)) {
      for (const h of history.slice(-6)) {
        contents.push({
          role: h.role === 'bot' ? 'model' : 'user',
          parts: [{ text: h.text }]
        });
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        contents,
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 500
        }
      })
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini API Error:', errText);
      return res.status(502).json({ error: 'Error comunicándose con Gemini API.', details: errText });
    }

    const data = await geminiRes.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No pude generar una respuesta.';

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Handler Error:', error);
    return res.status(500).json({ error: 'Error interno en el asistente virtual.' });
  }
}
