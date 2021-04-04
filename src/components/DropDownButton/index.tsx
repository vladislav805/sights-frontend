import * as React from 'react';
import './style.scss';
import classNames from 'classnames';
import Button from '../Button';
import Checkbox from '../Checkbox';
import useOutsideAlerter from '../../hook/useOutsideAlerter';

type IDropDownButtonProps = {
    items: IDropDownItemProps[];
    onListChanged: (list: IDropDownItemProps[], updated: IDropDownItemProps) => void;
    title: string;
    icon?: string;
    loading?: boolean;
    onShow?: () => void;
    onHide?: () => void;
};

export type IDropDownItemProps = {
    title: string;
    id: string | number;
    checked: boolean;
};

const DropDownButton: React.FC<IDropDownButtonProps> = ({
    items,
    icon,
    title,
    loading,
    onHide,
    onShow,
    onListChanged,
}: IDropDownButtonProps) => {
    const [visible, setVisible] = React.useState<boolean>(false);
    const refButton = React.useRef<HTMLDivElement>(null);

    useOutsideAlerter(refButton, () => setVisible(false));

    const toggleOpen = () => setVisible(!visible);

    React.useEffect(() => {
        if (visible) {
            onShow?.();
        } else {
            onHide?.();
        }
    }, [visible]);

    const onClickItem = (item: IDropDownItemProps) => (_: string, checked: boolean) => {
        setVisible(false);

        const updatedList = items.map(current => current.id === item.id
            ? current
            : { ...current, checked });

        onListChanged(updatedList, { ...item, checked });
    };

    return (
        <div className="drop-down-button" ref={refButton}>
            <Button
                className="drop-down-button--button"
                label={title}
                icon={icon}
                onClick={toggleOpen}
                loading={loading} />
            <div className="drop-down-button--list" hidden={!visible}>
                {items?.map(item => (
                    <Checkbox
                        key={item.id}
                        className={classNames('drop-down-button--item', item.checked && 'drop-down-button--item__checked')}
                        onSetChecked={onClickItem(item)}
                        name={String(item.id)}
                        label={item.title}
                        verticalMargin={false}
                        checked={item.checked} />
                ))}
            </div>
        </div>
    );
};

export default DropDownButton;
