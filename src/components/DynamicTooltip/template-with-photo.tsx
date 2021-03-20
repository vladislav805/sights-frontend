/* eslint-disable react/no-array-index-key */
import * as React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { IPhoto } from '../../api/types/photo';
import { ITooltipContent } from './common';

type Props = {
    title: React.ReactNode;
    content: React.ReactNode[];
    link: string;
    photo: IPhoto;
};

export const templateWithPhoto = (props: Props): ITooltipContent => ({
    title: <Link to={props.link}>{props.title}</Link>,
    content: (
        <div className={classNames('dynamic-tooltip__user', props.photo && 'dynamic-tooltip__withPhoto')}>
            {props.photo && (
                <Link to={props.link}>
                    <img
                        className="dynamic-tooltip__withPhoto--photo"
                        src={props.photo.photo200}
                        alt="Фотография" />
                </Link>
            )}
            <div className="dynamic-tooltip__withPhoto--info">
                {props.content.filter(Boolean).map((row, i) => <div key={i}>{row}</div>)}
            </div>
        </div>
    ),
});
