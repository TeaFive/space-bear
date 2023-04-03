import { CommandInteraction, Message } from 'discord.js';
import { supabase } from '../main.js';
import { Database } from 'schema.js';

type Server = Database['public']['Tables']['server']['Row'];
type Member = Database['public']['Tables']['member']['Row'];

export async function fetchServer(guildID: string): Promise<Server | null> {
  const server = await supabase
    .from('server')
    .select()
    .eq('server_id', guildID)
    .limit(1);

  if (server.error) {
    console.error('fetchSupa.ts server.error:\n', server.error);
    return null;
  }

  if (server.data.length > 0) {
    return server.data[0];
  } else {
    const insert = await supabase
      .from('server')
      .insert({
        server_id: guildID,
      })
      .select();

    if (insert.error) {
      console.error('fetchSupa.ts insert.error:\n', insert.error);
      return null;
    }

    return insert.data[0];
  }
}

export async function fetchMember(
  interaction: CommandInteraction | Message
): Promise<Member | null> {
  if (!interaction.guild) return null;

  // let member: PostgrestSingleResponse<Member[]>;

  if (interaction instanceof CommandInteraction) {
    const member = await supabase
      .from('member')
      .select()
      .eq('member_id', interaction.user.id)
      .eq('server_id', interaction.guild.id)
      .limit(1);

    if (member.error) {
      console.error('fetchSupa.ts member.error:\n', member.error);
      return null;
    }

    if (member.data.length > 0) {
      return member.data[0];
    } else {
      const insert = await supabase
        .from('member')
        .insert({
          member_id: interaction.user.id,
          server_id: interaction.guild.id,
        })
        .select();

      if (insert.error) {
        console.error('fetchSupa.ts insert.error:\n', insert.error);
        return null;
      }

      return insert.data[0];
    }
  } else if (interaction instanceof Message) {
    const member = await supabase
      .from('member')
      .select()
      .eq('member_id', interaction.author.id)
      .eq('server_id', interaction.guild.id)
      .limit(1);

    if (member.error) {
      console.error('fetchSupa.ts member.error:\n', member.error);
      return null;
    }

    if (member.data.length > 0) {
      return member.data[0];
    } else {
      const insert = await supabase
        .from('member')
        .insert({
          member_id: interaction.author.id,
          server_id: interaction.guild.id,
        })
        .select();

      if (insert.error) {
        console.error('fetchSupa.ts insert.error:\n', insert.error);
        return null;
      }

      return insert.data[0];
    }
  }

  return null;
}
