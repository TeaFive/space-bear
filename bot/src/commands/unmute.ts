import {
  ApplicationCommandOptionType,
  CommandInteraction,
  GuildMember,
} from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { ErrorMessage } from '../components/messages.js';
import { fetchServer } from '../lib/fetchSupa.js';
import userRoles from '../lib/userRoles.js';

@Discord()
export class Unmute {
  @Slash({
    name: 'unmute',
    description: 'Unmute the specified user.',
  })
  async mute(
    @SlashOption({
      name: 'user',
      description: 'User you want to mute',
      required: true,
      type: ApplicationCommandOptionType.User,
    })
    user: GuildMember,
    interaction: CommandInteraction
  ): Promise<void> {
    if (!interaction.guild) return;

    const server = await fetchServer(interaction.guild.id);
    const usersRoles = await userRoles(interaction);

    if (!server) return;
    if (!usersRoles) return;

    const isMod = usersRoles.find((v) => v === server.mod_id);

    if (isMod === undefined) {
      interaction.reply({
        embeds: [ErrorMessage('You are not a mod.')],
        ephemeral: true,
      });
      return;
    }

    const member = interaction.guild.members.cache.get(user.id);

    if (!member) return;

    member.timeout(null);

    interaction.reply(`<@${user.id}> was unmuted`);
  }
}
