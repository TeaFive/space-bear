import { EmbedBuilder } from 'discord.js';

export function ErrorMessage(message: string): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setDescription(`<:plexError:1090288550701977791> ` + message)
    .setColor('#ff6b6b');

  return embed;
}

export function SuccessMessage(message: string): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setDescription(`<:plexSuccess:1090287955987415061> ` + message)
    .setColor('#1dd1a1');

  return embed;
}
