import * as React from 'react';
import LoadingSpinner from '../LoadingSpinner';
import withSpinnerWrapper from '../LoadingSpinner/wrapper';

interface ILoadingWrapperProps {
    loading?: boolean;
    subtitle?: string;
    render?: () => JSX.Element;
}

/**
 * @deprecated
 */
const LoadingWrapper: React.FC<ILoadingWrapperProps> = ({ loading = false, render, subtitle }: ILoadingWrapperProps): JSX.Element => {
    if (!loading) {
        return render?.();
    }

    return withSpinnerWrapper(<LoadingSpinner size='l' />, subtitle);
};

export default LoadingWrapper;
