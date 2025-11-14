// Proxy controller: forwards the provided payload to the external Gemini API URL
// and returns the provider response. Keep API key in server env: GEMINI_API_KEY
export const proxyChat = async (req, res) => {
  try {
    const apiUrl = process.env.GEMINI_API_URL;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiUrl || !apiKey) {
      return res.status(500).json({ message: 'GEMINI_API_URL and GEMINI_API_KEY must be set on the server.' });
    }

    const payload = req.body?.payload || req.body;

    // Use global fetch (Node 18+) or installed fetch polyfill. If fetch is unavailable,
    // this will throw and return a helpful error to the server logs.
    // Some providers (e.g., Google Generative Language) require API key as query param
    // when using an API key (starts with 'AIza'). Detect and adjust the request.
    let requestUrl = apiUrl;
    const headers = { 'Content-Type': 'application/json' };
    if (apiUrl.includes('generativelanguage.googleapis.com') && apiKey && apiKey.startsWith('AIza')) {
      // Append key as query parameter
      requestUrl = apiUrl.includes('?') ? `${apiUrl}&key=${apiKey}` : `${apiUrl}?key=${apiKey}`;
    } else if (apiKey) {
      headers.Authorization = `Bearer ${apiKey}`;
    }

    const response = await fetch(requestUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    // Read raw text first so we can handle non-JSON or empty responses gracefully
    const raw = await response.text();

    if (!raw) {
      console.error('AI provider returned empty body, status', response.status);
      return res.status(502).json({ message: 'AI provider returned empty response', status: response.status });
    }

    let data;
    try {
      data = JSON.parse(raw);
    } catch (parseErr) {
      console.error('AI provider returned non-JSON response:', raw.slice(0, 1000));
      return res.status(502).json({ message: 'AI provider returned invalid JSON', status: response.status, body: raw });
    }

    // If the provider responded with non-OK status, forward useful details
    if (!response.ok) {
      console.error('AI provider error', response.status, data);
      return res.status(502).json({ message: 'AI provider error', status: response.status, details: data });
    }

    // Return the provider response as-is under `aiResponse` key
    res.json({ aiResponse: data });
  } catch (error) {
    console.error('AI proxy error:', error);
    res.status(500).json({ message: 'AI proxy failed', error: error.message });
  }
};
