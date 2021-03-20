import * as React from 'react';
import './style.scss';
import { useHistory, useParams } from 'react-router-dom';
import { mdiArrowUpBox } from '@mdi/js';
import * as Modal from '../../../components/Modal';
import { withSessionOnly } from '../../../hoc/withSessionOnly';
import { CollectionType, ICollection, ICollectionExtended } from '../../../api/types/collection';
import API, { apiExecute } from '../../../api';
import { ICity } from '../../../api/types/city';
import PageTitle from '../../../components/PageTitle';
import TextInput from '../../../components/TextInput';
import FakeTextInput from '../../../components/FakeTextInput';
import Button from '../../../components/Button';
import CityModal from '../../../components/CityModal';
import useCurrentUser from '../../../hook/useCurrentUser';
import Select from '../../../components/Select';
import { TabHost } from '../../../components/Tabs';
import MarkdownRenderer from '../../../components/MarkdownRenderer';
import { showToast } from '../../../ui-non-react/toast';

type ICollectionEditParams = {
    collectionId?: string;
};

const TYPES: CollectionType[] = [
    'PUBLIC',
    'PRIVATE',
    'DRAFT',
];

const TYPE_NAMES: Record<CollectionType, string> = {
    PUBLIC: 'публичная',
    PRIVATE: 'приватная',
    DRAFT: 'черновик',
};

const TYPE_OPTIONS = TYPES.map(value => ({
    value,
    title: TYPE_NAMES[value],
}));

const CollectionEditPage: React.FC = () => {
    const [loading, setLoading] = React.useState<boolean>(true);
    const history = useHistory();
    const params = useParams<ICollectionEditParams>();
    const currentUser = useCurrentUser();

    const [collection, setCollection] = React.useState<ICollectionExtended>({
        title: '',
        content: '',
        type: 'PUBLIC',
        cityId: null,
        items: [],
    } as ICollectionExtended);
    const [city, setCity] = React.useState<ICity | null>();

    const [showCityModal, setShowCityModal] = React.useState<boolean>(false);

    const [tabSelected, setTabSelected] = React.useState<string>();

    const paramCollectionId = +params.collectionId;

    React.useEffect(() => {
        if (!paramCollectionId) {
            setLoading(false);
            return;
        }

        type Result = {
            c: ICollectionExtended;
            p: ICity | null;
        };

        apiExecute<Result>('const id=+A.i,c=API.collections.getById({collectionId:id,fields:A.sf}),'
            + 'p=c.cityId?API.cities.getById({cityIds:c.cityId})[0]:null;return{c,p};', {
            i: params.collectionId,
            sf: 'photo,visitState',
        }).then(result => {
            setLoading(false);
            setCollection(result.c);
            setCity(result.p);
        });
    }, []);

    const save = React.useMemo(() => async() => {
        const isNew = !collection.collectionId;

        const params = {
            title: collection.title,
            content: collection.content,
            type: collection.type,
            cityId: city?.cityId,
        };

        const result = isNew
            ? await API.collections.add(params)
            : await API.collections.edit({
                ...params,
                collectionId: collection.collectionId,
            });

        if (isNew) {
            setCollection({
                ...collection,
                ...result,
            });
            history.replace(`/collection/${result.collectionId}/edit`);
        }
    }, [collection]);

    const { onSubmitForm } = React.useMemo(() => ({
        onSubmitForm: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            setLoading(true);

            save()
                .catch((error: Error) => showToast(error.message))
                .then(() => {
                    setLoading(false);
                    showToast('Успешно сохранено', { duration: 2000 });
                });
        },
    }), [collection]);

    // изменение текста
    const onChangeText = (name: keyof ICollection, value: string) => {
        setCollection({
            ...collection,
            [name]: value,
        });
    };

    const tabContent = tabSelected === 'editor'
        ? (
            <TextInput
                className="collection-edit--textarea"
                name="content"
                type="textarea"
                value={collection.content}
                disabled={loading}
                label="Содержимое в Markdown"
                onChange={onChangeText} />
        )
        : (
            <MarkdownRenderer className="collection-edit--content__preview">
                {collection.content}
            </MarkdownRenderer>
        );

    return (
        <form
            className="collection-edit--page"
            onSubmit={onSubmitForm}>
            <PageTitle
                backLink={collection.collectionId ? `/collection/${collection.collectionId}` : `/collections/${currentUser.userId}`}>
                {collection.collectionId ? `Редактирование коллекции «${collection.title}»` : 'Создание коллекции'}
            </PageTitle>
            <div className="collection-edit--form">
                <TextInput
                    name="title"
                    type="text"
                    value={collection.title}
                    required
                    disabled={loading}
                    label="Название коллекции"
                    onChange={onChangeText} />
                <TabHost
                    onTabChanged={setTabSelected}
                    tabs={[{
                        name: 'editor',
                        title: 'Редактор',
                    }, {
                        name: 'viewer',
                        title: 'Предварительный просмотр',
                    }]}>
                    {tabContent}
                </TabHost>
                <FakeTextInput
                    label="Город"
                    value={city ? city.name : 'не выбран'}
                    onClick={() => setShowCityModal(true)} />
                <Select
                    label="Тип коллекции"
                    selectedIndex={collection.type ? TYPES.indexOf(collection.type) : 0}
                    name="type"
                    items={TYPE_OPTIONS}
                    onSelect={(name, type: CollectionType) => setCollection({ ...collection, type })} />
                <Button
                    type="submit"
                    loading={loading}
                    icon={mdiArrowUpBox}
                    label="Сохранить" />
                <Modal.Window
                    show={showCityModal}
                    onOverlayClick={() => setShowCityModal(false)}>
                    <CityModal
                        selected={city}
                        onChange={city => {
                            setCollection({ ...collection, cityId: city?.cityId ?? null });
                            setCity(city);
                            setShowCityModal(false);
                        }} />
                </Modal.Window>
            </div>
            <Modal.Window show={loading}>
                <Modal.Title>Подождите..</Modal.Title>
            </Modal.Window>
        </form>
    );
};

export default withSessionOnly(CollectionEditPage);
