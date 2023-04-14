import { ChatInputCommandInteraction, Message } from 'discord.js';
import { Discord, Slash } from 'discordx';
import { GreenEmbed } from '../components/embeds.js';

@Discord()
export class Test {
  @Slash({ name: 'test', description: 'test' })
  async send(
    interaction: ChatInputCommandInteraction
  ): Promise<Message<boolean>> {
    interaction.deferReply({ ephemeral: true });

    await new Promise((r) => setTimeout(r, 4000));

    return interaction.editReply({
      embeds: [GreenEmbed('Hello')],
    });
  }
}
