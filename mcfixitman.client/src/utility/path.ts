import { config } from 'src/config';

// https://stackoverflow.com/questions/29855098/is-there-a-built-in-javascript-function-similar-to-os-path-join
const pathJoin = (...paths: Array<string>): string => {
    const separator = '/';
    const replace = new RegExp(`${separator}{1,}`, 'g');

    return paths.join(separator).replace(replace, separator);
};

export const getPath = (...paths: Array<string>): string => {
    return pathJoin(
        ...[
            config.basePath,
            ...paths,
        ],
    );
};

export const getPathWithoutBase = (path: string): string => {
    return path.replace(config.basePath, '');
};