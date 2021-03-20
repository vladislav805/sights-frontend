const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
} as const;

export function escapeHtml(text: string): string {
    return text.replace(/[&<>"']/g, (m: keyof typeof map) => map[m]);
}
