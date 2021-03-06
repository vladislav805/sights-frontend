import * as React from 'react';
import './style.scss';
import classNames from 'classnames';

type CheckboxOnSetChecked = (name: string, state: boolean) => void;

export interface ICheckboxProps {
    name: string;
    value?: string;
    label: string;
    description?: string | { on: string; off: string };
    checked?: boolean;
    disabled?: boolean;
    onSetChecked?: CheckboxOnSetChecked;
    verticalMargin?: boolean;
    className?: string;
}

export interface ICheckboxState {
    checked: boolean;
}

export default class Checkbox extends React.Component<ICheckboxProps, ICheckboxState> {
    constructor(props: ICheckboxProps) {
        super(props);

        this.onChange = this.onChange.bind(this);

        this.state = {
            checked: props.checked,
        };
    }

    private onChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const { checked } = event.target;
        const { onSetChecked, name } = this.props;

        onSetChecked?.(name, checked);
        this.setState({ checked });
    }

    private getSubLabel = () => {
        const { description, checked } = this.props;

        if (typeof description === 'string') {
            return description;
        }

        return checked ? description.on : description.off;
    };

    public render(): JSX.Element {
        const { checked } = this.state;
        const { name, value, label, description, disabled, verticalMargin = true, className } = this.props;

        return (
            <label
                className={classNames('xCheckbox', {
                    xCheckbox__checked: checked,
                    xCheckbox__disabled: disabled,
                    'xCheckbox__has-description': description,
                    xCheckbox__verticalMargin: verticalMargin,
                }, className)}>
                <input
                    className="xCheckbox--native"
                    type="checkbox"
                    name={name}
                    value={value}
                    checked={checked}
                    disabled={disabled}
                    onChange={this.onChange} />
                <div className="xCheckbox--shape" />
                <div className="xCheckbox--content">
                    <div className="xCheckbox--label">{label}</div>
                    {description && (
                        <div className="xCheckbox--description">{this.getSubLabel()}</div>
                    )}
                </div>
            </label>
        );
    }
}
