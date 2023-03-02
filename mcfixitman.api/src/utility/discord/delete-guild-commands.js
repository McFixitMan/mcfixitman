const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

const clientId = '';
const guildId = '';
const token = '';

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

// and deploy your commands!
(async () => {
    try {
        const data = await rest.get(Routes.applicationGuildCommands(clientId, guildId));

        const promises = [];

        for (const command of data) {
            const deleteUrl = `${Routes.applicationGuildCommands(clientId, guildId)}/${command.id}`;
            promises.push(rest.delete(deleteUrl));
        }

        await Promise.all(promises);

        console.log(`Successfully deleted application guild (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();