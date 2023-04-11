import { EmbedBuilder } from 'discord.js';
import { bot } from '../main.js';

export function ErrorMessage(message: string): EmbedBuilder {
  return new EmbedBuilder().setDescription(message).setColor('#ff6b6b');
}

export function SuccessMessage(message: string): EmbedBuilder {
  return new EmbedBuilder().setDescription(message).setColor('#1dd1a1');
}

export function WarningMessage(message: string): EmbedBuilder {
  return new EmbedBuilder().setDescription(message).setColor('#feca57');
}
