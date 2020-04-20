import * as React from 'react';
import './style.scss';
import { connect } from 'react-redux';
import { RootStore, setHomeCache, TypeOfConnect } from '../../redux';
import API, { ISiteStats } from '../../api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Link } from 'react-router-dom';

const storeEnhancer = connect(
    (state: RootStore) => ({ ...state }),
    { setHomeCache },
    null,
    { pure: false },
);

type IHomeProps = TypeOfConnect<typeof storeEnhancer>;

const statKeys: (keyof ISiteStats)[] = ['total', 'verified', 'archived'];
const statTitle: Record<keyof ISiteStats, [string, string]> = {
    total: ['Всего на сайте', 'Столько достопримечательностей сейчас есть на сайте'],
    verified: ['Подтвержденных достопримечательностей', 'Столько мест можно обойти сейчас с помощью нашего сайта'],
    archived: ['Архивных достопримечательностей', 'Эти места уже нельзя посетить, достопримечательности были уничтожены'],
};

const Home: React.FC<IHomeProps> = ({ homeStats, setHomeCache }: IHomeProps) => {
    React.useEffect(() => {
        if (!homeStats) {
            void API.sights.getCounts().then((s) => {
                setHomeCache(s);
            });
        }
    }, []);

    return (
        <div className="home-page">
            <div className="home-page--header">
                <h1>Добро пожаловать!</h1>
                <p>На нашем сайте Вы можете найти интересные места в разных угоках России, СНГ и не только.</p>
            </div>
            <div className="home-page--stats">
                {statKeys.map(statType => (
                    <div key={statType} className="home-page--stats-item">
                        <div className="home-page--stats-item--content">
                            <h3>{statTitle[statType][0]}</h3>
                            <p>{statTitle[statType][1]}</p>
                        </div>
                        <div className="home-page--stats-item--count">
                            {homeStats ? homeStats[statType] : <LoadingSpinner size="s" /> }
                        </div>
                    </div>
                ))}
            </div>
            <div className="home-page--advice-add">
                <h3>Знаете необычную достопримечательность?</h3>
                <p>Проверьте, есть ли она у нас и если нет, добавьте, чтобы другие могли их увидеть!</p>
                <Link to="/sight/new" className="xButton xButton__primary xButton__size-l home-page--advice-add-link">Добавить!</Link>
                <p className="home-page--advice-add-tip">(требуется авторизация)</p>
            </div>
        </div>
    );
};

export default storeEnhancer(Home);
