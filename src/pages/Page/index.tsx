import * as React from 'react';
import './style.scss';
import { useParams } from 'react-router-dom';
import API from '../../api';
import AttentionBlock from '../../components/AttentionBlock';
import { IPageContent } from '../../api/types/page';
import LoadingSpinner from '../../components/LoadingSpinner';
import useApiFetch from '../../hook/useApiFetch';
import MarkdownRenderer from '../../components/MarkdownRenderer';

type IPageRouterProps = {
    id: string;
};

const Page: React.FC = () => {
    const params = useParams<IPageRouterProps>();

    const fetchFunction = React.useMemo(() => () => API.internal.getPage(params.id), []);

    const { loading, result, error } = useApiFetch<IPageContent>(fetchFunction);

    if (loading) {
        return <LoadingSpinner block />;
    }

    if (error) {
        return <AttentionBlock type="error" show text={error.message} />;
    }

    return (
        <div className="page">
            <h1>{result.title}</h1>
            <MarkdownRenderer>
                {result.content}
            </MarkdownRenderer>
        </div>
    );
};

export default Page;
