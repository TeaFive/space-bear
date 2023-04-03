import { Pagination, PaginationType } from '@discordx/pagination';
import { CommandInteraction, EmbedBuilder } from 'discord.js';
import { fetchMember, fetchServer } from '../lib/fetchSupa.js';
import { Discord, Slash } from 'discordx';
import { supabase } from '../main.js';

@Discord()
export class Pat {
  @Slash({ name: 'pat', description: 'Pat Space Bear!' })
  async send(interaction: CommandInteraction): Promise<void> {
    if (!interaction.guild) return;
    interaction.deferReply({ ephemeral: true });

    const supaMember = await fetchMember(interaction);
    const supaServer = await fetchServer(interaction.guild.id);

    if (!supaMember) return;
    if (!supaServer) return;

    supaMember.pat++;
    supaServer.pat++;

    const memberUpdate = await supabase
      .from('member')
      .update(supaMember)
      .eq('id', supaMember.id);
    const serverUpdate = await supabase
      .from('server')
      .update(supaServer)
      .eq('id', supaServer.id);

    if (memberUpdate.error) {
      console.error('pat.ts memberUpdate.error:\n', memberUpdate.error);
      return;
    }

    if (serverUpdate.error) {
      console.error('pat.ts serverUpdate.error:\n', serverUpdate.error);
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle('He is very happy')
      .setDescription(
        `You have pat Space Bear ${supaMember.pat} amount of ${
          supaMember.pat > 1 ? 'times' : 'time'
        }
        \n${interaction.guild.name} has pat Space Bear ${
          supaServer.pat
        } amount of ${supaServer.pat > 1 ? 'times' : 'time'}`
      )
      .setImage('https://media.tenor.com/KyGPQuYCdYkAAAAC/pat-garrys-mod.gif');

    const users = await supabase
      .from('member')
      .select()
      .eq('server_id', interaction.guild.id);

    if (users.error) {
      console.error('pat.ts 38 users.error:\n', users.error);
      return;
    }

    const sorted = users.data.sort((a, b) => b.pat - a.pat);

    const pages: {
      embeds: EmbedBuilder[];
    }[] = [];

    const pageSize = 10;

    for (let i = 0; i < sorted.length; i += pageSize) {
      const pageUsers = sorted.slice(i, i + pageSize);

      const pageDescriptionArray = await Promise.all(
        pageUsers.map(async (v, j) => {
          const user = await interaction.client.users.fetch(v.member_id);

          return `${
            i + j + 1 === 1
              ? '🥇 '
              : i + j + 1 === 2
              ? '🥈 '
              : i + j + 1 === 3
              ? '🥉 '
              : `\`${i + j + 1}\`: `
          }${user.username} - ${v.pat}`;
        })
      );

      const pageDescription = pageDescriptionArray.join('\n');

      const embed = new EmbedBuilder()
        .setTitle('Leaderboard')
        .setDescription(pageDescription);

      pages.push({ embeds: [embed] });
    }

    pages.unshift({ embeds: [embed] });

    new Pagination(interaction, pages, {
      type: PaginationType.Button,
      showStartEnd: false,
      ephemeral: true,
    }).send();
  }
}
