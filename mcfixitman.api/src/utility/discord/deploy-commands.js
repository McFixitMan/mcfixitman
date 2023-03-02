const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

const clientId = '';
const token = '';

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

const aiCommand = {
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
                    const gpt3Response = await getCompletion(prompt);

                    let response = gpt3Response;
                    if (response.startsWith('\n\n')) {
                        response = response.replace('\n\n', '');
                    }

                    interaction.editReply(`\`\`\`${prompt}\`\`\`\n${response}`);
                }
            }
        }
    },
};

const aiImageCommand = {
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

                    const gp3ImageUrl = await createImage(prompt);

                    interaction.editReply(`\`\`\`${prompt}\`\`\`\n${gp3ImageUrl}`);
                }
            }
        }
    },
};

// and deploy your commands!
(async () => {
    try {
        console.log(`Started refreshing application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationCommands(clientId),
            { body: [aiCommand.data.toJSON(), aiImageCommand.data.toJSON()] },
        );

        console.log(`Successfully reloaded application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();