import { Chat } from 'mcfixitman.shared/models/dataModels/chat';
import { ChatMessage } from 'mcfixitman.shared/models/dataModels/chatMessage';
import { ChatMessages } from 'src/models/dataModels/chatMessage';
import { Chats } from 'src/models/dataModels/chat';
import { nameof } from 'ts-simple-nameof';

/**
 * Applies sequelize model associations
 */
export const applyAssociations = (): void => {
    // Add associations here for all required models

    ChatMessages.belongsTo(Chats, {
        as: nameof<ChatMessage>(x => x.chat),
        foreignKey: {
            allowNull: false,
            name: nameof<ChatMessage>(x => x.chatId),
        },
    });

    Chats.hasMany(ChatMessages, {
        as: nameof<Chat>(x => x.chatMessages),
        foreignKey: nameof<ChatMessage>(x => x.chatId),
    });
};

