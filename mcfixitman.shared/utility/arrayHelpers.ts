// https://stackoverflow.com/a/62765924
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const groupBy = <T, K extends keyof any>(list: Array<T>, getKey: (item: T) => K): Record<K, Array<T>> =>
    list.reduce((previous, currentItem) => {
        const group = getKey(currentItem);
        if (!previous[group]) previous[group] = [];
        previous[group].push(currentItem);
        return previous;
    }, {} as Record<K, Array<T>>);


// https://stackoverflow.com/a/64519702
// Absolutely no idea why autofix wants to mess up the indentation here, but just going to disable since its a code snippet anyway
/* eslint-disable @typescript-eslint/indent */
export type UniqueArray<T> = T extends readonly [infer X, ...infer Rest]
    ? InArray<Rest, X> extends true
    ? ['Encountered value with duplicates:', X]
    : readonly [X, ...UniqueArray<Rest>]
    : T

export type InArray<T, X> =
    T extends readonly [X, ...infer _Rest]
    ? true
    : T extends readonly [X]
    ? true
    : T extends readonly [infer _, ...infer Rest]
    ? InArray<Rest, X>
    : false
/* eslint-enable @typescript-eslint/indent */