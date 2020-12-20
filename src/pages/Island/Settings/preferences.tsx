import * as React from 'react';
import './style.scss';
import Checkbox from '../../../components/Checkbox';
import { connect } from 'react-redux';
import { RootStore, setTheme, TypeOfConnect } from '../../../redux';
import { SKL_THEME } from '../../../config';

const storeEnhancer = connect(
    (state: RootStore) => ({ ...state }),
    { setTheme },
    null,
    { pure: false },
);

type IPreferencesProps = TypeOfConnect<typeof storeEnhancer>;

const Preferences = ({ setTheme, theme }: IPreferencesProps) => {
    const onChangeCheckbox = (name: string, state: boolean) => {
        switch (name) {
            case 'darkTheme': {
                localStorage.setItem(SKL_THEME, state ? 'dark' : 'light');
                setTheme(state ? 'dark' : 'light');
                break;
            }
        }
    };

    return (
        <div className="settings-form">
            <Checkbox
                name="darkTheme"
                label="Ночная тема"
                checked={theme == 'dark'}
                onSetChecked={onChangeCheckbox}
                description="Фон и все элементы будут затемнены (кроме изображений)" />
            <Checkbox
                name="tests"
                label="тест2"
                description="test 2" />
        </div>
    );
};

export default storeEnhancer(Preferences);
