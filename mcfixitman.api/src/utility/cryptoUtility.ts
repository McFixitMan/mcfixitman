import * as bcrypt from 'bcryptjs';

export const hashString = async (stringToHash: string): Promise<string> => {
    return await bcrypt.hash(stringToHash, 10);
};

export const stringMatchesHashedString = async (unhashedString: string, hashedString: string): Promise<boolean> => {
    return await bcrypt.compare(unhashedString, hashedString);
};