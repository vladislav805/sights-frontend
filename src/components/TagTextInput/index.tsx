import * as React from 'react';
import TextInput, { TextInputType } from '../TextInput';
import API, { ITag } from '../../api';

type ITagTextInputProps = {
    tags: string[];
    onChange: (tags: string[]) => void;
};

const TagTextInput: React.FC<ITagTextInputProps> = (props: ITagTextInputProps) => {
    const [tags, setTags] = React.useState<string[]>(props.tags);
    const [focus, setFocus] = React.useState<boolean>(false);
    const [suggest, setSuggest] = React.useState<ITag[]>([]);

    const onChange = (name: string, value: string) => {
        setTags(value.split(' ').filter(Boolean));
    };

    React.useEffect(() => {
        props.onChange(tags);

        const last = tags[tags.length - 1];

        void API.tags.search({ query: last }).then(setSuggest);
    }, [tags]);

    return (
        <div className="">
            <TextInput
                type={TextInputType.text}
                value={tags.join(' ')}
                label="Теги"
                name="tags"
                onChange={onChange}
                onFocusChange={(name, focused) => setFocus(focused)}/>
            {focus && suggest && suggest.map(tag => (
                <div key={tag.tagId}>{tag.title}</div>
            ))}
        </div>
    );
};

export default TagTextInput;
