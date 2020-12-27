import * as React from 'react';

type IAnimatedCounterProps = {
    value: number;
};

declare global {
    function setInterval(callback: () => void, ms: number): number;
}

const AnimatedCounter: React.FC<IAnimatedCounterProps> = ({ value }: IAnimatedCounterProps) => {
    const [currentValue, setCurrentValue] = React.useState(0);

    React.useEffect(() => {
        const delta = ~~(value / 30);

        if (currentValue === value) {
            return;
        }

        requestAnimationFrame(() => {
            const newValue = Math.min(currentValue + delta, value);
            setCurrentValue(newValue);
        });
    }, [currentValue]);
    return (
        <>{currentValue}</>
    );
};

export default AnimatedCounter;
