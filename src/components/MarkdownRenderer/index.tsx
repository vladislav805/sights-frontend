/* eslint-disable react/destructuring-assignment,jsx-a11y/no-noninteractive-element-interactions,react/no-unused-prop-types */
import * as React from 'react';
import './style.scss';
import classNames from 'classnames';
import ReactMarkdown, { MarkdownToJSX } from 'markdown-to-jsx';
import { Link } from 'react-router-dom';
import { mdReplace } from '../../utils/md-replace';
import DynamicTooltip from '../DynamicTooltip';
import { IPhoto } from '../../api/types/photo';

type IMarkdownPhotoClick = (photoId: number) => void;

type IMarkdownRendererProps = React.PropsWithChildren<{
    className?: string;
    photos?: Map<number, IPhoto>;
    onClickPhoto?: IMarkdownPhotoClick;
}>;

type IUserLinkProps = { username: string };

// noinspection SpellCheckingInspection
const userlink: React.FC<IUserLinkProps> = (props: IUserLinkProps) => (
    <DynamicTooltip type="user" id={props.username}>
        <Link to={`/user/${props.username}`}>@{String(props.username)}</Link>
    </DynamicTooltip>
);

type ISightLinkProps = { sightId: string; children: string };

// noinspection SpellCheckingInspection
const sightlink: React.FC<ISightLinkProps> = (props: ISightLinkProps) => (
    <DynamicTooltip type="sight" id={props.sightId}>
        <Link to={`/sight/${props.sightId}`}>{String(props.children)}</Link>
    </DynamicTooltip>
);

type IPhotoRowProps = { children: string; };

// noinspection SpellCheckingInspection
const photorow: React.FC<IPhotoRowProps> = (props: IPhotoRowProps) => (
    <div
        className="markdown-group__image"
        style={{
            '--md-image-row-count': props.children.length,
        } as React.CSSProperties}>
        {props.children}
    </div>
);

type IPhotoViewProps = { sightId: string; photoId: string; children: string; params?: string; };
type IPhotoViewPropsParams = Partial<{
    scale: string;
}>;

// eslint-disable-next-line max-len
const photoviewFactory = (photos: Map<number, IPhoto>, onClickPhoto: IMarkdownPhotoClick): React.FC<IPhotoViewProps> => (props: IPhotoViewProps) => {
    const photo = photos?.get(+props.photoId);
    const params = (props.params ? JSON.parse(props.params) : {}) as IPhotoViewPropsParams;

    const style: Record<string, string> = {
        '--md-image-ratio': String(photo ? photo.height / photo.width : .5625),
        '--md-image-scale': 'scale' in params ? params.scale : '1',
        '--md-image-width': photo ? `${photo.width}px` : 'auto',
        '--md-image-height': photo ? `${photo.height}px` : 'auto',
    };

    const onClick = React.useMemo(() => () => onClickPhoto(photo.photoId), [onClickPhoto]);

    return photo ? (
        <figure className="markdown-image" style={style as React.CSSProperties}>
            <div className="markdown-image--pictureWrap">
                <img
                    onClick={onClick}
                    className="markdown-image--image"
                    src={photo.photoMax}
                    alt={props.children} />
            </div>
            {props.children && <figcaption className="markdown-image--caption">{props.children}</figcaption>}
        </figure>
    ) : null;
};

const MarkdownRenderer: React.FC<IMarkdownRendererProps> = (props: IMarkdownRendererProps) => {
    if (React.Children.count(props.children) !== 1) {
        throw new Error('Two or more children');
    }

    const text = mdReplace(String(props.children));

    // noinspection SpellCheckingInspection
    const overrides: MarkdownToJSX.Overrides = React.useMemo(() => ({
        userlink,
        sightlink,
        photorow,
        photoview: photoviewFactory(props.photos, props.onClickPhoto),
    }), [props.photos, props.onClickPhoto]);

    return (
        <div className={classNames('markdown', props.className)}>
            <ReactMarkdown options={{ overrides }}>
                {text}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;
