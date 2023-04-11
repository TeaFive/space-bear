import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  GuildMember,
  InteractionResponse,
} from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { ErrorMessage, SuccessMessage } from '../components/messages.js';
import { getServer } from '../lib/cacheHelpers.js';
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
      description: 'User Search',
      required: true,
      type: ApplicationCommandOptionType.User,
    })
    user: GuildMember,
    interaction: ChatInputCommandInteraction
  ): Promise<InteractionResponse<boolean>> {
    if (!interaction.guild)
      return interaction.reply({
        embeds: [ErrorMessage('You cannot use this command in non-servers')],
        ephemeral: true,
      });

    const server = await getServer(interaction.guild.id);
    const usersRoles = await userRoles(interaction);

    if (!server)
      return interaction.reply({
        embeds: [ErrorMessage('An error has occurred')],
        ephemeral: true,
      });
    if (!usersRoles)
      return interaction.reply({
        embeds: [ErrorMessage('An error has occurred')],
        ephemeral: true,
      });

    const isMod = usersRoles.find((v) => v === server.mod_id);

    if (isMod === undefined)
      return interaction.reply({
        embeds: [ErrorMessage('You are not a mod.')],
        ephemeral: true,
      });

    const member = interaction.guild.members.cache.get(user.id);

    if (!member)
      return interaction.reply({
        embeds: [ErrorMessage('An error has occurred')],
        ephemeral: true,
      });

    member.timeout(null);

    return interaction.reply({
      embeds: [SuccessMessage(`<@${user.id}> was unmuted`)],
      ephemeral: true,
    });
  }
}
