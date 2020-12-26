import * as React from 'react';
import './style.scss';
import TextInput from '../TextInput';

type IFakeTextInputProps = {
    label: string;
    value: string;
    onClick: () => void;
};

const FakeTextInput: React.FC<IFakeTextInputProps> = (props: IFakeTextInputProps) => {
    const onClick = React.useMemo(() => {
        return (event: React.MouseEvent) => {
            event.stopPropagation();
            props.onClick();
        };
    }, []);
    return (
        <div onClickCapture={onClick} className="fake-input">
            <TextInput
                label={props.label}
                name="fake"
                readOnly
                value={props.value || ' '} />
        </div>
    );
};

export default FakeTextInput;
