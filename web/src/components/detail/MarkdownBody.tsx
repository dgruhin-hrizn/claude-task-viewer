import { useMemo } from 'react';
import { renderMarkdown } from '@/lib/markdown';

export function MarkdownBody({ children }: { children: string }) {
  const html = useMemo(() => renderMarkdown(children), [children]);
  return (
    <div
      className="prose prose-sm max-w-none prose-invert prose-pre:overflow-x-auto prose-pre:bg-elevated prose-code:text-primary"
      // sanitised by DOMPurify in renderMarkdown
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
