import * as React from 'react';
import './style.scss';
import classNames from 'classnames';
import Button from '../Button';
import Checkbox from '../Checkbox';

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

const DropDownButton: React.FC<IDropDownButtonProps> = (props: IDropDownButtonProps) => {
    const [visible, setVisible] = React.useState<boolean>(false);

    const toggleOpen = () => setVisible(!visible);

    React.useEffect(() => {
        if (visible) {
            props.onShow?.();
        } else {
            props.onHide?.();
        }
    }, [visible]);

    const onClickItem = (item: IDropDownItemProps) => (_: string, checked: boolean) => {
        setVisible(false);

        const updatedList = props.items.map(current => current.id === item.id
            ? current
            : { ...current, checked }
        );

        props.onListChanged(updatedList, { ...item, checked });
    };

    return (
        <div className="drop-down-button">
            <Button
                className="drop-down-button--button"
                label={props.title}
                icon={props.icon}
                onClick={toggleOpen}
                loading={props.loading} />
            <div className="drop-down-button--list" hidden={!visible}>
                {props?.items?.map(item => (
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
