import * as Sequelize from 'sequelize';

import { RefreshToken } from 'mcfixitman.shared/models/dataModels/refreshToken';
import { sequelizeInstance } from 'src/models/dataModels';

export interface RefreshTokenInstance extends RefreshToken, Sequelize.Model<RefreshToken, RefreshTokenCreationAttributes> {

}

export interface RefreshTokenCreationAttributes extends Sequelize.Optional<RefreshToken, 'id'> { }

const attributes: Sequelize.ModelAttributes<RefreshTokenInstance, RefreshTokenCreationAttributes> = {
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.BIGINT,
        field: 'id',
    },
    memberId: {
        type: Sequelize.DataTypes.INTEGER,
        field: 'member_id',
    },
    deviceUUID: {
        type: Sequelize.DataTypes.STRING,
        field: 'device_uuid',
    },
    tokenHash: {
        type: Sequelize.DataTypes.STRING,
        field: 'token_hash',
    },
    dateCreated: {
        type: Sequelize.DataTypes.DATE,
        field: 'created_at',
    },
    lastUpdated: {
        type: Sequelize.DataTypes.DATE,
        field: 'updated_at',
    },
};

export const RefreshTokens = sequelizeInstance.define<RefreshTokenInstance, RefreshTokenCreationAttributes>('RefreshToken', attributes, {
    tableName: 'refresh_token',
    timestamps: true,
    createdAt: 'dateCreated',
    updatedAt: 'lastUpdated',
});