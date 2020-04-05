/* eslint-disable react/display-name */
import * as React from 'react';
import './style.scss';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import LoadingWrapper from '../../components/LoadingWrapper';
import api from '../../api';
import markup from '../../utils/markup';
import AttentionBlock from '../../components/AttentionBlock';

type IPageRouterProps = {
    id: string;
};

type IPageProps = RouteComponentProps<IPageRouterProps>;

type IPageContent = {
    title: string;
    content: React.ReactChild;
}

type IPageState = {
    loading: boolean;
    id?: string;
    content?: IPageContent;
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
        regexp: /\[([^\]]+)\]\(([^)]+)\)/img,
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
        regexp: /\[ul\]((\[li\]([^[]+))+)\[\/ul\]/img, // todo: не работает при налчии квадратных скобок внутри li-шек
        handle: ([, items], key) => {
            return (
                <ul key={key}>
                    {items.split('[li]').slice(1).map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            )
        },
    }
])

class Page extends React.Component<IPageProps, IPageState> {
    constructor(props: IPageProps) {
        super(props);

        this.state = {
            loading: true,
            id: this.getPageId(),
        };
    }

    private getPageId = () => this.props.match.params.id;

    componentDidMount() {
        this.getPageContent();
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
            const content = await api<IPageContent>('internal.getPage', { id });

            content.content = this.parseContent(content.content as string);

            this.setState({
                loading: false,
                content,
                error: undefined
            });
        } catch (e) {
            let message = e.message;
            if (e.errorId === 0x1c) {
                message = 'страница не найдена';
            }
            this.setState({
                loading: false,
                error: `Ошибка: ${message}`,
            });
        }
    };

    private parseContent = (text: string) => replacer(text);

    render() {
        const { loading, content, error } = this.state;
        return (
            <div className="page" key={this.getPageId()}>
                <LoadingWrapper
                    loading={loading}
                    render={() => !error ? (
                        <>
                            <h1>{content.title}</h1>
                            {content.content}
                        </>
                    ) : (
                        <AttentionBlock type="error" show={true} text={() => error} />
                    )} />
            </div>
        );
    }
}

export default withRouter(Page);
