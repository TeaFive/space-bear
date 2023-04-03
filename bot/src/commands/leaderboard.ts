import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  MessageActionRowComponentBuilder,
} from 'discord.js';
import { ButtonComponent, Discord, Slash } from 'discordx';

@Discord()
export class Pat {
  @Slash({ name: 'leaderboard', description: 'Get the servers leaderboard' })
  async send(interaction: CommandInteraction): Promise<void> {
    if (!interaction.guild) return;

    const row =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel(`${interaction.guild.name}'s Leaderboard`)
          .setStyle(ButtonStyle.Link)
          .setURL(`http://localhost:3000/leaderboard/${interaction.guild.id}`)
      );

    interaction.reply({ content: 'Here you go!', components: [row] });
  }
}
