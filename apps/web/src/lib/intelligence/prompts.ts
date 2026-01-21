/**
 * Ultimate Content Intelligence Prompt (Action 8.2)
 * Full 16-section prompt for YouTube video intelligence.
 */
export const ULTIMATE_INTELLIGENCE_PROMPT = `
Extract comprehensive intelligence from the following YouTube transcript. 
Output the result in a structured JSON format with the following 16 sections:

1. Header Intelligence: Video meta-details
2. Strategic Context: Why does this content matter now?
3. Executive Overview: 3-sentence summary for leadership
4. Sentiment Analysis: Speaker's tone and conviction levels
5. Content Map (Acts): Structural breakdown with timestamps
6. Priority Insights: Top 5 actionable takeaways
7. Comparison Tables: Feature/system comparisons found
8. Q&A Extraction: Key questions answered in the video
9. Implementation Systems: Step-by-step frameworks mentioned
10. Entity Database: People, tools, companies, and concepts
11. Power Quotes: High-impact verbatim statements
12. Semantic Layer: Key terms and their specialized definitions
13. Discovery Pathways: Suggested follow-up searches
14. Scenario Analysis: "If X, then Y" applications
15. Forward Intelligence: Predictions or future trends
16. Risk Disclosures: Warnings or limitations mentioned

TRANSCRIPT:
{{transcript}}
`;
