import * as React from 'react';
import './style.scss';
import TextInput from '../../TextInput';
import Button from '../../Button';

interface IFormProps {
    onSubmit: (text: string) => Promise<true>;
}

const Form: React.FC<IFormProps> = ({ onSubmit }: IFormProps) => {
    const [text, setText] = React.useState<string>('');
    const [busy, setBusy] = React.useState<boolean>(false);

    const onTextChange = (name: string, value: string) => setText(value);

    const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setBusy(true);
        void onSubmit(text).then(() => {
            setBusy(false);
            setText('');
        });
    };

    return (
        <form
            className="comment-form"
            onSubmit={onFormSubmit}>
            <TextInput
                type="textarea"
                name="text"
                onChange={onTextChange}
                value={text}
                label="Написать комментарий..."
                disabled={busy} />
            <Button
                type="submit"
                label="Отправить"
                color="primary"
                size="m"
                loading={busy} />
        </form>
    );
};

export default Form;
