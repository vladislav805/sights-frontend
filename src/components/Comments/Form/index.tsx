import * as React from 'react';
import './style.scss';
import TextInput from '../../TextInput';
import Button from '../../Button';
import { mdiSend } from '@mdi/js';
import { showToast } from '../../../ui-non-react/toast';

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
        void onSubmit(text)
            .then(() => {
                setBusy(false);
                setText('');
            }).catch((error: Error) => {
                setBusy(false);
                showToast(error.message);
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
                icon={mdiSend}
                label="Отправить"
                loading={busy} />
        </form>
    );
};

export default Form;
