import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  MessageActionRowComponentBuilder,
} from 'discord.js';
import { Discord, Slash } from 'discordx';

@Discord()
export class Pat {
  @Slash({ name: 'source-code', description: 'Get the servers leaderboard' })
  async send(interaction: CommandInteraction): Promise<void> {
    if (!interaction.guild) return;

    const row =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel(`Space Bears Source Code!`)
          .setStyle(ButtonStyle.Link)
          .setURL(`https://github.com/FroggyPanda/space-bear`)
      );

    interaction.reply({ content: 'Here you go!', components: [row] });
  }
}
