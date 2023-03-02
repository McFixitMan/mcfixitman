import { SlashCommand } from 'src/types/discord';
import { SlashCommandBuilder } from 'discord.js';
import { getAiUtility } from 'src/utility/aiUtility';

export const aiImageCommand: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('aiimage')
        .setDescription('A picture is worth a thousand words (please dont use 1000 words)')
        .addStringOption((option) => {
            return option.setName('prompt')
                .setDescription('What do you want a picture of?')
                .setRequired(true);
        }),

    execute: async (interaction) => {
        if (interaction.isRepliable()) {
            if (interaction.isChatInputCommand()) {
                const prompt = interaction.options.getString('prompt');

                if (!!prompt) {
                    await interaction.reply(`\`\`\`${prompt}\`\`\`\nGimme a sec...`);

                    const imageUri = await getAiUtility().createImageUri(prompt);

                    interaction.editReply(`\`\`\`${prompt}\`\`\`\n${imageUri}`);
                }
            }
        }
    },
};