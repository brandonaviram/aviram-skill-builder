/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {number} maxRetries - Maximum number of retry attempts (default: 4)
 * @param {number} initialDelay - Initial delay in milliseconds (default: 2000)
 * @returns {Promise} - Result of the function
 */
async function retryWithExponentialBackoff(fn, maxRetries = 4, initialDelay = 2000) {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;

      // Don't retry on certain errors (API key issues, validation errors, etc.)
      const statusCode = err.statusCode || 0;
      if (statusCode === 400 || statusCode === 401 || statusCode === 403) {
        throw err;
      }

      // If this was the last attempt, throw the error
      if (attempt === maxRetries) {
        throw err;
      }

      // Calculate delay with exponential backoff: 2s, 4s, 8s, 16s
      const delay = initialDelay * Math.pow(2, attempt);
      console.log(`Network error on attempt ${attempt + 1}/${maxRetries + 1}. Retrying in ${delay/1000}s...`);

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { apiKey, prompt, maxTokens = 2000 } = req.body;

  if (!apiKey) {
    return res.status(400).json({ error: 'API key is required' });
  }

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // Wrap the API call with retry logic
    const result = await retryWithExponentialBackoff(async () => {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-3-5-haiku-latest",
          max_tokens: maxTokens,
          messages: [{ role: "user", content: prompt }]
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        const err = new Error(error.error?.message || `API request failed with status ${response.status}`);
        err.statusCode = response.status;
        throw err;
      }

      return await response.json();
    });

    return res.status(200).json({ text: result.content[0].text });
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
      error: err.message || `Server error: ${err.message}`
    });
  }
}
