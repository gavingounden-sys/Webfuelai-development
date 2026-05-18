// This is a temporary file - will be moved to routers.ts
// The key change: use delimiter-based parsing instead of JSON

// In the aiGeneration.generate mutation, replace the LLM call section with:

/*
          // Call Gemini 2.5 Flash to generate website content
          // Using delimiter-based format to avoid JSON escaping issues with large HTML
          const delimiterPrompt = prompt + `

IMPORTANT: Format your response EXACTLY with these delimiters:

[HTML_START]
<complete HTML/CSS code>
[HTML_END]

[TITLE_START]
Page title for SEO
[TITLE_END]

[DESCRIPTION_START]
Meta description for SEO
[DESCRIPTION_END]

[AVO_SCORE_START]
85
[AVO_SCORE_END]

[ROBOTS_TXT_START]
User-agent: *
Allow: /
[ROBOTS_TXT_END]

[LLMS_TXT_START]
Model: *
Allow: /
[LLMS_TXT_END]

[SCHEMA_MARKUP_START]
{"@context": "https://schema.org", "@type": "LocalBusiness"}
[SCHEMA_MARKUP_END]`;

          const response = await invokeLLM({
            messages: [
              {
                role: "system",
                content: "You are an expert web designer and copywriter specializing in AI-optimized websites for South African small businesses. Generate professional, conversion-focused website HTML with embedded CSS that is optimized for AI search engines like ChatGPT, Perplexity, and Google AI Overview."
              },
              {
                role: "user",
                content: delimiterPrompt
              }
            ]
          });

          // Parse the response using delimiters
          const content = response.choices[0].message.content;
          if (typeof content !== "string") {
            throw new Error("Invalid response format from LLM");
          }

          // Extract content between delimiters
          const extractDelimited = (text: string, delimiter: string): string => {
            const startTag = `[${delimiter}_START]`;
            const endTag = `[${delimiter}_END]`;
            const startIdx = text.indexOf(startTag);
            const endIdx = text.indexOf(endTag);
            
            if (startIdx === -1 || endIdx === -1) {
              throw new Error(`Missing ${delimiter} delimiters in response`);
            }
            
            return text.substring(startIdx + startTag.length, endIdx).trim();
          };

          const html = extractDelimited(content, "HTML");
          const title = extractDelimited(content, "TITLE");
          const description = extractDelimited(content, "DESCRIPTION");
          const avoScoreStr = extractDelimited(content, "AVO_SCORE");
          const robotsTxt = extractDelimited(content, "ROBOTS_TXT");
          const llmsTxt = extractDelimited(content, "LLMS_TXT");
          const schemaMarkup = extractDelimited(content, "SCHEMA_MARKUP");

          const avoScore = Math.min(100, Math.max(0, parseInt(avoScoreStr) || 85));

          const generatedData = {
            html,
            title,
            description,
            avoScore,
            avoLiteFeatures: {
              robotsTxt,
              llmsTxt,
              schemaMarkup
            }
          };
*/
