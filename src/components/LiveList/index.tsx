import * as React from 'react';
import './style.scss';
import withSpinnerWrapper from '../LoadingSpinner/wrapper';
import LoadingSpinner from '../LoadingSpinner';
import classNames from 'classnames';
import TextInput from '../TextInput';

export type ILiveListItem<T = unknown> = {
    id: number;
    title: string;
    selected?: boolean;
    object?: T;
};

type ILiveListProps<T = unknown> = {
    onOpen: () => Promise<ILiveListItem<T>[]>;
    needSearch?: boolean;
    onTyping?: (query: string) => Promise<ILiveListItem<T>[]>;
    onSelect: (entry: ILiveListItem<T>) => void;
};

const LiveList: React.FC<ILiveListProps> = function<T>(props: ILiveListProps<T>) {
    const [items, setItems] = React.useState<ILiveListItem<T>[]>([]);
    const [query, setQuery] = React.useState<string>('');

    React.useEffect(() => {
        void props.onOpen().then(setItems);
    }, []);

    React.useEffect(() => {
        void props.onTyping(query.toLowerCase()).then(setItems);
    }, [query]);

    return (
        <div className="liveList">
            {props.needSearch && (
                <div className="liveList-search">
                    <TextInput
                        type="text"
                        name="query"
                        value={query}
                        label="Быстрый поиск"
                        onChange={(_, value) => setQuery(value)} />
                </div>
            )}
            <div className="liveList-items">
                {!items && withSpinnerWrapper(<LoadingSpinner size="m" />)}
                {items && items.map(item => (
                    <div
                        key={item.id}
                        className={classNames(
                            'liveList-item',
                            item.selected && 'listList-item__selected'
                        )}
                        onClick={() => props.onSelect(item)}>
                        {item.title}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LiveList;
