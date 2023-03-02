import { NextFunction, Request, Response } from 'express';

import { logError } from 'src/dao/logDao';

export const logErrors = async (err: Error, req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await logError({
            error: err,
            createdBy: req.member?.emailAddress ?? '[Unknown user]',
        });
    } catch (error) {
        console.log(`Unable to write error to db log: ${error}`);
    }

    return next(err);
};