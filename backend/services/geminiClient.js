/**
 * Thin wrapper around the Gemini generateContent REST endpoint.
 * Keeps all the HTTP/response-shape details in one place so controllers
 * just deal with plain strings in and out.
 */

const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";

/**
 * @param {string} systemInstruction
 * @param {Array<{role: 'user'|'assistant', content: string}>} history
 * @param {string} userMessage
 * @returns {Promise<string>}
 */
export const callGeminiCoach = async (
  systemInstruction,
  history,
  userMessage
) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    const error = new Error(
      "AI coach is not configured (missing GEMINI_API_KEY)"
    );
    error.statusCode = 503;
    throw error;
  }

  const contents = [
    ...history.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    {
      role: "user",
      parts: [{ text: userMessage }],
    },
  ];

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_MODEL}:generateContent`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents,
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 400,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();

    console.error("Gemini API Error:");
    console.error(errorBody);

    const error = new Error(
      `Gemini API error (${response.status}): ${errorBody}`
    );
    error.statusCode = 502;
    throw error;
  }

  const data = await response.json();

  const reply =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!reply) {
    const error = new Error(
      "AI coach did not return a valid response"
    );
    error.statusCode = 502;
    throw error;
  }

  return reply.trim();
};

/**
 * Generates structured JSON responses.
 *
 * @param {string} systemInstruction
 * @param {string} userPrompt
 * @returns {Promise<object>}
 */
export const callGeminiJSON = async (
  systemInstruction,
  userPrompt
) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    const error = new Error(
      "AI features are not configured (missing GEMINI_API_KEY)"
    );
    error.statusCode = 503;
    throw error;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_MODEL}:generateContent`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }],
        },
      ],
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();

    console.error("Gemini API Error:");
    console.error(errorBody);

    const error = new Error(
      `Gemini API error (${response.status}): ${errorBody}`
    );
    error.statusCode = 502;
    throw error;
  }

  const data = await response.json();

  const rawText =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    const error = new Error(
      "AI did not return a valid response"
    );
    error.statusCode = 502;
    throw error;
  }

  try {
    return JSON.parse(rawText);
  } catch {
    const error = new Error("AI returned malformed JSON");
    error.statusCode = 502;
    throw error;
  }
};