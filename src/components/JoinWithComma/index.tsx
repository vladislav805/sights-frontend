import * as React from 'react';

type IJoinWithCommaProps = React.PropsWithChildren<unknown>;

const JoinWithComma: React.FC<IJoinWithCommaProps> = (props: IJoinWithCommaProps) => (
    <>
        {React.Children.toArray(props.children).map((child, index) => index ? <>, {child}</> : child)}
    </>
);

export default JoinWithComma;
