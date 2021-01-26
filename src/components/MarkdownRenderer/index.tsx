import * as React from 'react';
import './style.scss';
import classNames from 'classnames';
import ReactMarkdown, { MarkdownToJSX } from 'markdown-to-jsx';
import { mdReplace } from '../../utils/md-replace';
import DynamicTooltip from '../DynamicTooltip';
import { Link } from 'react-router-dom';

type IMarkdownRendererProps = React.PropsWithChildren<{
    className?: string;
}>;

type IUserLinkProps = { username: string };

// noinspection SpellCheckingInspection
const userlink: React.FC<IUserLinkProps> = (props: IUserLinkProps) => (
    <DynamicTooltip type='user' id={props.username}>
        <Link to={`/user/${props.username}`}>@{String(props.username)}</Link>
    </DynamicTooltip>
);

type ISightLinkProps = { sightId: string; children: string };

// noinspection SpellCheckingInspection
const sightlink: React.FC<ISightLinkProps> = (props: ISightLinkProps) => (
    <DynamicTooltip type='sight' id={props.sightId}>
        <Link to={`/sight/${props.sightId}`}>{String(props.children)}</Link>
    </DynamicTooltip>
);

// noinspection JSUnusedGlobalSymbols,SpellCheckingInspection
const overrides: MarkdownToJSX.Overrides = { userlink, sightlink };

const MarkdownRenderer: React.FC<IMarkdownRendererProps> = (props: IMarkdownRendererProps) => {
    if (React.Children.count(props.children) !== 1) {
        throw new Error('Two or more children');
    }

    const text = mdReplace(String(props.children));

    return (
        <div className={classNames('markdown', props.className)}>
            <ReactMarkdown options={{ overrides }}>
                {text}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;
