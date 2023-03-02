// https://stackoverflow.com/a/66238542
const isoDateFormat = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)((-(\d{2}):(\d{2})|Z)?)$/;

function isIsoDateString(value: string): boolean {
    return isoDateFormat.test(value);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function convertDates(body: Record<string, any>): unknown {
    if (body === null || body === undefined || typeof body !== 'object') {
        return body;
    }

    for (const key of Object.keys(body)) {
        const value = body[key];

        if (!!value && typeof value === 'string') {
            if (isIsoDateString(value)) {
                body[key] = new Date(value);
            }

        }

        else if (typeof value === 'object' && value !== null) {
            // Recurse to handle other nested objects with dates
            convertDates(value);
        }
    }
}