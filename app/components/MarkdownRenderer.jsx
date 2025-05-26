"use client";
import { useMemo } from "react";

const MarkdownRenderer = ({ content }) => {
  const htmlContent = useMemo(() => {
    if (!content) return "";

    // Trim content to remove leading/trailing whitespace and newlines
    let html = content.trim();

    // First handle HTML entities
    html = html
      // Decode HTML entities
      .replace(/&#x20;/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, "\"")
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'");

    // Remove newlines immediately after opening HTML tags and before closing tags
    html = html
      .replace(/(<[^>]+>)\s*\n+\s*/g, "$1")  // Remove newlines after opening tags
      .replace(/\s*\n+\s*(<\/[^>]+>)/g, "$1"); // Remove newlines before closing tags

    // Convert remaining newlines to br tags with minimal spacing
    html = html.replace(/\n/g, "<br style=\"display: block; margin: 0.25em 0; line-height: 1;\">");

    // Process markdown syntax
    html = html
      // Headers
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")

      // Bold
      .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
      .replace(/__(.*?)__/gim, "<strong>$1</strong>")

      // Italic
      .replace(/\*(.*?)\*/gim, "<em>$1</em>")
      .replace(/_(.*?)_/gim, "<em>$1</em>")

      // Code
      .replace(/`(.*?)`/gim, "<code>$1</code>")

      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, "<a href=\"$2\" target=\"_blank\" rel=\"noopener noreferrer\">$1</a>")

      // Lists
      .replace(/^\* (.*$)/gim, "<li>$1</li>")
      .replace(/^- (.*$)/gim, "<li>$1</li>")
      .replace(/^\d+\. (.*$)/gim, "<li>$1</li>")

      // Blockquotes
      .replace(/^> (.*$)/gim, "<blockquote>$1</blockquote>");

    // Wrap list items in ul tags
    html = html.replace(/(<li>.*<\/li>)/gims, "<ul>$1</ul>");

    return html;
  }, [content]);

  return (
    <div
      className="prose prose-slate max-w-none"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      style={{
        lineHeight: "1.6",
        color: "#374151"
      }}
    />
  );
};

export default MarkdownRenderer;