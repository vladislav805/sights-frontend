import * as React from 'react';
import './style.scss';
import classNames from 'classnames';
import ReactMarkdown from 'markdown-to-jsx';
import { mdReplace } from '../../utils/md-replace';

type IMarkdownRendererProps = React.PropsWithChildren<{
    className?: string;
}>;

const MarkdownRenderer: React.FC<IMarkdownRendererProps> = (props: IMarkdownRendererProps) => {
    if (React.Children.count(props.children) !== 1) {
        throw new Error('Two or more children');
    }

    const text = mdReplace(String(props.children));

    return (
        <div className={classNames('markdown', props.className)}>
            <ReactMarkdown
                options={{
                    disableParsingRawHTML: true,
                }}>
                {text}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;
