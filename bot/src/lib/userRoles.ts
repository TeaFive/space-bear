import { CommandInteraction } from 'discord.js';

export default async function userRoles(interaction: CommandInteraction) {
  if (!interaction.guild) return null;
  const guild = interaction.client.guilds.cache.get(interaction.guild.id);
  if (!guild) return null;
  const member = await guild.members.fetch(interaction.user.id);
  return member.roles.cache.map((v) => v.id);
}
