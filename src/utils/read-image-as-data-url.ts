export const readImageAsDataUrl = (file: File): Promise<string> => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result as string));
    reader.addEventListener('error', error => reject(error));
    reader.readAsDataURL(file);
});
