import * as React from 'react';
import './style.scss';
import '../../components/Button/style.scss';
import { connect } from 'react-redux';
import { RootStore, setHomeCache, TypeOfConnect } from '../../redux';
import { apiExecute } from '../../api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { IHomeCache, ISiteStats } from '../../api/local-types';
import PageTitle from '../../components/PageTitle';
import AnimatedCounter from '../../components/AnimatedCoutner';
import Button from '../../components/Button';
import { mdiMap, mdiMapMarkerPlus } from '@mdi/js';
import HomeRandomPhotoGallery from '../../components/HomeRandomPhotoGallery';

const withStore = connect(
    (state: RootStore) => ({ cache: state.homeCache }),
    { setHomeCache },
);

type IHomeProps = TypeOfConnect<typeof withStore>;

const statKeys: (keyof ISiteStats)[] = ['total', 'verified', 'archived'];
const statTitle: Record<keyof ISiteStats, [string, string]> = {
    total: ['Всего на сайте', 'Столько достопримечательностей сейчас есть на сайте'],
    verified: ['Подтвержденных достопримечательностей', 'Столько мест можно обойти сейчас с помощью нашего сайта'],
    archived: ['Архивных достопримечательностей', 'Эти места уже нельзя посетить, достопримечательности были уничтожены'],
};

const Home: React.FC<IHomeProps> = ({ cache, setHomeCache }: IHomeProps) => {
    // const [recent, setRecent] = React.useState<ISight[]>();

    React.useEffect(() => {
        if (!cache) {
            const code = 'return{stats:API.sights.getCounts(),randomGallery:API.photos.getRandom({count:20})};';
            void apiExecute<IHomeCache>(code)
                .then(setHomeCache);
        }
    }, []);

    const stats = cache?.stats;

    return (
        <div className="home-page">
            <PageTitle>Главная</PageTitle>
            <div className="home-page--header">
                <h1>Добро пожаловать!</h1>
                <p>На нашем сайте Вы можете найти неформальные места в разных уголках России, СНГ и не только.</p>
            </div>
            <div className="home-page--stats">
                {statKeys.map(statType => (
                    <div key={statType} className="home-page--stats-item">
                        <div className="home-page--stats-item--content">
                            <h3>{statTitle[statType][0]}</h3>
                            <p>{statTitle[statType][1]}</p>
                        </div>
                        <div className="home-page--stats-item--count">
                            {stats ? <AnimatedCounter value={stats[statType]} /> : <LoadingSpinner size="s" />}
                        </div>
                    </div>
                ))}
            </div>
            <HomeRandomPhotoGallery photos={cache?.randomGallery} />
            <div className="home-page--advice-add">
                <h3>Хотите найти что-то интересное?</h3>
                <p>У нас много чего есть! Возможно, и рядом с Вами найдётся что-то.</p>
                <Button
                    link="/sight/map"
                    icon={mdiMap}
                    size="l"
                    label="Открыть карту" />
            </div>
            <div className="home-page--advice-add">
                <h3>Знаете неформальную достопримечательность?</h3>
                <p>Если её нет у нас на карте &mdash; добавьте, чтобы мы о ней узнали!</p>
                <Button
                    link="/sight/new"
                    icon={mdiMapMarkerPlus}
                    className="home-page--advice-add-link"
                    size="l"
                    label="Добавить!" />
                <p className="home-page--advice-add-tip">(требуется авторизация)</p>
            </div>
        </div>
    );
};

export default withStore(Home);
