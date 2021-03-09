import * as React from 'react';
import './App.scss';
import Header from '../Header';
import Main from '../Main';
import Footer from '../Footer';
import { connect } from 'react-redux';
import { RootStore, init, TypeOfConnect } from '../../redux';
import { useCurrentWidth } from '../../utils/width';
import Config from '../../config';
import { useEffect } from 'react';

const withStore = connect(
    (state: RootStore) => ({ theme: state.theme }),
    { init },
);

type IAppProps = TypeOfConnect<typeof withStore>;

const App: React.FC<IAppProps> = ({ init, theme }: IAppProps) => {
    init();

    const [menuState, _setMenuState] = React.useState(false);
    const closeMenu = () => _setMenuState(false);

    const width = useCurrentWidth();
    const setMenuState = (state: boolean) => {
        if (width > Config.breakpoints.pad) {
            state = false;
        }
        _setMenuState(state);
    };

    !Config.isServer && useEffect(() => {
        document.body.classList.toggle('theme__dark', theme === 'dark');
    }, [theme]);

    return (
        <>
            <Header menuState={menuState} setMenuState={setMenuState} />
            <Main menu={menuState} closeMenu={closeMenu} />
            <Footer />
        </>
    );
};

export default withStore(App);
