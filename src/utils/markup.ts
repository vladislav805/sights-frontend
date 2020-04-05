interface IMarkupConfig {
    regexp: RegExp;
    handle: (result: string[], key: number) => React.ReactChild;
}

type IMarkupOptions = IMarkupConfig | IMarkupConfig[];

const markup = (configs: IMarkupOptions) => {
    let key = 0;
    const processInputWithRegex = (input: React.ReactChild | React.ReactChild[], config: IMarkupConfig): React.ReactChild[] | React.ReactChild[][] => {
        if (Array.isArray(input)) {
            return input.map(chunk => processInputWithRegex(chunk, config)) as React.ReactChild[][];
        }

        if (typeof input !== 'string') {
            return input as unknown as React.ReactChild[];
        }

        const { regexp, handle } = config;
        let result = null;
        const output: React.ReactChild[] = [];

        while ((result = regexp.exec(input)) !== null) {
            const index = result.index;
            const match = result[0];

            output.push(input.substring(0, index));
            output.push(handle(result, ++key));

            input = input.substring(index + match.length, input.length + 1);
            regexp.lastIndex = 0;
        }

        output.push(input);
        return output;
    };

    return (input: string): React.ReactChild => {
        if (!Array.isArray(configs)) {
            return input;
        }

        let result: string = input;

        configs.forEach(config => result = processInputWithRegex(result, config) as unknown as string);

        return result;
    };
};

export default markup;
