import {
  ApplicationCommandOptionType,
  CommandInteraction,
  Role,
} from 'discord.js';
import { Discord, Slash, SlashGroup, SlashOption } from 'discordx';
import { fetchServer } from '../lib/fetchSupa.js';
import { supabase } from '../main.js';
import { ErrorMessage, SuccessMessage } from '../components/messages.js';

@Discord()
@SlashGroup({ name: 'config', description: 'Config for the bot' })
@SlashGroup('config')
export class AddMod {
  @Slash({ name: 'mod-role', description: 'Set the moderation role' })
  async modRole(
    @SlashOption({
      name: 'role',
      description: 'role to add',
      required: true,
      type: ApplicationCommandOptionType.Role,
    })
    role: Role,
    interaction: CommandInteraction
  ): Promise<void> {
    if (!interaction.guild) return;

    const server = await fetchServer(interaction.guild.id);

    if (!server) return;

    server.mod_id = role.id;

    const update = await supabase
      .from('server')
      .update(server)
      .eq('id', server.id);

    if (update.error) {
      console.error('config.ts update.error:\n', update.error);
      interaction.reply({
        embeds: [ErrorMessage('A server error has occured')],
        ephemeral: true,
      });
    }

    interaction.reply({
      embeds: [
        SuccessMessage(
          `Users with the \`${role.name}\` now have moderator permissions`
        ),
      ],
    });
  }
}
