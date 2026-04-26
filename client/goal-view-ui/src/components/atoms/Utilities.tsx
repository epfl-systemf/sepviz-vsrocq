export function domToText(el: HTMLElement, charWidthPx: number = 7): string {
    let res = '';
    function rec(node: Node) {
        if (node.nodeType === Node.TEXT_NODE) { res += node.textContent; return; }
        if (node.nodeType !== Node.ELEMENT_NODE) return;
        const elem = node as HTMLElement;
        if (elem.tagName === 'BR') { res += '\n'; return;}
        // indentation span
        if (elem.tagName === 'SPAN' && elem.style.marginLeft) {
            const px = parseFloat(elem.style.marginLeft);
            const spaces = Math.round(px / charWidthPx);
            res += ' '.repeat(spaces);
            return; 
        }
        elem.childNodes.forEach(rec);
    }
    el.childNodes.forEach(rec);
    return res;
}
