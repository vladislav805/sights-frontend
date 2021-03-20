import './style.scss';

type IToastOptions = {
    duration?: number;
};

export default class Toast {
    private static defaultOptions: IToastOptions = {
        duration: 5000,
    };

    private toast: HTMLDivElement;

    private content: HTMLDivElement;

    public constructor(text: string, options: IToastOptions = Toast.defaultOptions) {
        this.init();
        this.setText(text);

        if (options.duration && options.duration !== Infinity) {
            setTimeout(() => this.hide(), options.duration);
        }
    }

    private init(): void {
        this.toast = document.createElement('div');
        this.content = document.createElement('div');

        this.toast.className = 'toast-entry';
        this.content.className = 'toast-content';

        this.toast.appendChild(this.content);
    }

    private static readonly CLASS_CLOSE = 'toast-entry__close';

    public show(): Toast {
        const width = Toast.measureTextWidth(this.content.textContent);

        this.toast.style.setProperty('--toast-content-computed-width', `${width}px`);
        Toast.getRoot().appendChild(this.toast);
        return this;
    }

    private static measureTextWidth(text: string): number {
        const textNode = document.createElement('span');
        textNode.textContent = text;
        textNode.className = 'toast-measurer';
        Toast.getRoot().appendChild(textNode);
        const rect = textNode.getBoundingClientRect();
        Toast.getRoot().removeChild(textNode);
        return Math.ceil(rect.width) + 1;
    }

    public hide(): Toast {
        this.toast.classList.add(Toast.CLASS_CLOSE);
        this.toast.addEventListener('animationend', () => {
            Toast.getRoot().removeChild(this.toast);
        });
        return this;
    }

    public setText(text: string): Toast {
        this.content.textContent = text;
        return this;
    }

    private static root: HTMLDivElement;

    private static getRoot(): HTMLDivElement {
        if (!Toast.root) {
            const root = document.createElement('div');
            root.className = 'toast-root';
            Toast.root = root;
            document.body.appendChild(root);
        }
        return Toast.root;
    }
}

export function showToast(text: string, options?: IToastOptions): Toast {
    return new Toast(text, options).show();
}
