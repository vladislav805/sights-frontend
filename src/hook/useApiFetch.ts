import * as React from "react";
import { IApiError } from '../api/types/base';

type FetchFunction<T> = () => Promise<T>;

type Result<T> = {
    error: IApiError | null;
    loading: boolean;
    result: T;
};

function useApiFetch<T>(fetchFunction: FetchFunction<T>): Result<T> {
    const [loading, setLoading] = React.useState<boolean>(true);
    const [result, setResult] = React.useState<T>();
    const [error, setError] = React.useState<IApiError>(null);

    React.useEffect(() => {
        void fetchFunction()
            .then(result => {
                setResult(result);
                setLoading(false);
            })
            .catch((error: IApiError) => {
                setLoading(false);
                setError(error);
            })
    }, [fetchFunction]);

    return { error, loading, result };
}

export default useApiFetch;
