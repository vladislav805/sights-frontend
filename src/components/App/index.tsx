import * as React from 'react';
import './App.scss';
import Header from '../Header';
import Main from '../Main';
import Footer from '../Footer';
import { connect } from 'react-redux';
import { RootStore, init, TypeOfConnect } from '../../session';

const storeEnhancer = connect(
    (state: RootStore) => ({ ...state }),
    { init },
    null,
    { pure: false },
);

type IApp = TypeOfConnect<typeof storeEnhancer>;

const App = ({ init }: IApp) => {
    init();
    const [menuState, setMenuState] = React.useState(false);
    const closeMenu = () => setMenuState(false);
    return (
        <>
            <Header menuState={menuState} setMenuState={setMenuState} />
            <Main menu={menuState} closeMenu={closeMenu} />
            <Footer />
        </>
    );
};

export default storeEnhancer(App);
