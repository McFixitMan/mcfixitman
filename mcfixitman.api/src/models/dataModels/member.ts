import * as Sequelize from 'sequelize';

import { Member } from 'mcfixitman.shared/models/dataModels/member';
import { sequelizeInstance } from 'src/models/dataModels';

export interface MemberCreationAttributes extends Sequelize.Optional<Member, 'id'> { }
export interface MemberInstance extends Member, Sequelize.Model<Member, MemberCreationAttributes> { }

const attributes: Sequelize.ModelAttributes<MemberInstance, MemberCreationAttributes> = {
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
        field: 'id',
    },
    emailAddress: {
        type: Sequelize.DataTypes.STRING,
        field: 'email_address',
    },
    firstName: {
        type: Sequelize.DataTypes.STRING,
        field: 'first_name',
    },
    isAdmin: {
        type: Sequelize.DataTypes.BOOLEAN,
        field: 'is_admin',
    },
    lastName: {
        type: Sequelize.DataTypes.STRING,
        field: 'last_name',
    },
    createdAt: {
        type: Sequelize.DataTypes.DATE,
        field: 'created_at',
    },
    updatedAt: {
        type: Sequelize.DataTypes.DATE,
        field: 'updated_at',
    },
    passwordHash: {
        type: Sequelize.DataTypes.STRING,
        field: 'password_hash',
    },
};

export enum MemberScopes {
    default = 'defaultScope',
    withPassword = 'withPassword',
}

const membersRepo = sequelizeInstance.define<MemberInstance, MemberCreationAttributes>('Member', attributes, {
    tableName: 'member',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    defaultScope: {
        attributes: {
            exclude: ['password_hash'],
        },
    },
    scopes: {
        [MemberScopes.withPassword]: {
            attributes: undefined,
        },
    },
});

export const Members = membersRepo.scope(MemberScopes.default);