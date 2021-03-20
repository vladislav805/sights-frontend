import * as React from 'react';
import { IApiError } from '../api/types/base';

type FetchFunction<T> = () => Promise<T>;

type Result<T> = {
    error: IApiError | null;
    loading: boolean;
    result: T;
    setResult: (value: T) => void;
};

const defaultState: Result<never> = {
    result: undefined as never,
    loading: true,
    error: null,
    setResult: () => undefined,
};

function useApiFetch<T>(fetchFunction: FetchFunction<T>): Result<T> {
    const [state, setState] = React.useState<Result<T>>(defaultState);

    const setResult = React.useMemo(() =>
        (result: T) =>
            setState({ ...state, loading: false, result }),
    [state]);

    React.useEffect(() => {
        setState(defaultState);

        fetchFunction()
            .then(result => {
                setState({
                    result,
                    loading: false,
                    error: null,
                    setResult,
                });
            })
            .catch((error: IApiError) => {
                setState({
                    result: null,
                    loading: false,
                    error,
                    setResult,
                });
            });
    }, [fetchFunction]);

    return state;
}

export default useApiFetch;
