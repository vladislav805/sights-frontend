import * as React from 'react';
import './style.scss';
import TextInput from '../TextInput';

type IFakeTextInputProps = {
    label: string;
    value: string;
    onClick: () => void;
};

const FakeTextInput: React.FC<IFakeTextInputProps> = ({ label, value, onClick: lOnClick }: IFakeTextInputProps) => {
    const onClick = React.useMemo(() => (event: React.MouseEvent) => {
        event.stopPropagation();
        lOnClick();
    }, []);

    return (
        <div onClickCapture={onClick} className="fake-input">
            <TextInput
                label={label}
                name="fake"
                readOnly
                value={value || ' '} />
        </div>
    );
};

export default FakeTextInput;
