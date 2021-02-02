import * as React from "react";
import { IApiError } from '../api/types/base';

type FetchFunction<T> = () => Promise<T>;

type Result<T> = {
    error: IApiError | null;
    loading: boolean;
    result: T;
};

const defaultState: Result<never> = {
    result: undefined as never,
    loading: true,
    error: null,
};

function useApiFetch<T>(fetchFunction: FetchFunction<T>): Result<T> {
    const [state, setState] = React.useState<Result<T>>(defaultState);

    React.useEffect(() => {
        setState(defaultState);

        void fetchFunction()
            .then(result => {
                setState({
                    result,
                    loading: false,
                    error: null,
                });
            })
            .catch((error: IApiError) => {
                setState({
                    result: null,
                    loading: false,
                    error,
                });
            });
    }, [fetchFunction]);

    return state;
}

export default useApiFetch;
