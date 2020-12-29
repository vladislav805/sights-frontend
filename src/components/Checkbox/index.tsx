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
}

export interface ICheckboxState {
    checked: boolean;
}

export default class Checkbox extends React.Component<ICheckboxProps, ICheckboxState> {
    constructor(props: ICheckboxProps) {
        super(props);

        this.state = {
            checked: props.checked,
        };
    }

    private onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        this.props.onSetChecked?.(this.props.name, checked);
        this.setState({ checked });
    };

    private getSubLabel = () => {
        const description = this.props.description;

        if (typeof description === 'string') {
            return description;
        }

        return this.state.checked
            ? description.on
            : description.off;
    };

    render(): JSX.Element {
        const { checked } = this.state;
        const { name, value, label, description, disabled, verticalMargin = true } = this.props;

        return (
            <label className={classNames('xCheckbox', {
                'xCheckbox__checked': checked,
                'xCheckbox__disabled': disabled,
                'xCheckbox__has-description': description,
                'xCheckbox__verticalMargin': verticalMargin,
            })}>
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
