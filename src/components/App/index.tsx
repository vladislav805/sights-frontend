/* eslint-disable no-param-reassign */
import * as React from 'react';
import './App.scss';
import { connect } from 'react-redux';
import Header from '../Header';
import Main from '../Main';
import Footer from '../Footer';
import { RootStore, init, TypeOfConnect } from '../../redux';
import { useCurrentWidth } from '../../utils/width';
import Config from '../../config';

const withStore = connect(
    (state: RootStore) => ({ theme: state.theme }),
    { init },
);

type IAppProps = TypeOfConnect<typeof withStore>;

const App: React.FC<IAppProps> = ({ init, theme }: IAppProps) => {
    init();

    const [menuState, setMenuState] = React.useState(false);
    const closeMenu = () => setMenuState(false);

    const width = useCurrentWidth();
    const setMenuStateEvent = (state: boolean) => {
        if (width > Config.breakpoints.pad) {
            state = false;
        }
        setMenuState(state);
    };

    if (!Config.isServer) {
        React.useEffect(() => {
            document.body.classList.toggle('theme__dark', theme === 'dark');
        }, [theme]);
    }

    return (
        <>
            <Header menuState={menuState} setMenuState={setMenuStateEvent} />
            <Main menu={menuState} closeMenu={closeMenu} />
            <Footer />
        </>
    );
};

export default withStore(App);
