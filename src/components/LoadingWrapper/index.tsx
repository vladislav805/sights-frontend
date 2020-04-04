import * as React from 'react';
import LoadingSpinner from '../LoadingSpinner';

interface ILoadingWrapperProps {
    loading?: boolean;
    render: () => React.ReactNode;
}

const LoadingWrapper = ({ loading = false, render }: ILoadingWrapperProps) => {
    return loading
        ? <LoadingSpinner />
        : render();
};

export default LoadingWrapper;
