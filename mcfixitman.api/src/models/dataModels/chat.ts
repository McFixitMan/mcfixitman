import * as Sequelize from 'sequelize';

import { Chat, ChatDraft } from 'mcfixitman.shared/models/dataModels/chat';
import { HasManyAddAssociationMixin, ScopeOptions } from 'sequelize';

import { ChatMessageDraft } from 'mcfixitman.shared/models/dataModels/chatMessage';
import { ChatMessages } from 'src/models/dataModels/chatMessage';
import { nameof } from 'ts-simple-nameof';
import { sequelizeInstance } from 'src/models/dataModels';

export interface ChatInstance extends Chat, Sequelize.Model<Chat, ChatDraft> {
    addChatMessage: HasManyAddAssociationMixin<ChatMessageDraft, number>;
}

const attributes: Sequelize.ModelAttributes<ChatInstance, ChatDraft> = {
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
        field: 'id',
    },
    memberId: {
        type: Sequelize.DataTypes.INTEGER,
        field: 'member_id',
    },
    createdAt: {
        type: Sequelize.DataTypes.DATE,
        field: 'created_at',
    },
    updatedAt: {
        type: Sequelize.DataTypes.DATE,
        field: 'updated_at',
    },
};

export const ChatScopes = {
    default: 'defaultScope',
    includeChatMessages: 'includeChatMessages',
    byId: (id: number): string | ScopeOptions => {
        return {
            method: [nameof<ChatScope>(x => x.byId), id],
        };
    },
    byMemberId: (memberId: number): string | ScopeOptions => {
        return {
            method: [nameof<ChatScope>(x => x.byMemberId), memberId],
        };
    },
};

type ChatScope = typeof ChatScopes;

export const Chats = sequelizeInstance.define<ChatInstance, ChatDraft>('Chat', attributes, {
    tableName: 'chat',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',

    defaultScope: {
        // Default scope
    },
    scopes: {
        [ChatScopes.includeChatMessages]: {
            include: {
                model: ChatMessages,
                as: nameof<Chat>(x => x.chatMessages),
            },
        },
        [nameof<ChatScope>(x => x.byId)](id: number) {
            return {
                where: {
                    id: id,
                },
            };
        },
        [nameof<ChatScope>(x => x.byMemberId)](memberId: number) {
            return {
                where: {
                    memberId: memberId,
                },
            };
        },
    },
});
