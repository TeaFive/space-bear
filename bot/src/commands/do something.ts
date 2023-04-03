import { CommandInteraction } from 'discord.js';
import { Discord, Slash } from 'discordx';

@Discord()
export class DoSomething {
  @Slash({
    name: 'do-something',
    description: 'B.O.B. Do Something!',
  })
  doSomething(interaction: CommandInteraction) {
    interaction.reply('https://www.youtube.com/watch?v=hs-VeJkCRmc');
  }
}
