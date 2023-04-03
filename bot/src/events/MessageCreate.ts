import { Message } from 'discord.js';
import type { ArgsOf } from 'discordx';
import { Discord, On } from 'discordx';
import { supabase } from '../main.js';
import { Database } from '../schema.js';
import { fetchMember } from '../lib/fetchSupa.js';

type SupaMember = Database['public']['Tables']['member']['Row'];

const setXpAndLevel = (member: SupaMember) => {
  let xp = member.xp + Math.floor(Math.random() * 6) + 15;
  let level = member.level;

  if (5 * (level ^ 2) + 50 * level + 100 - xp <= 0) {
    level++;
    xp = 0;
  }

  return { xp, level };
};

const Level = async (message: Message): Promise<void> => {
  if (!message.guild) return;

  const messageCreatedTimestamp = message.createdTimestamp;

  const memberData = await fetchMember(message);
  if (!memberData) return;

  if (messageCreatedTimestamp >= memberData.last_message_timestamp + 300000) {
    memberData.xp = setXpAndLevel(memberData).xp;
    memberData.level = setXpAndLevel(memberData).level;
    memberData.last_message_timestamp = messageCreatedTimestamp;
    memberData.message++;

    const update = await supabase
      .from('member')
      .update(memberData)
      .eq('id', memberData.id);

    if (update.error) {
      console.error('update.error:\n', update.error);
      return;
    }
  }
};

@Discord()
export class Example {
  @On({ event: 'messageCreate' })
  messageCreate([message]: ArgsOf<'messageCreate'>): void {
    if (!message.author.bot) Level(message);
  }
}
