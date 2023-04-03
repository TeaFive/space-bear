import { ErrorMessage, SuccessMessage } from '../components/messages.js';
import {
  APIEmbedField,
  ApplicationCommandOptionType,
  Client,
  CommandInteraction,
  EmbedBuilder,
  GuildMember,
} from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { supabase } from '../main.js';
import { fetchServer } from '../lib/fetchSupa.js';
import userRoles from '../lib/userRoles.js';

@Discord()
export class Warn {
  @Slash({ name: 'warn', description: 'Warn a user' })
  async warn(
    @SlashOption({
      name: 'user',
      description: 'User you want to warn',
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
    interaction: CommandInteraction,
    client: Client
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
      interaction.reply({
        embeds: [ErrorMessage('A server error has occurred.')],
        ephemeral: true,
      });
      return;
    }

    interaction.reply({
      embeds: [
        SuccessMessage(
          `***${user.user.username}#${user.user.discriminator} has been warned***`
        ),
      ],
    });

    const embed = new EmbedBuilder()
      .setColor('#ff6b6b')
      .setDescription(
        `You were warned in ${interaction.guild.name} for ${reason}`
      );

    client.users.send(user.user.id, { embeds: [embed] });
  }

  @Slash({ name: 'warnings', description: 'Get all warnings of a user' })
  async warnings(
    @SlashOption({
      name: 'user',
      description: 'User to get the warnings of',
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

    const thisWarns = await supabase
      .from('warning')
      .select()
      .eq('member_id', user.user.id)
      .eq('server_id', interaction.guild.id)
      .limit(1);

    if (thisWarns.error) {
      console.error('warns.ts 87 thisWarns.error:\n', thisWarns.error);
      return;
    }

    if (thisWarns.data.length < 1) {
      interaction.reply({
        embeds: [ErrorMessage('There are no warnings')],
        ephemeral: true,
      });

      return;
    }

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

    interaction.reply({ embeds: [embed] });
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

    const del = await supabase
      .from('warning')
      .delete()
      .eq('id', warningID)
      .select();

    if (del.error) {
      console.error('warns.ts 153 del.error:\n', del.error);
      return;
    }

    if (del.data.length < 1) {
      interaction.reply({
        embeds: [ErrorMessage('Invalid warning ID')],
        ephemeral: true,
      });
      return;
    }

    const user = await interaction.client.users.fetch(del.data[0].member_id);

    interaction.reply({
      embeds: [
        SuccessMessage(
          `Deleted warning \`${warningID}\` for ${user.username}#${user.discriminator}`
        ),
      ],
    });
  }

  @Slash({
    name: 'warning-clear',
    description: 'Clear all warnings from a user',
  })
  async clearwarnings(
    @SlashOption({
      name: 'user',
      description: 'User to clear the warnings of',
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

    const thisWarns = await supabase
      .from('warning')
      .delete()
      .eq('member_id', user.user.id)
      .eq('server_id', interaction.guild.id)
      .select()
      .limit(1);

    if (thisWarns.error) {
      console.error('warns.ts 202 thisWarns:\n', thisWarns.error);
      return;
    }

    if (thisWarns.data.length < 1) {
      interaction.reply({
        embeds: [
          ErrorMessage(
            `No warnings found for ${user.user.username}#${user.user.discriminator}`
          ),
        ],
        ephemeral: true,
      });
      return;
    }

    interaction.reply({
      embeds: [
        SuccessMessage(
          `Cleared ${thisWarns.data.length} ${
            thisWarns.data.length > 1 ? 'warnings' : 'warning'
          } for ${user.user.username}#${user.user.discriminator}`
        ),
      ],
    });
  }
}
