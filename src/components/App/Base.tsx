import * as React from 'react';
import './App.scss';
import Header from '../Header';
import Main from '../Main';
import Footer from '../Footer';
import { connect } from 'react-redux';
import { RootStore, init, TypeOfConnect } from '../../redux';
import { useCurrentWitdh } from '../../utils';
import Config from '../../config';
import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

const storeEnhancer = connect(
    (state: RootStore) => ({ ...state }),
    { init },
    null,
    { pure: false },
);

type IApp = TypeOfConnect<typeof storeEnhancer>;

const App = ({ init, theme }: IApp) => {
    init();

    const [menuState, _setMenuState] = React.useState(false);
    const closeMenu = () => _setMenuState(false);

    const width = useCurrentWitdh();
    const setMenuState = (state: boolean) => {
        if (width > Config.breakpoints.pad) {
            state = false;
        }
        _setMenuState(state);
    };

    useEffect(() => {
        document.body.classList.toggle('theme__dark', theme === 'dark');
    }, [theme]);

    return (
        <BrowserRouter>
            <Header menuState={menuState} setMenuState={setMenuState} />
            <Main menu={menuState} closeMenu={closeMenu} />
            <Footer />
        </BrowserRouter>
    );
};

export default storeEnhancer(App);
