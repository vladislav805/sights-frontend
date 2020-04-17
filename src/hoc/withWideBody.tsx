import * as React from 'react';

export default (Child: React.ComponentType) => {
    return class extends React.Component<never, never> {
        static displayName = `withWideBody(${Child.displayName || Child.name})`;

        private setWide = (state: boolean) => document.body.classList.toggle('body__wide', state);

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
