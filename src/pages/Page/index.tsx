/* eslint-disable react/display-name */
import * as React from 'react';
import './style.scss';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import API from '../../api';
import { markup } from '../../utils';
import AttentionBlock from '../../components/AttentionBlock';
import { IPageContent } from '../../api/types/page';
import { IApiError } from '../../api/types/base';
import LoadingSpinner from '../../components/LoadingSpinner';

type IPageRouterProps = {
    id: string;
};

type IPageProps = RouteComponentProps<IPageRouterProps>;

type IReactPageContent = IPageContent<React.ReactChild>;

type IPageState = {
    loading: boolean;
    id?: string;
    content?: IReactPageContent;
    error?: string;
};

const replacer = markup([
    {
        regexp: /\*\*([^*]+)\*\*/igm,
        handle: (result, key) => {
            return (
                <strong key={key}>{result[1]}</strong>
            );
        },
    },
    {
        regexp: /__([^*]+)__/igm,
        handle: (result, key) => {
            return (
                <em key={key}>{result[1]}</em>
            );
        },
    },
    {
        regexp: /\[([^\]]+)]\(([^)]+)\)/img,
        handle: ([, label, url], key) => {
            const isLocal = url.includes(window.location.hostname) || url.startsWith('/');
            return isLocal ? (
                <Link key={key} to={url}>{label}</Link>
            ) : (
                <a key={key} href={url} target="_blank" rel="noopener noreferrer">{label}</a>
            );
        },
    },
    {
        regexp: /\[ul]((\[li]([^[]+))+)\[\/ul]/img, // todo: не работает при наличии квадратных скобок внутри li-шек
        handle: ([, items], key) => {
            return (
                <ul key={key}>
                    {items.split('[li]').slice(1).map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            )
        },
    }
]);

class Page extends React.Component<IPageProps, IPageState> {
    public constructor(props: IPageProps) {
        super(props);

        this.state = {
            loading: true,
            id: this.getPageId(),
        };
    }

    private getPageId = () => this.props.match.params.id;

    componentDidMount() {
        void this.getPageContent();
    }

    componentDidUpdate() {
        const id = this.getPageId();
        if (this.state.id !== id) {
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            this.setState({ loading: true, id }, this.getPageContent);
        }
    }

    private getPageContent = async() => {
        const id = this.getPageId();
        try {
            const { title, content: text } = await API.internal.getPage(id);
            const content: IReactPageContent = {
                title,
                content: this.parseContent(text),
            };

            this.setState({
                loading: false,
                content,
                error: undefined
            });
        } catch (e) {
            const err = e as IApiError;
            let message = err.message;
            if (err.code === 0x1c) {
                message = 'страница не найдена';
            }
            this.setState({
                loading: false,
                error: `Ошибка: ${message}`,
            });
        }
    };

    private parseContent = (text: string) => replacer(text);

    public render(): JSX.Element {
        const { loading, content, error } = this.state;

        if (loading) {
            return (
                <LoadingSpinner
                    block />
            )
        }

        if (error) {
            return (
                <AttentionBlock type="error" show text={error} />
            );
        }

        return (
            <div className="page">
                <h1>{content.title}</h1>
                {content.content}
            </div>
        );
    }
}

export default withRouter(Page);
