import * as Sequelize from 'sequelize';

import { ChatMessage, ChatMessageDraft } from 'mcfixitman.shared/models/dataModels/chatMessage';

import { sequelizeInstance } from 'src/models/dataModels';

export interface ChatMessageInstance extends ChatMessage, Sequelize.Model<ChatMessage, ChatMessageDraft> { }

const attributes: Sequelize.ModelAttributes<ChatMessageInstance, ChatMessageDraft> = {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.DataTypes.INTEGER,
        field: 'id',
    },
    chatId: {
        type: Sequelize.DataTypes.INTEGER,
        field: 'chat_id',
    },
    messageContent: {
        type: Sequelize.DataTypes.STRING,
        field: 'message_content',
    },
    role: {
        type: Sequelize.DataTypes.STRING,
        field: 'role',
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

export const ChatMessages = sequelizeInstance.define<ChatMessageInstance, ChatMessageDraft>('ChatMessage', attributes, {
    tableName: 'chat_message',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
});