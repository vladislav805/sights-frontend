import * as React from 'react';
import './style.scss';
import LoadingSpinner from '../LoadingSpinner';

interface ILoadingWrapperProps {
    loading?: boolean;
    subtitle?: string;
    render?: () => JSX.Element;
}

const LoadingWrapper: React.FC<ILoadingWrapperProps> = ({ loading = false, render, subtitle }: ILoadingWrapperProps) => {
    if (!loading) {
        return render?.();
    }

    return (
        <div className="spinner-wrap">
            <LoadingSpinner size='l' />
            {subtitle && <span className="spinner-wrap--subtitle">{subtitle}</span>}
        </div>
    );
};

export default LoadingWrapper;
