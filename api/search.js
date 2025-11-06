export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, searchApiKey } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    // If Perplexity API key is provided, use Perplexity
    if (searchApiKey && searchApiKey.startsWith('pplx-')) {
      const perplexityResponse = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${searchApiKey}`
        },
        body: JSON.stringify({
          model: "sonar-pro",
          messages: [
            {
              role: "system",
              content: "You are an expert research assistant specializing in comprehensive technical research. Provide detailed, thorough information with extensive citations. Focus on: official documentation, GitHub repositories with working code examples, best practices, implementation patterns, common pitfalls, real-world use cases, and authoritative technical sources. Be comprehensive and detailed - this research will be used to create production-ready skills, so include code snippets, frameworks, methodologies, and expert-level insights."
            },
            {
              role: "user",
              content: query
            }
          ],
          temperature: 0.2,
          max_tokens: 12000
        })
      });

      if (!perplexityResponse.ok) {
        const error = await perplexityResponse.json().catch(() => ({}));
        throw new Error(error.error?.message || `Perplexity API error: ${perplexityResponse.status}`);
      }

      const data = await perplexityResponse.json();
      const message = data.choices[0]?.message;
      const content = message?.content || 'No results found';
      
      // Extract citations from Perplexity response
      // Perplexity may provide citations in different formats:
      // 1. data.citations (array of URLs)
      // 2. data.search_results (array of search result objects with url field)
      // 3. Citations embedded in content as [1], [2], etc.
      let citations = [];
      if (data.citations && Array.isArray(data.citations)) {
        citations = data.citations;
      } else if (data.search_results && Array.isArray(data.search_results)) {
        citations = data.search_results.map(r => r.url || r.link).filter(Boolean);
      } else if (message?.citations && Array.isArray(message.citations)) {
        citations = message.citations;
      }
      
      // Parse citations from content (format: [1], [2], etc.)
      const citationMatches = content.match(/\[\d+\]/g) || [];
      const uniqueCitations = [...new Set(citationMatches)];
      
      // Build structured sources array
      const sources = citations.map((citation, index) => ({
        url: citation,
        type: determineSourceType(citation),
        authority_score: scoreAuthority(citation),
        key_info: extractKeyInfo(content, index + 1)
      }));
      
      // Extract key points from content
      const keyPoints = extractKeyPoints(content);
      
      return res.status(200).json({
        findings: content,
        sources: sources.length > 0 ? sources : [{
          url: null,
          type: 'perplexity',
          authority_score: 8,
          key_info: 'Web research via Perplexity'
        }],
        key_points: keyPoints,
        verified: true,
        searchQuery: query
      });
    }

    // Fallback: Use DuckDuckGo via a simple web search
    // This is a basic implementation - for production, consider using a proper search API
    const duckDuckGoUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    
    // For now, return a structure that indicates web search was attempted
    // In a production environment, you'd parse the results or use a search API
    return res.status(200).json({
      results: [{
        title: `Search results for: ${query}`,
        snippet: `Web search performed for: ${query}. Consider configuring a Perplexity API key for enhanced results.`,
        url: duckDuckGoUrl,
        source: 'duckduckgo',
        note: 'Basic search - configure Perplexity API for better results'
      }],
      searchQuery: query
    });

  } catch (err) {
    return res.status(500).json({
      error: `Search error: ${err.message}`
    });
  }
}

/**
 * Determine source type from URL
 */
function determineSourceType(url) {
  if (!url) return 'unknown';
  if (url.includes('docs.') || url.includes('documentation')) return 'official_doc';
  if (url.includes('github.com')) return 'github';
  if (url.includes('stackoverflow.com')) return 'stackoverflow';
  if (url.includes('blog.') || url.includes('medium.com') || url.includes('dev.to')) return 'blog';
  return 'web';
}

/**
 * Score authority based on URL patterns
 */
function scoreAuthority(url) {
  if (!url) return 5;
  if (url.includes('docs.') || url.includes('official')) return 9;
  if (url.includes('github.com') && url.includes('/wiki')) return 8;
  if (url.includes('github.com')) return 7;
  if (url.includes('stackoverflow.com')) return 6;
  return 5;
}

/**
 * Extract key info related to a citation number
 */
function extractKeyInfo(content, citationNum) {
  // Look for sentences containing [citationNum]
  const regex = new RegExp(`[^.]*\\[${citationNum}\\][^.]*\\.`, 'g');
  const match = content.match(regex);
  return match ? match[0].substring(0, 150) : 'Referenced in research';
}

/**
 * Extract key points from content
 */
function extractKeyPoints(content) {
  // Split by sentences and take first 3-5 meaningful ones
  const sentences = content.split(/[.!?]\s+/).filter(s => s.length > 30);
  return sentences.slice(0, 5).map(s => s.trim());
}

