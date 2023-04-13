import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Database } from 'schema';

type Server = Database['public']['Tables']['server']['Row'];

export async function modLog(
  embed: EmbedBuilder,
  interaction: ChatInputCommandInteraction,
  server: Server
): Promise<void> {
  if (server.mod_log_channel) {
    const channel = await interaction.client.channels.fetch(
      server.mod_log_channel
    );

    if (channel) {
      if (channel.isTextBased()) {
        channel.send({
          embeds: [embed],
        });
      }
    }
  }
}
