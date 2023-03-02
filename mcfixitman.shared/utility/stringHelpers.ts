
// https://stackoverflow.com/a/4149393/3253311
export const camelCaseToSentence = (input: string): string => {
    return input
        .replace(/([A-Z][a-z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase());
};