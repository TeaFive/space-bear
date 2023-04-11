import { SuccessMessage, ErrorMessage } from '../components/messages.js';
import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  GuildMember,
  InteractionResponse,
} from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { getServer } from '../lib/cacheHelpers.js';
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
      description: 'User Search',
      required: true,
      type: ApplicationCommandOptionType.User,
    })
    user: GuildMember,
    @SlashOption({
      name: 'reason',
      description: 'reason to mute someone',
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    reason: string,
    @SlashOption({
      name: 'duration',
      description:
        'Duration you want to mute the user. Ex: 5s, 5m, 5hr, 5d, 5w. Max is 28 Days',
      required: false,
      type: ApplicationCommandOptionType.String,
    })
    duration: string,
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
        embeds: [ErrorMessage('An error has occured')],
        ephemeral: true,
      });
    if (!usersRoles)
      return interaction.reply({
        embeds: [ErrorMessage('An error has occured')],
        ephemeral: true,
      });

    const isMod = usersRoles.find((v) => v === server.mod_id);

    if (isMod === undefined)
      return interaction.reply({
        embeds: [ErrorMessage('You are not a mod')],
        ephemeral: true,
      });

    if (
      user.permissions.has('Administrator') ||
      user.permissions.has('ModerateMembers') ||
      user.permissions.has('Administrator') ||
      user.permissions.has('MuteMembers')
    )
      return interaction.reply({
        embeds: [ErrorMessage('That user is a mod/admin.')],
        ephemeral: true,
      });

    const member = interaction.guild.members.cache.get(user.id);

    if (!member)
      return interaction.reply({
        embeds: [ErrorMessage('An error has occured')],
        ephemeral: true,
      });

    if (duration === undefined) {
      member.timeout(2.419e9);

      if (server.mod_log_channel) {
        const channel = await interaction.client.channels.fetch(
          server.mod_log_channel
        );

        if (channel)
          if (channel.isTextBased())
            channel.send({
              embeds: [
                SuccessMessage(
                  `${interaction.user} muted ${user} for 28d\nReason: ${reason}`
                ),
              ],
            });
      }

      interaction.client.users.send(user.id, {
        embeds: [
          ErrorMessage(
            `You have been muted in ${interaction.guild.name} for ${duration}\nReason: ${reason}`
          ),
        ],
      });

      return interaction.reply({
        embeds: [
          SuccessMessage(
            `**${user.user.username}#${user.user.discriminator} was muted for 28 days**`
          ),
        ],
        ephemeral: true,
      });
    }

    const parts = duration.match(/(\d+|\D+)/g);

    if (!parts)
      return interaction.reply({
        embeds: [ErrorMessage('An error has occurred')],
        ephemeral: true,
      });

    if (Number.isNaN(parseInt(parts[0])))
      return interaction.reply({
        embeds: [ErrorMessage('An error has occurred')],
        ephemeral: true,
      });

    if (
      parts[1] !== 's' &&
      parts[1] !== 'm' &&
      parts[1] !== 'hr' &&
      parts[1] !== 'd' &&
      parts[1] !== 'w'
    )
      return interaction.reply({
        embeds: [
          ErrorMessage(
            'Could not determine time.  Make sure your duration follows this format:\n1s\n1m\n1hr\n1d\n1w'
          ),
        ],
        ephemeral: true,
      });

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

    if (server.mod_log_channel) {
      const channel = await interaction.client.channels.fetch(
        server.mod_log_channel
      );

      if (channel)
        if (channel.isTextBased())
          channel.send({
            embeds: [
              SuccessMessage(
                `${interaction.user} muted ${user} for ${duration}\nReason: ${reason}`
              ),
            ],
          });
    }

    interaction.client.users.send(user.id, {
      embeds: [
        ErrorMessage(
          `You have been muted in ${interaction.guild.name} for ${duration}\nReason: ${reason}`
        ),
      ],
    });

    return interaction.reply({
      embeds: [
        SuccessMessage(
          `***${user.user.username}#${user.user.discriminator} was muted.***`
        ),
      ],
      ephemeral: true,
    });
  }

  @Slash({
    name: 'unmute',
    description: 'Unmute the specified user.',
  })
  async unmute(
    @SlashOption({
      name: 'user',
      description: 'User Search',
      required: true,
      type: ApplicationCommandOptionType.User,
    })
    user: GuildMember,
    @SlashOption({
      name: 'reason',
      description: 'Reason to give',
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    reason: string,
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

    if (server.mod_log_channel) {
      const channel = await interaction.client.channels.fetch(
        server.mod_log_channel
      );

      if (channel)
        if (channel.isTextBased())
          channel.send({
            embeds: [
              SuccessMessage(
                `${interaction.user} unmuted ${user}\nReason: ${reason}`
              ),
            ],
          });
    }

    return interaction.reply({
      embeds: [SuccessMessage(`<@${user.id}> was unmuted`)],
      ephemeral: true,
    });
  }
}
