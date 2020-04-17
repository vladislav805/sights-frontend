import * as React from 'react';

export default (_cls: string | string[]) => (Child: React.ComponentType) => {
    const classes = Array.isArray(_cls) ? _cls : [_cls];

    return class extends React.Component {
        static displayName = `withClassBody(${Child.displayName || Child.name})`;

        private setWide = (state: boolean) => classes.forEach(cls => document.body.classList.toggle(cls, state));

        componentDidMount() {
            this.setWide(true);
        }

        componentWillUnmount() {
            this.setWide(false);
        }

        render() {
            return <Child {...this.props} />;
        }
    }
};
