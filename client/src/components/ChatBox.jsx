import { useState } from 'react';
import api from '../services/api.js';
import { parseMealPlanResponse } from '../utils/aiFormatting.js';

export default function ChatBox({ userProfile }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Build a simple prompt including user profile (if provided)
      let prompt = '';
      if (userProfile) {
        prompt += `User profile:\nName: ${userProfile.name || 'N/A'}\nAge: ${userProfile.age || 'N/A'}\n`;
        prompt += `WeightKg: ${userProfile.weightKg || 'N/A'}\nHeightCm: ${userProfile.heightCm || 'N/A'}\nGoal: ${userProfile.goal || 'N/A'}\n`;
        // Add dietary preferences, allergies, preferred cuisine if available
        if (userProfile.dietaryPreferences) prompt += `Dietary preferences: ${userProfile.dietaryPreferences}\n`;
        if (userProfile.allergies) prompt += `Allergies: ${userProfile.allergies}\n`;
        if (userProfile.preferredCuisine) prompt += `Preferred cuisine: ${userProfile.preferredCuisine}\n`;
        prompt += '\n';
      }

      prompt += 'Conversation:\n';
      messages.concat(userMsg).forEach((m) => {
        prompt += `${m.role}: ${m.text}\n`;
      });

      // Gemini 2.0 API payload structure
      const payload = {
        contents: [
          {
            parts: [
              {
                text: `You are a nutrition assistant specializing in Sri Lankan cuisine. ${prompt}\nRespond with recommended meals and short advice.`
              }
            ]
          }
        ]
      };

      const res = await api.post('/ai/chat', { payload });
      const aiResponse = res.data.aiResponse || {};

      // Parse Gemini 2.0 response format
      let replyText = '';
      if (aiResponse.candidates && aiResponse.candidates[0]) {
        // Gemini 2.0 response structure
        const candidate = aiResponse.candidates[0];
        if (candidate.content && candidate.content.parts) {
          replyText = candidate.content.parts.map(part => part.text || '').join('');
        }
      }
      
      // Fallback to other possible formats
      if (!replyText && typeof aiResponse === 'string') replyText = aiResponse;
      if (!replyText && aiResponse?.text) replyText = aiResponse.text;
      if (!replyText) replyText = JSON.stringify(aiResponse, null, 2);

      setMessages((m) => [...m, { role: 'assistant', text: replyText }]);
    } catch (err) {
      console.error('Chat error', err);
      // Prefer the server-provided message when available to aid debugging
      const serverMessage = err?.response?.data?.message || err?.message || 'Could not reach AI service.';
      setMessages((m) => [...m, { role: 'assistant', text: `Error: ${serverMessage}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="card">
      <div className="space-y-3 max-h-96 overflow-y-auto p-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === 'user'
                ? 'rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-900'
                : 'rounded-2xl border border-emerald-100 bg-white p-4 text-slate-900 shadow-sm'
            }
          >
            {m.role === 'assistant' ? (
              <AssistantMessage text={m.text} />
            ) : (
              <div className="text-sm whitespace-pre-wrap">{m.text}</div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-3">
        <textarea
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask for meal recommendations (press Enter to send)..."
          className="w-full rounded-xl border border-slate-200 px-3 py-2"
        />
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={sendMessage}
            disabled={loading}
            className="px-4 py-2 rounded-full bg-brand-primary text-white font-semibold hover:bg-brand-dark"
          >
            {loading ? 'Thinking…' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

const AssistantMessage = ({ text }) => {
  const parsed = parseMealPlanResponse(text);

  if (!parsed) {
    return <UnstructuredMessage text={text} />;
  }

  return (
    <div className="space-y-4 text-sm text-slate-800">
      {parsed.intro && <p className="text-base font-medium leading-relaxed text-slate-900">{parsed.intro}</p>}

      {(parsed.title || parsed.keyPrinciples?.length) && (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4">
          {parsed.title && <h3 className="text-lg font-semibold text-slate-900">{parsed.title}</h3>}
          {parsed.keyPrinciples?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {parsed.keyPrinciples.map((principle, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm"
                >
                  {principle}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {parsed.mealSections?.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Recommended meals</p>
          <div className="grid gap-4 md:grid-cols-2">
            {parsed.mealSections.map((meal, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{meal.subtitle || `Meal ${idx + 1}`}</p>
                    <h4 className="text-base font-semibold text-slate-900">{meal.title}</h4>
                  </div>
                </div>
                {meal.items?.length > 0 && (
                  <ul className="mt-3 space-y-2 text-sm text-slate-700">
                    {meal.items.map((item, foodIdx) => (
                      <li key={foodIdx} className="rounded-lg bg-white/70 px-3 py-2 shadow-sm">
                        <span className="font-semibold text-slate-900">{item.label}</span>
                        {item.description && <span className="text-slate-600"> — {item.description}</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {parsed.snacks?.length > 0 && (
        <div className="rounded-2xl border border-slate-100 bg-white p-4">
          <h4 className="text-base font-semibold text-slate-900">Snack ideas to hit macros</h4>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700 marker:text-emerald-500">
            {parsed.snacks.map((snack, idx) => (
              <li key={idx} className="leading-relaxed">
                {snack}
              </li>
            ))}
          </ul>
        </div>
      )}

      {parsed.advice?.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h4 className="text-base font-semibold text-slate-900">Short advice</h4>
          <ol className="mt-2 space-y-2 pl-5 text-sm text-slate-700 list-decimal marker:text-emerald-500">
            {parsed.advice.map((tip, idx) => (
              <li key={idx} className="leading-relaxed">
                {tip}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

const UnstructuredMessage = ({ text }) => {
  const clean = text
    .replace(/\*\*/g, '')
    .replace(/---+/g, '')
    .trim();

  return (
    <div className="space-y-2 text-sm text-slate-800">
      {clean.split(/\n\s*\n/).map((paragraph, idx) => (
        <p key={idx} className="leading-relaxed whitespace-pre-line">
          {paragraph}
        </p>
      ))}
    </div>
  );
};
