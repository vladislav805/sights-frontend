import * as React from 'react';
import './style.scss';
import TextInput from '../TextInput';

type ITagTextInputProps = {
    tags: string[];
    onChange: (tags: string[]) => void;
};

const TagTextInput: React.FC<ITagTextInputProps> = ({ tags, onChange }: ITagTextInputProps) => {
    // const [tags, setTags] = React.useState<string[]>(props.tags);
    // const [focus, setFocus] = React.useState<boolean>(false);
    // const [suggest, setSuggest] = React.useState<ITag[]>([]);

    const onChangeListener = (name: string, value: string) => onChange(value.split(/\n|\s/igm));

    return (
        <div className="xInputFake-tag">
            <TextInput
                type="textarea"
                value={tags.join('\n')}
                label="Теги"
                name="tags"
                onChange={onChangeListener} />
            {/* (name, focused) => setFocus(focused) */}
            {/* focus && suggest && suggest.map(tag => (
                <div key={tag.tagId}>{tag.title}</div>
            )) */}
        </div>
    );
};

export default TagTextInput;
