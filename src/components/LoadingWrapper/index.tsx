import * as React from 'react';
import LoadingSpinner from '../LoadingSpinner';

interface ILoadingWrapperProps {
    loading?: boolean;
    render?: () => JSX.Element;
}

const LoadingWrapper: React.FC<ILoadingWrapperProps> = ({ loading = false, render }: ILoadingWrapperProps) => {
    return loading
        ? <LoadingSpinner />
        : render?.();
};

export default LoadingWrapper;
