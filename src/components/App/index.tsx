import * as React from 'react';
import './App.scss';
import Header from '../Header';
import Main from '../Main';
import Footer from '../Footer';
import { connect } from 'react-redux';
import { RootStore, init, TypeOfConnect } from '../../session';
import useCurrentWitdh from '../../utils/width';
import Config from '../../config';

const storeEnhancer = connect(
    (state: RootStore) => ({ ...state }),
    { init },
    null,
    { pure: false },
);

type IApp = TypeOfConnect<typeof storeEnhancer>;

const App = ({ init }: IApp) => {
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

    return (
        <>
            <Header menuState={menuState} setMenuState={setMenuState} />
            <Main menu={menuState} closeMenu={closeMenu} />
            <Footer />
        </>
    );
};

export default storeEnhancer(App);
