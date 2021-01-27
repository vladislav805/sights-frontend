function fallbackCopyTextToClipboard(text: string) {
    const textArea = document.createElement('textarea');
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = '-9999px';
    textArea.style.left = '-9999px';
    textArea.style.position = 'absolute';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        return document.execCommand('copy');
    } catch (err) {
        return false;
    } finally {
        document.body.removeChild(textArea);
    }
}
export default function copyTextToClipboard(text: string): Promise<void> {
    if (!navigator.clipboard) {
        return new Promise((resolve, reject) => fallbackCopyTextToClipboard(text) ? resolve() : reject());
    }

    return navigator.clipboard.writeText(text);
}
