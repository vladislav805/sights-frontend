import * as React from 'react';

export default function withSpinnerWrapper(Child: React.ReactNode, subtitle?: string): JSX.Element {
    return (
        <div className="spinner-wrap">
            {Child}
            {subtitle && <span className="spinner-wrap--subtitle">{subtitle}</span>}
        </div>
    );
}