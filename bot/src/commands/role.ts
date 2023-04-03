// import {
//   ActionRowBuilder,
//   ApplicationCommandOptionType,
//   CommandInteraction,
//   MessageActionRowComponentBuilder,
//   StringSelectMenuBuilder,
//   Role,
//   SelectMenuInteraction,
//   TextChannel,
// } from 'discord.js';
// import {
//   Discord,
//   Guard,
//   Slash,
//   SlashGroup,
//   SlashOption,
//   SelectMenuComponent,
// } from 'discordx';

// type Selection = {
//   messageID: string;
//   name: string;
//   roles: { label: string; value: string }[];
// };

// @Discord()
// @SlashGroup({ name: 'role', description: 'Role Commands' })
// @SlashGroup('role')
// export class RoleCommands {
//   private selections: Selection[] = [];

//   private editMessage(
//     interaction: CommandInteraction,
//     selection: Selection
//   ): void {
//     interaction.channel?.messages
//       .fetch({ around: selection.messageID, limit: 1 })
//       .then((v) => {
//         const menu = new StringSelectMenuBuilder()
//           .addOptions(selection.roles)
//           .setMinValues(0)
//           .setMaxValues(selection.roles.length)
//           .setPlaceholder('Nothing Selected')
//           .setCustomId('select-menu');

//         const row =
//           new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
//             menu
//           );

//         const msg = v.first();
//         if (!msg)
//           return interaction.editReply({
//             content: '❌ Error: Could not find base message',
//           });

//         msg.edit({
//           content: selection.name,
//           components: [row],
//         });
//       });
//   }

//   @Slash({ name: 'list-create', description: 'Create a role selection menu' })
//   //TODO: Add guard to see if person is a mod or not
//   async listCreate(
//     @SlashOption({
//       name: 'name',
//       description: 'Name for the message',
//       required: true,
//       type: ApplicationCommandOptionType.String,
//     })
//     name: string,
//     @SlashOption({
//       name: 'channel',
//       description: 'Channel the menu will be posted',
//       required: true,
//       type: ApplicationCommandOptionType.Channel,
//     })
//     channel: TextChannel,
//     interaction: CommandInteraction
//   ): Promise<unknown> {
//     await interaction.deferReply({ ephemeral: true });

//     const msg = await channel.send({ content: name });
//     this.selections.push({ messageID: msg.id, name: name, roles: [] });

//     return interaction.editReply({
//       content: `Created. Message ID is: ${msg.id}`,
//     });
//   }

//   @Slash({ name: 'list-delete', description: 'Delete a role selection menu' })
//   //TODO: Add guard to see if person is a mod or not
//   async listDelete(
//     @SlashOption({
//       name: 'message-id',
//       description: 'MessageID of the message you want to delete',
//       required: true,
//       type: ApplicationCommandOptionType.String,
//     })
//     messageID: string,
//     interaction: CommandInteraction
//   ): Promise<unknown> {
//     await interaction.deferReply({ ephemeral: true });
//     interaction.channel?.messages
//       .fetch({ around: messageID, limit: 1 })
//       .then((v) => {
//         const msg = v.first();

//         if (!msg)
//           return interaction.editReply({
//             content: '❌ Error: Could not find base message',
//           });

//         msg.delete();
//       });
//     return interaction.editReply({ content: 'Deleted' });
//   }

//   @Slash({ name: 'list-add', description: 'Add a role to a role selector' })
//   //TODO: Add guard to see if person is a mod or not
//   async listAdd(
//     @SlashOption({
//       name: 'message-id',
//       description: 'MessageID of the menu',
//       required: true,
//       type: ApplicationCommandOptionType.String,
//     })
//     messageID: string,
//     @SlashOption({
//       name: 'role',
//       description: 'Role to add',
//       required: true,
//       type: ApplicationCommandOptionType.Role,
//     })
//     role: Role,
//     interaction: CommandInteraction
//   ): Promise<unknown> {
//     await interaction.deferReply({ ephemeral: true });

//     const thisSelection = this.selections.find(
//       (v) => v.messageID === messageID
//     );
//     if (!thisSelection)
//       return interaction.editReply({
//         content: 'Cannot find a selection menu with the same messageID',
//       });

//     if (thisSelection.roles.find((v) => v.value === role.id))
//       return interaction.editReply({ content: 'Role is already added' });

//     thisSelection.roles.push({ label: role.name, value: role.id });

//     this.editMessage(interaction, thisSelection);

//     return interaction.editReply({
//       content: `Added <@&${
//         role.id
//       }> \nCurrent list includes the roles: ${thisSelection.roles.map(
//         (v) => `<@&${v.value}>`
//       )}`,
//     });
//   }

//   @Slash({
//     name: 'list-remove',
//     description: 'Remove a role from the role selector',
//   })
//   //TODO: Add guard to see if person is a mod or not
//   async listRemove(
//     @SlashOption({
//       name: 'message-id',
//       description: 'MessageID of the menu',
//       required: true,
//       type: ApplicationCommandOptionType.String,
//     })
//     messageID: string,
//     @SlashOption({
//       name: 'role',
//       description: 'Role to remove',
//       required: true,
//       type: ApplicationCommandOptionType.Role,
//     })
//     role: Role,
//     interaction: CommandInteraction
//   ): Promise<unknown> {
//     await interaction.deferReply({ ephemeral: true });

//     const thisSelection = this.selections.find(
//       (v) => v.messageID === messageID
//     );

//     if (!thisSelection)
//       return interaction.editReply({
//         content: 'Cannot find a selection menu with the same messageID',
//       });

//     if (!thisSelection.roles.find((v) => v.value === role.id))
//       return interaction.editReply({
//         content: 'Role does not exist on that menu item',
//       });

//     thisSelection.roles = thisSelection.roles.filter(
//       (v) => v.value !== role.id
//     );

//     this.editMessage(interaction, thisSelection);

//     return interaction.editReply({
//       content: `Removed <@&${
//         role.id
//       }>\nCurrent list includes: ${thisSelection.roles.map(
//         (v) => `<@&${v.value}>`
//       )}`,
//     });
//   }

//   @SelectMenuComponent({ id: 'select-menu' })
//   async handleSelect(interaction: SelectMenuInteraction): Promise<unknown> {
//     const hasPerm =
//       interaction.guild?.members.me?.permissions.has('ManageRoles');

//     if (!hasPerm)
//       return interaction.reply({
//         content:
//           '❌ Error: Bot does not have the Manage Roles permission. Have it enabled.',
//       });

//     if (!interaction.guildId) return;

//     const guild = interaction.client.guilds.cache.get(interaction.guildId);

//     if (!guild) return;

//     const member = await guild.members.fetch(interaction.user.id);

//     const thisSelection = this.selections.find(
//       (v) => v.messageID === interaction.message.id
//     );
//     if (!thisSelection) return;

//     const prevRoleIDs = member.roles.cache.map((v) => v.id);
//     const interVals = interaction.values;

//     const removed = prevRoleIDs.filter(
//       (item) =>
//         thisSelection.roles.some((v) => v.value === item) &&
//         !interVals.includes(item)
//     );
//     const added = interVals.filter(
//       (item) =>
//         thisSelection.roles.some((v) => v.value === item) &&
//         !prevRoleIDs.includes(item)
//     );

//     if (removed.length > 0) member.roles.remove(removed);
//     if (added.length > 0) member.roles.add(added);

//     return interaction.reply({ content: 'wokrde', ephemeral: true });
//   }
// }
