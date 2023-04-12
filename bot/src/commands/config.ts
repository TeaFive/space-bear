import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  InteractionResponse,
  Role,
  TextChannel,
} from 'discord.js';
import { Discord, Slash, SlashGroup, SlashOption } from 'discordx';
import {
  RedEmbed,
  GreenEmbed,
  YellowEmbed,
  BlueEmbed,
} from '../components/embeds.js';
import userRoles from '../lib/userRoles.js';
import { getServer, setServer } from '../lib/cacheHelpers.js';

@Discord()
@SlashGroup({ name: 'config', description: 'Config for the bot' })
@SlashGroup({
  name: 'level-message',
  description: 'Config for the level messages',
  root: 'config',
})
export class Config {
  @Slash({ name: 'mod-role', description: 'Set the moderation role' })
  @SlashGroup('config')
  async modRole(
    @SlashOption({
      name: 'role',
      description: 'Role Search',
      required: true,
      type: ApplicationCommandOptionType.Role,
    })
    role: Role,
    interaction: ChatInputCommandInteraction
  ): Promise<InteractionResponse<boolean>> {
    if (!interaction.guild)
      return interaction.reply({
        embeds: [RedEmbed('You cannot use this command in non-servers')],
        ephemeral: true,
      });

    await interaction.deferReply({ ephemeral: true });

    const server = await getServer(interaction.guild.id);
    const usersRoles = await userRoles(interaction);

    if (!usersRoles)
      return interaction.reply({
        embeds: [RedEmbed('Could not fetch the data. Try again later')],
        ephemeral: true,
      });

    const isMod = usersRoles.find((v) => v === server.mod_id);

    if (isMod === undefined)
      return interaction.reply({
        embeds: [RedEmbed('You are not a mod')],
        ephemeral: true,
      });

    if (!server)
      return interaction.reply({
        embeds: [RedEmbed('Could not fetch the data. Try again leter')],
        ephemeral: true,
      });

    server.mod_id = role.id;

    setServer(interaction.guild.id, server);

    if (server.mod_log_channel) {
      const channel = await interaction.client.channels.fetch(
        server.mod_log_channel
      );

      if (channel)
        if (channel.isTextBased())
          channel.send({
            embeds: [
              BlueEmbed(
                `<@${interaction.user.id}> set the moderation role to ${role}`
              ),
            ],
          });
    }

    return interaction.reply({
      embeds: [
        GreenEmbed(`Users with the ${role} now have moderator permissions`),
      ],
      ephemeral: true,
    });
  }

  @Slash({
    name: 'mod-logs',
    description: 'Logs channel for moderation commands',
  })
  @SlashGroup('config')
  async modLogs(
    @SlashOption({
      name: 'channel',
      description: 'Channel Search',
      required: true,
      type: ApplicationCommandOptionType.Channel,
    })
    channel: TextChannel,
    interaction: ChatInputCommandInteraction
  ): Promise<InteractionResponse<boolean>> {
    if (!interaction.guild)
      return interaction.reply({
        embeds: [RedEmbed('You cannot use this command in non-servers')],
        ephemeral: true,
      });

    await interaction.deferReply({ ephemeral: true });

    const server = await getServer(interaction.guild.id);
    const usersRoles = await userRoles(interaction);

    if (!usersRoles)
      return interaction.reply({
        embeds: [RedEmbed('Could not fetch the data. Try again later')],
        ephemeral: true,
      });

    const isMod = usersRoles.find((v) => v === server.mod_id);

    if (isMod === undefined) {
      return interaction.reply({
        embeds: [RedEmbed('You are not a mod.')],
        ephemeral: true,
      });
    }

    if (!server)
      return interaction.reply({
        embeds: [RedEmbed('Could not fetch the data. Try again leter')],
        ephemeral: true,
      });

    server.mod_log_channel = channel.id;

    setServer(interaction.guild.id, server);

    if (server.mod_log_channel) {
      const channel = await interaction.client.channels.fetch(
        server.mod_log_channel
      );

      if (channel)
        if (channel.isTextBased())
          channel.send({
            embeds: [
              BlueEmbed(
                `${interaction.user} set the moderation logs channel to ${channel}`
              ),
            ],
          });
    }

    return interaction.reply({
      embeds: [GreenEmbed(`Set the logs channel to ${channel}`)],
      ephemeral: true,
    });
  }

  @Slash({
    name: 'add-channel',
    description: 'Add a channel that members can level up in',
  })
  @SlashGroup('level-message', 'config')
  async levelMessageAddChannel(
    @SlashOption({
      name: 'channel',
      description: 'Channel Search',
      required: true,
      type: ApplicationCommandOptionType.Channel,
    })
    channel: TextChannel,
    interaction: ChatInputCommandInteraction
  ): Promise<InteractionResponse<boolean>> {
    if (!interaction.guild)
      return interaction.reply({
        embeds: [RedEmbed('You cannot use this command in non-servers')],
        ephemeral: true,
      });

    await interaction.deferReply({ ephemeral: true });

    const server = await getServer(interaction.guild.id);
    const usersRoles = await userRoles(interaction);

    if (!usersRoles)
      return interaction.reply({
        embeds: [RedEmbed('Could not fetch the data. Try again later')],
        ephemeral: true,
      });

    const isMod = usersRoles.find((v) => v === server.mod_id);

    if (isMod === undefined) {
      return interaction.reply({
        embeds: [RedEmbed('You are not a mod.')],
        ephemeral: true,
      });
    }

    if (!server)
      return interaction.reply({
        embeds: [RedEmbed('Could not fetch the data. Try again leter')],
        ephemeral: true,
      });

    if (server.level_comlumn.find((v) => v === channel.id))
      return interaction.reply({
        embeds: [YellowEmbed('Channel is already added')],
        ephemeral: true,
      });

    server.level_comlumn.push(channel.id);

    setServer(interaction.guild.id, server);

    if (server.mod_log_channel) {
      const channel = await interaction.client.channels.fetch(
        server.mod_log_channel
      );

      if (channel)
        if (channel.isTextBased())
          channel.send({
            embeds: [
              BlueEmbed(
                `${interaction.user} added ${channel} to the possible channels members can level up from`
              ),
            ],
          });
    }

    return interaction.reply({
      embeds: [GreenEmbed(`Added ${channel} to the list`)],
      ephemeral: true,
    });
  }

  @Slash({
    name: 'remove-channel',
    description: 'Remove a channel that members can level up in',
  })
  @SlashGroup('level-message', 'config')
  async levelMessageRemoveChannel(
    @SlashOption({
      name: 'channel',
      description: 'Channel Search',
      required: true,
      type: ApplicationCommandOptionType.Channel,
    })
    channel: TextChannel,
    interaction: ChatInputCommandInteraction
  ): Promise<InteractionResponse<boolean>> {
    if (!interaction.guild)
      return interaction.reply({
        embeds: [RedEmbed('You cannot use this command in non-servers')],
        ephemeral: true,
      });

    await interaction.deferReply({ ephemeral: true });

    const server = await getServer(interaction.guild.id);
    const usersRoles = await userRoles(interaction);

    if (!server)
      return interaction.reply({
        embeds: [RedEmbed('Could not fetch the data. Try again later')],
        ephemeral: true,
      });
    if (!usersRoles)
      return interaction.reply({
        embeds: [RedEmbed('Could not fetch the data. Try again later')],
        ephemeral: true,
      });

    const isMod = usersRoles.find((v) => v === server.mod_id);

    if (isMod === undefined) {
      return interaction.reply({
        embeds: [RedEmbed('You are not a mod.')],
        ephemeral: true,
      });
    }

    if (!server)
      return interaction.reply({
        embeds: [RedEmbed('Could not fetch the data. Try again later')],
        ephemeral: true,
      });

    server.level_comlumn = server.level_comlumn.filter((v) => v !== channel.id);

    setServer(interaction.guild.id, server);

    if (server.mod_log_channel) {
      const channel = await interaction.client.channels.fetch(
        server.mod_log_channel
      );

      if (channel)
        if (channel.isTextBased())
          channel.send({
            embeds: [
              BlueEmbed(
                `${interaction.user} removed ${channel} to the possible channels members can level up from`
              ),
            ],
          });
    }

    return interaction.reply({
      embeds: [GreenEmbed(`Removed ${channel.id} from the list`)],
      ephemeral: true,
    });
  }

  @Slash({
    name: 'list-channels',
    description: 'List out the channels a member can level up from',
  })
  @SlashGroup('level-message', 'config')
  async levelMessageListChannels(
    interaction: ChatInputCommandInteraction
  ): Promise<InteractionResponse<boolean>> {
    if (!interaction.guild)
      return interaction.reply({
        embeds: [RedEmbed('You cannot use this command in non-servers')],
        ephemeral: true,
      });

    await interaction.deferReply({ ephemeral: true });

    const server = await getServer(interaction.guild.id);
    const usersRoles = await userRoles(interaction);

    if (!server)
      return interaction.reply({
        embeds: [RedEmbed('Could not fetch the data. Try again later')],
        ephemeral: true,
      });
    if (!usersRoles)
      return interaction.reply({
        embeds: [RedEmbed('Could not fetch the data. Try again later')],
        ephemeral: true,
      });

    const isMod = usersRoles.find((v) => v === server.mod_id);

    if (isMod === undefined) {
      return interaction.reply({
        embeds: [RedEmbed('You are not a mod.')],
        ephemeral: true,
      });
    }

    if (!server)
      return interaction.reply({
        embeds: [RedEmbed('Could not fetch the data. Try again later')],
        ephemeral: true,
      });

    if (server.level_comlumn.length < 1)
      return interaction.reply({
        embeds: [RedEmbed('There are no channels')],
        ephemeral: true,
      });

    const channels = server.level_comlumn.map((v) => `<#${v}>`).join('\n');

    const embed = new EmbedBuilder()
      .setTitle('Channels:')
      .setDescription(channels);

    return interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  }

  @Slash({
    name: 'set-channel',
    description: 'Set the channel the level up messages will be sent',
  })
  @SlashGroup('level-message', 'config')
  async levelMessageSetChannel(
    @SlashOption({
      name: 'channel',
      description: 'Channel search',
      required: true,
      type: ApplicationCommandOptionType.Channel,
    })
    channel: TextChannel,
    interaction: ChatInputCommandInteraction
  ): Promise<InteractionResponse<boolean>> {
    if (!interaction.guild)
      return interaction.reply({
        embeds: [RedEmbed('You cannot use this command in non-servers')],
        ephemeral: true,
      });

    await interaction.deferReply({ ephemeral: true });

    const server = await getServer(interaction.guild.id);
    const usersRoles = await userRoles(interaction);

    if (!server)
      return interaction.reply({
        embeds: [RedEmbed('Could not fetch the data. Try again later')],
        ephemeral: true,
      });
    if (!usersRoles)
      return interaction.reply({
        embeds: [RedEmbed('Could not fetch the data. Try again later')],
        ephemeral: true,
      });

    const isMod = usersRoles.find((v) => v === server.mod_id);

    if (isMod === undefined) {
      return interaction.reply({
        embeds: [RedEmbed('You are not a mod.')],
        ephemeral: true,
      });
    }

    server.level_message_channel = channel.id;

    setServer(interaction.guild.id, server);

    if (server.mod_log_channel) {
      const channel = await interaction.client.channels.fetch(
        server.mod_log_channel
      );

      if (channel)
        if (channel.isTextBased())
          channel.send({
            embeds: [
              BlueEmbed(
                `${interaction.user} set the level message log channel to ${channel}`
              ),
            ],
          });
    }

    return interaction.reply({
      embeds: [GreenEmbed(`Set level messages to go to <\#${channel.id}>`)],
      ephemeral: true,
    });
  }

  @Slash({
    name: 'add-role',
    description: 'Add a role reward for the selected level',
  })
  @SlashGroup('level-message', 'config')
  async levelMessageAddRole(
    @SlashOption({
      name: 'role',
      description: 'Role Search',
      required: true,
      type: ApplicationCommandOptionType.Role,
    })
    role: Role,
    @SlashOption({
      name: 'level',
      description: 'Level you want the role to be gained on',
      required: true,
      type: ApplicationCommandOptionType.Number,
    })
    level: number,
    interaction: ChatInputCommandInteraction
  ): Promise<InteractionResponse<boolean>> {
    if (!interaction.guild)
      return interaction.reply({
        embeds: [RedEmbed('You cannot use this command in non-servers')],
        ephemeral: true,
      });

    const server = await getServer(interaction.guild.id);
    const usersRoles = await userRoles(interaction);

    if (!server)
      return interaction.reply({
        embeds: [RedEmbed('Could not fetch the data. Try again later')],
        ephemeral: true,
      });
    if (!usersRoles)
      return interaction.reply({
        embeds: [RedEmbed('Could not fetch the data. Try again later')],
        ephemeral: true,
      });

    const isMod = usersRoles.find((v) => v === server.mod_id);

    if (isMod === undefined) {
      return interaction.reply({
        embeds: [RedEmbed('You are not a mod.')],
        ephemeral: true,
      });
    }

    if (!server)
      return interaction.reply({
        embeds: [RedEmbed('Could not fetch the data. Try again leter')],
        ephemeral: true,
      });

    if (server.level_ranks.find((v) => v.role_id === role.id)) {
      return interaction.reply({
        embeds: [YellowEmbed('Role is already added')],
        ephemeral: true,
      });
    }
    server.level_ranks.push({ role_id: role.id, level: level });

    setServer(interaction.guild.id, server);

    if (server.mod_log_channel) {
      const channel = await interaction.client.channels.fetch(
        server.mod_log_channel
      );

      if (channel)
        if (channel.isTextBased())
          channel.send({
            embeds: [
              BlueEmbed(
                `${interaction.user} set ${role} to be gained at level \`${level}\``
              ),
            ],
          });
    }

    return interaction.reply({
      embeds: [GreenEmbed(`Set ${role} to be gained at level \`${level}\``)],
      ephemeral: true,
    });
  }

  @Slash({
    name: 'remove-role',
    description: 'Remove a role reward for the selected level',
  })
  @SlashGroup('level-message', 'config')
  async levelMessageRemoveRole(
    @SlashOption({
      name: 'role',
      description: 'Role Search',
      required: true,
      type: ApplicationCommandOptionType.Role,
    })
    role: Role,
    interaction: ChatInputCommandInteraction
  ): Promise<InteractionResponse<boolean>> {
    if (!interaction.guild)
      return interaction.reply({
        embeds: [RedEmbed('You cannot use this command in non-servers')],
        ephemeral: true,
      });

    await interaction.deferReply({ ephemeral: true });

    const server = await getServer(interaction.guild.id);
    const usersRoles = await userRoles(interaction);

    if (!server)
      return interaction.reply({
        embeds: [RedEmbed('Could not fetch the data. Try again later')],
        ephemeral: true,
      });
    if (!usersRoles)
      return interaction.reply({
        embeds: [RedEmbed('Could not fetch the data. Try again later')],
        ephemeral: true,
      });

    const isMod = usersRoles.find((v) => v === server.mod_id);

    if (isMod === undefined) {
      return interaction.reply({
        embeds: [RedEmbed('You are not a mod.')],
        ephemeral: true,
      });
    }

    if (!server)
      return interaction.reply({
        embeds: [RedEmbed('Could not fetch the data. Try again leter')],
        ephemeral: true,
      });

    const old = server.level_ranks;
    server.level_ranks = server.level_ranks.filter(
      (v) => v.role_id !== role.id
    );

    if (JSON.stringify(old) === JSON.stringify(server.level_ranks))
      return interaction.reply({
        embeds: [YellowEmbed('Role not found in list')],
        ephemeral: true,
      });

    setServer(interaction.guild.id, server);

    if (server.mod_log_channel) {
      const channel = await interaction.client.channels.fetch(
        server.mod_log_channel
      );

      if (channel)
        if (channel.isTextBased())
          channel.send({
            embeds: [
              BlueEmbed(
                `${interaction.user} removed ${role} to be gained as a message level reward`
              ),
            ],
          });
    }

    return interaction.reply({
      embeds: [GreenEmbed(`Removed ${role} from the list of roles to gain`)],
      ephemeral: true,
    });
  }

  @Slash({
    name: 'list-roles',
    description: 'List the roles for each level',
  })
  @SlashGroup('level-message', 'config')
  async levelMessageListRoles(
    interaction: ChatInputCommandInteraction
  ): Promise<InteractionResponse<boolean>> {
    if (!interaction.guild)
      return interaction.reply({
        embeds: [RedEmbed('You cannot use this command in non-servers')],
        ephemeral: true,
      });

    await interaction.deferReply({ ephemeral: true });

    const server = await getServer(interaction.guild.id);
    const usersRoles = await userRoles(interaction);

    if (!server)
      return interaction.reply({
        embeds: [RedEmbed('Could not fetch the data. Try again later')],
        ephemeral: true,
      });
    if (!usersRoles)
      return interaction.reply({
        embeds: [RedEmbed('Could not fetch the data. Try again later')],
        ephemeral: true,
      });

    const isMod = usersRoles.find((v) => v === server.mod_id);

    if (isMod === undefined) {
      return interaction.reply({
        embeds: [RedEmbed('You are not a mod.')],
        ephemeral: true,
      });
    }

    if (!server)
      return interaction.reply({
        embeds: [RedEmbed('Could not fetch the data. Try again later')],
        ephemeral: true,
      });

    if (server.level_ranks.length < 1)
      return interaction.reply({
        embeds: [RedEmbed('There are no roles')],
        ephemeral: true,
      });

    const ranks = server.level_ranks
      .map((v) => `<@&${v.role_id}> at level ${v.level}`)
      .join('\n');

    const embed = new EmbedBuilder().setTitle('Ranks:').setDescription(ranks);

    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
}
