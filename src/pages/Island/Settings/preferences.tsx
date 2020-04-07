import * as React from 'react';
import './style.scss';
import Checkbox from '../../../components/Checkbox';

const Preferences = () => {
    return (
        <div className="settings-form">
            <Checkbox
                name="test"
                label="Ночная тема"
                description={{
                    on: "Тёмная тема",
                    off: "Светлая тема"
                }} />
            <Checkbox
                name="tests"
                label="тест2"
                description="test 2" />
        </div>
    );
};

export default Preferences;
