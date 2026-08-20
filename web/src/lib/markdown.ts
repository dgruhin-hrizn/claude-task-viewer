import { marked } from 'marked';
import DOMPurify from 'dompurify';

/** Bundled rather than loaded from a CDN. The vanilla app pulled both from
 *  jsDelivr with no SRI, and when either global was missing the detail panel
 *  threw mid-template-literal and kept showing the previous task. */
export function renderMarkdown(md: string): string {
  return DOMPurify.sanitize(marked.parse(md, { async: false }) as string);
}
