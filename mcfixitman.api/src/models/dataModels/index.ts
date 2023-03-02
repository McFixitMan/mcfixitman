import * as Sequelize from 'sequelize';
import * as mysql2 from 'mysql2';

import { config } from 'src/config';

// This is SOMEHOW STILL AN ISSUE after FOUR YEARS
// https://github.com/sequelize/sequelize/issues/7930
Sequelize.DATE.prototype._stringify = function _stringify(date: { format: (arg0: string) => unknown; }, options: unknown) {
    date = this._applyTimezone(date, options);

    // Z here means current timezone, _not_ UTC
    // return date.format('YYYY-MM-DD HH:mm:ss.SSS Z');
    return date.format('YYYY-MM-DD HH:mm:ss.SSS');
};


const dbConfig = config.configDb;
export const sequelizeInstance: Sequelize.Sequelize = new Sequelize.Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
        dialectModule: mysql2,
        ...dbConfig,
    },
);

(async () => {
    const applyAssociations = (await import('./_associations')).applyAssociations;
    applyAssociations();

    await sequelizeInstance.authenticate();
})();
