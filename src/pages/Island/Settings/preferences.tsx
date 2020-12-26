import * as React from 'react';
import './style.scss';
import Checkbox from '../../../components/Checkbox';
import { connect } from 'react-redux';
import { RootStore, setTheme, TypeOfConnect } from '../../../redux';
import { SKL_THEME } from '../../../config';
import PageTitle from '../../../components/PageTitle';

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
            <PageTitle>Настройки сайта</PageTitle>
            <Checkbox
                name="darkTheme"
                label="Ночная тема"
                checked={theme == 'dark'}
                onSetChecked={onChangeCheckbox}
                description="Фон и все элементы будут затемнены (кроме изображений)" />
        </div>
    );
};

export default storeEnhancer(Preferences);
