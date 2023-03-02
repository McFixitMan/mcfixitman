
/**
 * Parses the input string to a boolean
 * 
 * Returns undefined if invalid
 */
export const primitiveToBoolean = (value: string | number | boolean | null | undefined): boolean | undefined => {
    if (value === null || value === undefined) {
        return undefined;
    }

    if (typeof value === 'boolean') {
        return value;
    }

    if (typeof value === 'string') {
        const input = value.toLowerCase().trim();

        if (input === 'true' || input === '1') {
            return true;
        } else if (input === 'false' || input === '0') {
            return false;
        } else {
            return undefined;
        }
    }

    if (typeof value === 'number') {
        if (value === 1) {
            return true;
        } else if (value === 0) {
            return false;
        } else {
            return undefined;
        }
    }
};
