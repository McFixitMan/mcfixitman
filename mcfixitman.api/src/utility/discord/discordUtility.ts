import { Events, GatewayIntentBits } from 'discord.js';

import { DiscordClient } from 'src/types/discord';
import { commands } from './commands';
import { config } from 'src/config';

export const startDiscordClient = async (): Promise<void> => {
    const client = new DiscordClient({
        intents: [GatewayIntentBits.Guilds],
    });

    client.on('ready', async () => {
        if (!client.user || !client.application) {
            return;
        }

        console.log('Discord client is online');

        for (const command of commands) {
            client.commands.set(command.data.name, command);
        }
    });

    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isChatInputCommand()) {
            return;
        }

        const command = (interaction.client as DiscordClient).commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found`);

            return;
        }

        try {
            await command.execute(interaction);
        } catch (err) {
            console.error(err);

            await interaction.reply({
                content: `There was an error executing this command`,
                ephemeral: true,
            });
        }
    });

    client.login(config.discord.botToken);
};