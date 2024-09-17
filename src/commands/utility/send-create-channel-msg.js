const {
  SlashCommandBuilder,
  ActionRowBuilder,
  RoleSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionFlagsBits,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("send-create-channel-msg")
    .setDescription("Sends a message to create a match channel"),
  async execute(interaction) {
    const team1 = new RoleSelectMenuBuilder()
      .setCustomId("team1")
      .setPlaceholder("Select team 1")
      .addDefaultRoles();

    const team2 = new RoleSelectMenuBuilder()
      .setCustomId("team2")
      .setPlaceholder("Select team 2")
      .addDefaultRoles();

    const weekOptions = [];
    for (i = 1; i < 8; i++) {
      weekOptions.push(
        new StringSelectMenuOptionBuilder()
          .setLabel(`Week ${i}`)
          .setDescription(`This match will be played in week ${i}`)
          .setValue(`Week ${i}`)
      );
    }
    const week = new StringSelectMenuBuilder()
      .setOptions(weekOptions)
      .setCustomId("week")
      .setPlaceholder("Select week");

    const confirm = new ButtonBuilder()
      .setCustomId("create-channel")
      .setLabel("Create Channel")
      .setStyle(ButtonStyle.Primary);

    const row1 = new ActionRowBuilder().addComponents(team1);
    const row2 = new ActionRowBuilder().addComponents(team2);
    const row3 = new ActionRowBuilder().addComponents(week);
    const row4 = new ActionRowBuilder().addComponents(confirm);

    const guild = interaction.guild;
    const findChannel = interaction.guild.channels.cache.find(
      (channel) =>
        channel.name === "Match Scheduler" &&
        channel.type === ChannelType.GuildText
    );
    if (!findChannel) {
      const channel = await guild.channels.create({
        name: "Match Scheduler",
        type: ChannelType.GuildText,
        parent:
          interaction.guild.channels.cache.find(
            (channel) =>
              channel.name === "Bot Channels" &&
              channel.type === ChannelType.GuildCategory
          ) ||
          (await guild.channels.create({
            name: "Bot Channels",
            type: ChannelType.GuildCategory,
          })),
        permissionOverwrites: [
          {
            id: guild.roles.everyone.id,
            deny: [PermissionFlagsBits.ViewChannel],
          },
        ],
      });

      await channel.send({
        content: "Choose the two teams",
        components: [row1, row2, row3, row4],
      });
    } else {
      await findChannel.send({
        content: "Choose the two teams",
        components: [row1, row2, row3, row4],
      });
    }

    await interaction.reply({
      content: "Message sent!",
      ephemeral: true,
    });
  },
};
