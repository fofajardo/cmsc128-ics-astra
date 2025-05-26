"use client";
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  frontmatterPlugin,
  directivesPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  CodeToggle,
  CreateLink,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  BlockTypeSelect,
  Separator
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { forwardRef, useState, useEffect } from "react";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";

const MDXEditorComponent = forwardRef(({ markdown, onChange, placeholder = "Start writing..." }, ref) => {
  const [textAlign, setTextAlign] = useState("left");
  const [initialMarkdown, setInitialMarkdown] = useState("");

  // Ensure markdown is always a string to avoid controlled/uncontrolled warning
  const markdownValue = markdown || "";

  const handleAlignmentChange = (alignment) => {
    setTextAlign(alignment);

    // Insert alignment div into the markdown content
    if (ref?.current && onChange) {
      const currentContent = markdownValue;

      // Wrap the current content in a div with alignment class
      let wrappedContent;

      if (currentContent.trim()) {
        // If content exists, wrap it
        if (alignment === "left") {
          // For left alignment, we don't need a wrapper (default)
          wrappedContent = currentContent.replace(/<div class="text-(center|right|justify)">(.*?)<\/div>/gs, "$2");
        } else {
          // Remove any existing alignment wrapper first
          const cleanContent = currentContent.replace(/<div class="text-(center|right|justify)">(.*?)<\/div>/gs, "$2");
          wrappedContent = `<div class="text-${alignment}">\n${cleanContent}\n</div>`;
        }
      } else {
        // If no content, just set up the wrapper for new content
        if (alignment !== "left") {
          wrappedContent = `<div class="text-${alignment}">\n\n</div>`;
        } else {
          wrappedContent = "";
        }
      }

      onChange(wrappedContent);
    }
  };

  // Handle keyboard events
  const handleKeyDown = (event) => {
    if (event.shiftKey && event.key === "Enter") {
      event.preventDefault();
      // Insert a simple line break without extra spacing
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const br = document.createElement("br");
        range.deleteContents();
        range.insertNode(br);
        range.setStartAfter(br);
        range.setEndAfter(br);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  // Detect current alignment from content only when markdown prop changes (not on every render)
  useEffect(() => {
    // Only update if the markdown actually changed from outside (not from our own changes)
    if (markdownValue !== initialMarkdown) {
      setInitialMarkdown(markdownValue);

      if (markdownValue) {
        if (markdownValue.includes("class=\"text-center\"")) {
          setTextAlign("center");
        } else if (markdownValue.includes("class=\"text-right\"")) {
          setTextAlign("right");
        } else if (markdownValue.includes("class=\"text-justify\"")) {
          setTextAlign("justify");
        } else {
          setTextAlign("left");
        }
      }
    }
  }, [markdownValue, initialMarkdown]);

  const AlignmentToolbar = () => (
    <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
      <button
        type="button"
        onClick={() => handleAlignmentChange("left")}
        className={`p-1 rounded hover:bg-gray-200 ${textAlign === "left" ? "bg-blue-500 text-white" : ""}`}
        title="Align Left"
      >
        <AlignLeft className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => handleAlignmentChange("center")}
        className={`p-1 rounded hover:bg-gray-200 ${textAlign === "center" ? "bg-blue-500 text-white" : ""}`}
        title="Align Center"
      >
        <AlignCenter className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => handleAlignmentChange("right")}
        className={`p-1 rounded hover:bg-gray-200 ${textAlign === "right" ? "bg-blue-500 text-white" : ""}`}
        title="Align Right"
      >
        <AlignRight className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => handleAlignmentChange("justify")}
        className={`p-1 rounded hover:bg-gray-200 ${textAlign === "justify" ? "bg-blue-500 text-white" : ""}`}
        title="Justify"
      >
        <AlignJustify className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="mdx-editor-wrapper">
      <MDXEditor
        ref={ref}
        markdown={markdownValue}
        onChange={onChange}
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          imagePlugin(),
          tablePlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
          codeMirrorPlugin({ codeBlockLanguages: { js: "JavaScript", css: "CSS", txt: "text", tsx: "TypeScript" } }),
          diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "" }),
          frontmatterPlugin(),
          directivesPlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <Separator />
                <BoldItalicUnderlineToggles />
                <CodeToggle />
                <Separator />
                <BlockTypeSelect />
                <Separator />
                <ListsToggle />
                <Separator />
                <AlignmentToolbar />
                <CreateLink />
                <Separator />
                <InsertTable />
                <InsertThematicBreak />
              </>
            )
          })
        ]}
        contentEditableClassName={`prose max-w-none min-h-[200px] p-4 focus:outline-none text-${textAlign}`}
      />

      <style jsx global>{`
        .mdx-editor-wrapper {
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          overflow: hidden;
        }

        .mdx-editor-wrapper .mdxeditor {
          background: white;
        }

        .mdx-editor-wrapper .mdxeditor-toolbar {
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          padding: 0.5rem;
        }

        .mdx-editor-wrapper .mdxeditor-rich-text-editor {
          min-height: 200px;
        }

        /* Apply text alignment to the editor content */
        .mdx-editor-wrapper .text-left {
          text-align: left !important;
        }

        .mdx-editor-wrapper .text-center {
          text-align: center !important;
        }

        .mdx-editor-wrapper .text-right {
          text-align: right !important;
        }

        .mdx-editor-wrapper .text-justify {
          text-align: justify !important;
        }

        /* Ensure all content in the editor follows the alignment */
        .mdx-editor-wrapper .text-center * {
          text-align: center !important;
        }

        .mdx-editor-wrapper .text-right * {
          text-align: right !important;
        }

        .mdx-editor-wrapper .text-justify * {
          text-align: justify !important;
        }

        .mdx-editor-wrapper .text-left * {
          text-align: left !important;
        }

        .mdx-editor-wrapper .prose {
          color: #374151;
          line-height: 1.6;
        }

        .mdx-editor-wrapper .prose h1 {
          font-size: 1.875rem;
          font-weight: 700;
          margin: 1rem 0 0.5rem 0;
        }

        .mdx-editor-wrapper .prose h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 1rem 0 0.5rem 0;
        }

        .mdx-editor-wrapper .prose h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0.75rem 0 0.5rem 0;
        }

        .mdx-editor-wrapper .prose p {
          margin: 0.5rem 0;
        }

        .mdx-editor-wrapper .prose ul,
        .mdx-editor-wrapper .prose ol {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }

        .mdx-editor-wrapper .prose blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #6b7280;
        }

        .mdx-editor-wrapper .prose code {
          background: #f3f4f6;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
        }

        .mdx-editor-wrapper .prose pre {
          background: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1rem 0;
        }

        .mdx-editor-wrapper .prose a {
          color: #3b82f6;
          text-decoration: underline;
        }

        .mdx-editor-wrapper .prose strong {
          font-weight: 700;
        }

        .mdx-editor-wrapper .prose em {
          font-style: italic;
        }

        .mdx-editor-wrapper .prose table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
        }

        .mdx-editor-wrapper .prose th,
        .mdx-editor-wrapper .prose td {
          border: 1px solid #e5e7eb;
          padding: 0.5rem;
          text-align: left;
        }

        .mdx-editor-wrapper .prose th {
          background: #f9fafb;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
});

MDXEditorComponent.displayName = "MDXEditorComponent";

export default MDXEditorComponent;