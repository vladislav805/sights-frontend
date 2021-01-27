import * as React from 'react';

type IJoinWithCommaProps = React.PropsWithChildren<unknown>;

const JoinWithComma: React.FC<IJoinWithCommaProps> = (props: IJoinWithCommaProps) => React.useMemo(() => (
    <>
        {React.Children.toArray(props.children).map((child, index) => index
            ? <React.Fragment key={index}>, {child}</React.Fragment>
            : child)}
    </>
), [props.children]);

export default JoinWithComma;
