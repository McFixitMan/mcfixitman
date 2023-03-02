import { Log } from 'mcfixitman.shared/models/dataModels/log';
import { Logs } from 'src/models/dataModels/log';
import { Transaction } from 'sequelize';

export const logError = async (params: { error: Error, createdBy?: string, transaction?: Transaction }): Promise<Log> => {
    const now = new Date();

    const log = await Logs.create({
        errorMessage: params.error.message,
        errorType: params.error.name,
        createdAt: now,
        stacktrace: params.error.stack,
        createdBy: params.createdBy,
    }, {
        transaction: params.transaction,
    });

    return log.get();
};