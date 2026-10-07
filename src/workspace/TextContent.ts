const allowedTags = new Set(['B', 'STRONG', 'I', 'EM', 'U', 'S', 'SPAN', 'DIV', 'P', 'BR', 'UL', 'OL', 'LI', 'A']);
const allowedStyles = ['color', 'font-weight', 'font-style', 'text-decoration', 'font-size', 'font-family', 'text-align'];

export class TextContent {
  static sanitize(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const clean = (node: Node): Node | null => {
      if (node.nodeType === Node.TEXT_NODE) return document.createTextNode(node.textContent || '');
      if (!(node instanceof HTMLElement) || ['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'IMG'].includes(node.tagName)) return null;
      const target = document.createElement(allowedTags.has(node.tagName) ? node.tagName.toLowerCase() : 'span');
      allowedStyles.forEach(key => { const value = node.style.getPropertyValue(key); if (value && !/url\(|expression/i.test(value)) target.style.setProperty(key, value); });
      if (node.tagName === 'A' && /^(https?:|mailto:)/i.test(node.getAttribute('href') || '')) { target.setAttribute('href', node.getAttribute('href')!); target.setAttribute('target', '_blank'); target.setAttribute('rel', 'noopener noreferrer'); }
      node.childNodes.forEach(child => { const result = clean(child); if (result) target.appendChild(result); });
      return target;
    };
    const container = document.createElement('div');
    doc.body.childNodes.forEach(node => { const result = clean(node); if (result) container.appendChild(result); });
    return container.innerHTML;
  }
  static plain(html: string): string {
    const doc = new DOMParser().parseFromString(html.replace(/<br\s*\/?\s*>/gi, '\n').replace(/<\/(div|p|li)>/gi, '\n'), 'text/html');
    return doc.body.textContent?.replace(/\n$/, '') || '';
  }
}
