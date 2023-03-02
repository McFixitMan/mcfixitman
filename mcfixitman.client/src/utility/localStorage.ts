import { convertDates } from 'mcfixitman.shared/utility/objectHelpers';

export function getObjectFromLocalStorage<T>(key: string): T | undefined {
    let value: T | undefined = undefined;

    if (localStorage) {
        try {
            const item: string | null = localStorage.getItem(key);

            value = !!item
                ? JSON.parse(item)
                : undefined;
        } catch (e) {
            // ignored
        }
    }

    convertDates(Object(value));
    return value;
}

export function saveObjectToLocalStorage<T>(key: string, value: T): void {
    if (localStorage) {
        localStorage.setItem(key, JSON.stringify(value));
    }
}

export function removeObjectFromLocalStorage(key: string): void {
    if (localStorage) {
        localStorage.removeItem(key);
    }
}

export interface LocalStorageUsageInfo {
    totalBytes: number;
    totalLabel: string;
    entryLabels: Record<string, string>;
}

// Adaptation of this code:
// https://stackoverflow.com/a/15720835/3253311
export const getLocalStorageUsageInfo = (): LocalStorageUsageInfo => {
    const localStorageUsageInfo: LocalStorageUsageInfo = {
        totalBytes: 0,
        totalLabel: '0 KB',
        entryLabels: {},
    };

    Object.entries(localStorage).forEach(([key, value]) => {
        const length = ((value.length + key.length) * 2);

        localStorageUsageInfo.totalBytes += length;
        localStorageUsageInfo.entryLabels[key] = `${(length / 1024).toFixed(2)} KB`;
    });

    localStorageUsageInfo.totalLabel = `${(localStorageUsageInfo.totalBytes / 1024).toFixed(2)} KB`;

    return localStorageUsageInfo;
};