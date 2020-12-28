import * as React from 'react';
import './style.scss';
import TextInput from '../TextInput';

type ITagTextInputProps = {
    tags: string[];
    onChange: (tags: string[]) => void;
};

const TagTextInput: React.FC<ITagTextInputProps> = (props: ITagTextInputProps) => {
    //const [tags, setTags] = React.useState<string[]>(props.tags);
    const [focus, setFocus] = React.useState<boolean>(false);
    //const [suggest, setSuggest] = React.useState<ITag[]>([]);

    const onChange = (name: string, value: string) => {
        const tags = value.split(/\n|\s/igm);

        props.onChange(tags);
    };

    return (
        <div className="xInputFake-tag">
            <TextInput
                type="textarea"
                value={props.tags.join('\n')}
                label="Теги"
                name="tags"
                onChange={onChange}
                onFocusChange={(name, focused) => setFocus(focused)}/>
            {/*focus && suggest && suggest.map(tag => (
                <div key={tag.tagId}>{tag.title}</div>
            ))*/}
        </div>
    );
};

export default TagTextInput;
