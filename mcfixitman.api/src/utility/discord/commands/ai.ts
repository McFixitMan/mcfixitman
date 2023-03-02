import { SlashCommand } from 'src/types/discord';
import { SlashCommandBuilder } from 'discord.js';
import { getAiUtility } from 'src/utility/aiUtility';

export const aiCommand: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('ai')
        .setDescription('Talk to McFixitBOT')
        .addStringOption((option) => {
            return option.setName('prompt')
                .setDescription('What would you like to say?')
                .setRequired(true);

        }),

    execute: async (interaction) => {
        if (interaction.isRepliable()) {
            if (interaction.isChatInputCommand()) {
                const prompt = interaction.options.getString('prompt');

                if (!!prompt) {
                    await interaction.reply(`\`\`\`${prompt}\`\`\`\nGimme a sec...`);
                    const completion = await getAiUtility().createCompletion(prompt);

                    interaction.editReply(`\`\`\`${prompt}\`\`\`\n${completion}`);
                }
            }
        }
    },
};