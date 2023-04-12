import { RedEmbed, GreenEmbed, BlueEmbed } from '../components/embeds.js';
import {
  APIEmbedField,
  ApplicationCommandOptionType,
  Client,
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  InteractionResponse,
} from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { supabase } from '../main.js';
import { getServer } from '../lib/cacheHelpers.js';
import userRoles from '../lib/userRoles.js';

@Discord()
export class Warn {
  @Slash({ name: 'warn', description: 'Warn a user' })
  async warn(
    @SlashOption({
      name: 'user',
      description: 'User Search',
      required: true,
      type: ApplicationCommandOptionType.User,
    })
    user: GuildMember,
    @SlashOption({
      name: 'reason',
      description: 'Reason to warn the person',
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    reason: string,
    interaction: ChatInputCommandInteraction,
    client: Client
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
        embeds: [RedEmbed('An error has occurred')],
        ephemeral: true,
      });
    if (!usersRoles)
      return interaction.reply({
        embeds: [RedEmbed('An error has occurred')],
        ephemeral: true,
      });

    const isMod = usersRoles.find((v) => v === server.mod_id);

    if (isMod === undefined)
      return interaction.reply({
        embeds: [RedEmbed('You are not a mod.')],
        ephemeral: true,
      });

    const thisWarn = await supabase
      .from('warning')
      .insert({
        member_id: user.user.id,
        server_id: interaction.guild.id,
        mod_id: interaction.user.id,
        timestamp: interaction.createdTimestamp,
        reason: reason,
      })
      .select();

    if (thisWarn.error) {
      console.error('thisWarn:\n', thisWarn.error);
      return interaction.reply({
        embeds: [RedEmbed('A server error has occurred.')],
        ephemeral: true,
      });
    }

    const embed = new EmbedBuilder()
      .setColor('#ff6b6b')
      .setDescription(
        `You were warned in ${interaction.guild.name} for ${reason}`
      );

    client.users.send(user.user.id, { embeds: [embed] });

    if (server.mod_log_channel) {
      const channel = await interaction.client.channels.fetch(
        server.mod_log_channel
      );

      if (channel)
        if (channel.isTextBased())
          channel.send({
            embeds: [
              BlueEmbed({
                description: `${interaction.user} warned ${user}\nReason: ${reason}`,
                footer: { text: `id: ${thisWarn.data[0].id}` },
              }),
            ],
          });
    }

    return interaction.reply({
      embeds: [
        GreenEmbed(
          `**${user.user.username}#${user.user.discriminator} has been warned**`
        ),
      ],
      ephemeral: true,
    });
  }

  @Slash({ name: 'warnings', description: 'Get all warnings of a user' })
  async warnings(
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
        embeds: [RedEmbed('You cannot use this command in non-servers')],
        ephemeral: true,
      });

    const server = await getServer(interaction.guild.id);
    const usersRoles = await userRoles(interaction);

    if (!server)
      return interaction.reply({
        embeds: [RedEmbed('An error has occurred')],
        ephemeral: true,
      });
    if (!usersRoles)
      return interaction.reply({
        embeds: [RedEmbed('An error has occurred')],
        ephemeral: true,
      });

    const isMod = usersRoles.find((v) => v === server.mod_id);

    if (isMod === undefined)
      return interaction.reply({
        embeds: [RedEmbed('You are not a mod.')],
        ephemeral: true,
      });

    const thisWarns = await supabase
      .from('warning')
      .select()
      .eq('member_id', user.user.id)
      .eq('server_id', interaction.guild.id);

    if (thisWarns.error) {
      console.error('warns.ts 87 thisWarns.error:\n', thisWarns.error);
      return interaction.reply({
        embeds: [RedEmbed('An error has occurred')],
        ephemeral: true,
      });
    }

    if (thisWarns.data.length < 1)
      return interaction.reply({
        embeds: [RedEmbed('There are no warnings')],
        ephemeral: true,
      });

    const fields: APIEmbedField[] = [];

    thisWarns.data.forEach(async (v) => {
      const mod = await interaction.client.users.fetch(v.mod_id);

      const date = new Date(v.timestamp);
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();

      fields.push({
        name: `**ID: ${v.id} | Moderator: ${mod.username}#${mod.discriminator}**`,
        value: `${v.reason} - ${month} ${day} ${year}`,
      });
    });

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${thisWarns.data.length} ${
          thisWarns.data.length > 1 ? 'Warnings' : 'Warning'
        } for ${user.user.username}#${user.user.discriminator} (${
          user.user.id
        })`,
        iconURL: user.displayAvatarURL(),
      })
      .addFields(fields)
      .setColor('#ff6b6b');

    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  @Slash({
    name: 'warning-delete',
    description: 'Delete a warning from a user',
  })
  async delwarning(
    @SlashOption({
      name: 'warning-id',
      description: 'Warning id from a user',
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    warningID: string,
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
        embeds: [RedEmbed('An error has occurred')],
        ephemeral: true,
      });
    if (!usersRoles)
      return interaction.reply({
        embeds: [RedEmbed('An error has occurred')],
        ephemeral: true,
      });

    const isMod = usersRoles.find((v) => v === server.mod_id);

    if (isMod === undefined)
      return interaction.reply({
        embeds: [RedEmbed('You are not a mod.')],
        ephemeral: true,
      });

    const del = await supabase
      .from('warning')
      .delete()
      .eq('id', warningID)
      .select();

    if (del.error) {
      console.error('warns.ts 153 del.error:\n', del.error);
      return interaction.reply({
        embeds: [RedEmbed('An error has occurred')],
        ephemeral: true,
      });
    }

    if (del.data.length < 1)
      return interaction.reply({
        embeds: [RedEmbed('Invalid warning ID')],
        ephemeral: true,
      });

    const user = await interaction.client.users.fetch(del.data[0].member_id);

    if (server.mod_log_channel) {
      const channel = await interaction.client.channels.fetch(
        server.mod_log_channel
      );

      if (channel)
        if (channel.isTextBased())
          channel.send({
            embeds: [
              BlueEmbed({
                description: `${interaction.user} deleted a warn off of ${user}\nWarn Reason: ${del.data[0].reason}`,
                footer: { text: `id: ${del.data[0].id}` },
              }),
            ],
          });
    }

    return interaction.reply({
      embeds: [
        GreenEmbed(
          `Deleted warning \`${warningID}\` for ${user.username}#${user.discriminator}`
        ),
      ],
      ephemeral: true,
    });
  }

  @Slash({
    name: 'warning-clear',
    description: 'Clear all warnings from a user',
  })
  async clearwarnings(
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
        embeds: [RedEmbed('You cannot use this command in non-servers')],
        ephemeral: true,
      });

    const server = await getServer(interaction.guild.id);
    const usersRoles = await userRoles(interaction);

    if (!server)
      return interaction.reply({
        embeds: [RedEmbed('An error has occurred')],
        ephemeral: true,
      });
    if (!usersRoles)
      return interaction.reply({
        embeds: [RedEmbed('An error has occurred')],
        ephemeral: true,
      });

    const isMod = usersRoles.find((v) => v === server.mod_id);

    if (isMod === undefined)
      return interaction.reply({
        embeds: [RedEmbed('You are not a mod.')],
        ephemeral: true,
      });

    const thisWarns = await supabase
      .from('warning')
      .delete()
      .eq('member_id', user.user.id)
      .eq('server_id', interaction.guild.id)
      .select();

    if (thisWarns.error) {
      console.error('warns.ts 202 thisWarns:\n', thisWarns.error);
      return interaction.reply({
        embeds: [RedEmbed('An error has occurred')],
        ephemeral: true,
      });
    }

    if (thisWarns.data.length < 1) {
      return interaction.reply({
        embeds: [
          RedEmbed(
            `No warnings found for ${user.user.username}#${user.user.discriminator}`
          ),
        ],
        ephemeral: true,
      });
    }

    if (server.mod_log_channel) {
      const channel = await interaction.client.channels.fetch(
        server.mod_log_channel
      );

      if (channel)
        if (channel.isTextBased())
          channel.send({
            embeds: [
              BlueEmbed(`${interaction.user} cleared all of ${user}s warnings`),
            ],
          });
    }

    return interaction.reply({
      embeds: [
        GreenEmbed(
          `Cleared ${thisWarns.data.length} ${
            thisWarns.data.length > 1 ? 'warnings' : 'warning'
          } for ${user.user.username}#${user.user.discriminator}`
        ),
      ],
      ephemeral: true,
    });
  }
}
