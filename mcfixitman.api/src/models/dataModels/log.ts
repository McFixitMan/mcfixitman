import * as Sequelize from 'sequelize';

import { Log } from 'mcfixitman.shared/models/dataModels/log';
import { sequelizeInstance } from 'src/models/dataModels';

export interface LogCreationAttributes extends Sequelize.Optional<Log, 'id'> { }
export interface LogModel extends Log, Sequelize.Model<Log, LogCreationAttributes> { }

const attributes: Sequelize.ModelAttributes<LogModel, LogCreationAttributes> = {
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
        field: 'id',
    },
    errorMessage: {
        type: Sequelize.DataTypes.STRING,
        field: 'error_message',
    },
    errorType: {
        type: Sequelize.DataTypes.STRING,
        field: 'error_type',
    },
    createdAt: {
        type: Sequelize.DataTypes.DATE,
        field: 'created_at',
    },
    stacktrace: {
        type: Sequelize.DataTypes.STRING,
        field: 'stack_trace',
    },
    createdBy: {
        type: Sequelize.DataTypes.STRING,
        field: 'created_by',
    },
};

export const Logs = sequelizeInstance.define<LogModel, LogCreationAttributes>('Log', attributes, {
    tableName: 'application_log',
    timestamps: false,
});