import { SuccessMessage, ErrorMessage } from '../components/messages.js';

import {
  ApplicationCommandOptionType,
  CommandInteraction,
  GuildMember,
} from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { fetchServer } from '../lib/fetchSupa.js';
import userRoles from '../lib/userRoles.js';

@Discord()
export class Mute {
  @Slash({
    name: 'mute',
    description: 'Mute the specified user. Defualt is 28 Days',
  })
  async mute(
    @SlashOption({
      name: 'user',
      description: 'User you want to mute',
      required: true,
      type: ApplicationCommandOptionType.User,
    })
    user: GuildMember,
    @SlashOption({
      name: 'duration',
      description:
        'Duration you want to mute the user. Ex: 5s, 5m, 5hr, 5d, 5w. Max is 28 Days',
      type: ApplicationCommandOptionType.String,
    })
    duration: string,
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

    if (
      user.permissions.has('Administrator') ||
      user.permissions.has('ModerateMembers') ||
      user.permissions.has('Administrator') ||
      user.permissions.has('MuteMembers')
    ) {
      interaction.reply({
        embeds: [ErrorMessage('That user is a mod/admin.')],
        ephemeral: true,
      });
      return;
    }

    if (!interaction.guild) return;

    const member = interaction.guild.members.cache.get(user.id);

    if (!member) return;

    if (duration === undefined) {
      member.timeout(2.419e9);

      interaction.reply({
        embeds: [
          SuccessMessage(
            `**${user.user.username}#${user.user.discriminator} was muted.**`
          ),
        ],
      });
      return;
    }

    const parts = duration.match(/(\d+|\D+)/g);

    if (!parts) return;

    if (Number.isNaN(parseInt(parts[0]))) return;

    if (
      parts[1] !== 's' &&
      parts[1] !== 'm' &&
      parts[1] !== 'hr' &&
      parts[1] !== 'd' &&
      parts[1] !== 'w'
    )
      return;

    let multi = 2.419e9;

    if (parts[1] === 's') {
      multi = 1000;
    } else if (parts[1] === 'm') {
      multi = 60000;
    } else if (parts[1] === 'hr') {
      multi = 3.6e6;
    } else if (parts[1] === 'd') {
      multi = 8.64e7;
    } else if (parts[1] === 'w') {
      multi = 6.048e8;
    }

    member.timeout(parseInt(parts[0]) * multi);

    interaction.reply({
      embeds: [
        SuccessMessage(
          `***${user.user.username}#${user.user.discriminator} was muted.***`
        ),
      ],
    });
  }
}
