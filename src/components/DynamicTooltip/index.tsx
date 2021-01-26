import * as React from 'react';
import 'tippy.js/dist/tippy.css'
import './style.scss';
import Tippy from '@tippyjs/react';

import LoadingSpinner from '../LoadingSpinner';
import API, { apiExecute } from '../../api';
import { ISightWVS, renderTooltipSight } from './sight';
import { renderTooltipUser } from './user';
import { ISight, IVisitStateStats } from '../../api/types/sight';

type AllowedType = 'sight' | 'user';
type IdType = number | string;
type UpdateObjectCallback = <T>(obj: T) => void;

export type ITooltipContent = {
    title: React.ReactNode;
    content: React.ReactNode;
};

const resolver: Record<AllowedType, (id: IdType) => Promise<unknown>> = {
    sight: id =>
        apiExecute<{
            s: ISight;
            v: IVisitStateStats;
        }>('const s=API.sights.getById({sightIds:+A.id,fields:A.sf}).items[0],v=API.sights.getVisitStat({sightId:s.sightId});return{s,v};', {
            id,
            sf: ['photo', 'visitState', 'rating'],
        }).then(result => {
            return { ...result.s, vs: result.v } as ISightWVS;
        }),

    user: id =>
        API.users.getUser(id, ['ava', 'city', 'isFollowed', 'followers']),
};

type RendererTooltip = (object: unknown, setObject: UpdateObjectCallback) => ITooltipContent;

const renderer: Record<AllowedType, RendererTooltip> = {
    sight: renderTooltipSight,
    user: renderTooltipUser,
};

type IDynamicTooltipProps = React.PropsWithChildren<{
    type: AllowedType;
    id: IdType;
}>;

const DynamicTooltip: React.FC<IDynamicTooltipProps> = (props: IDynamicTooltipProps) => {
    const [data, setData] = React.useState<unknown>(null);

    const onShow = () => {
        if (!data) {
            void resolver[props.type](props.id).then(setData);
        }
    };

    const render = React.useMemo(() => {
        const template = data ? renderer[props.type](data, setData) : null;
        return (
            <div className="dynamic-tooltip--wrap">
                {data ? (
                    <>
                        <h4 className="dynamic-tooltip--title">{template.title}</h4>
                        <div className="dynamic-tooltip--content">{template.content}</div>
                    </>
                ) : <LoadingSpinner className="dynamic-tooltip--spinner" size="xs" />}
            </div>
        );
    }, [data]);

    return (
        <Tippy
            interactive
            delay={[500, 0]}
            arrow
            animation="shift-toward-subtle"
            onShow={onShow}
            content={render}>
            {props.children as React.ReactElement}
        </Tippy>
    );
};

export default DynamicTooltip;
