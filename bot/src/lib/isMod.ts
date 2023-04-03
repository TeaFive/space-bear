import { CommandInteraction } from 'discord.js';
import userRoles from './userRoles.js';
import { fetchServer } from '../lib/fetchSupa.js';

export default async function isMod(interaction: CommandInteraction) {
  if (!interaction.guild) return false;

  const server = await fetchServer(interaction.guild.id);
  const usersRoles = await userRoles(interaction);
  if (!server) return false;
  if (!usersRoles) return false;

  const a = usersRoles.find((v) => v === server.mod_id);

  if (a !== undefined) return true;

  return false;
}
