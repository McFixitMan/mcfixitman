import { Client, ClientOptions, Collection, Interaction, SlashCommandBuilder } from 'discord.js';

export interface SlashCommand {
    data: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
    execute: (interaction: Interaction) => Promise<void>;
}

export class DiscordClient extends Client {
    commands: Collection<string, SlashCommand>;
    constructor(options: ClientOptions) {
        super(options);

        this.commands = new Collection();

        this.loadCommands();
    }

    loadCommands = (): void => {
        // 
    };
}