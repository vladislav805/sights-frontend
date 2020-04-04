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
    return (
        <>
            <Header />
            <Main />
            <Footer />
        </>
    );
};

export default storeEnhancer(App);
