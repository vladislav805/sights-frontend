/* eslint-disable react/no-array-index-key */
import * as React from 'react';

type IJoinWithCommaProps = React.PropsWithChildren<{
    separator?: string;
}>;

const JoinWithComma: React.FC<IJoinWithCommaProps> = (props: IJoinWithCommaProps) => React.useMemo(() => (
    <>
        {React.Children.toArray(props.children).map((child, index) => index
            ? <React.Fragment key={index}>{props.separator ?? ', '}{child}</React.Fragment>
            : child)}
    </>
), [props.children]);

export default JoinWithComma;
