const {
  SlashCommandBuilder,
  ActionRowBuilder,
  RoleSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionFlagsBits,
  ComponentType,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("create-channel-selectable")
    .setDescription("Creates a match channel"),
  async execute(interaction) {
    const team1 = new RoleSelectMenuBuilder()
      .setCustomId("team1")
      .setPlaceholder("Select team 1")
      .addDefaultRoles();

    const team2 = new RoleSelectMenuBuilder()
      .setCustomId("team2")
      .setPlaceholder("Select team 2")
      .addDefaultRoles();

    const confirm = new ButtonBuilder()
      .setCustomId("create-channel")
      .setLabel("Create Channel")
      .setStyle(ButtonStyle.Primary);

    const row1 = new ActionRowBuilder().addComponents(team1);
    const row2 = new ActionRowBuilder().addComponents(team2);
    const row3 = new ActionRowBuilder().addComponents(confirm);

    const roles = [];

    const response = await interaction.reply({
      content: "Choose the two teams",
      components: [row1, row2, row3],
      ephemeral: true,
    });

    const collector = response.createMessageComponentCollector({
      componentType: ComponentType.RoleSelect,
      time: 3_600_000,
    });

    const confirmationCollector = response.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 3_600_000,
    });

    collector.on("collect", async (i) => {
      const selection = i.values[0];
      if (i.customId === "team1") {
        roles[0] = selection;
      }
      if (i.customId === "team2") {
        roles[1] = selection;
      }
      await i.reply({
        content: `Selected ${i.guild.roles.cache.get(selection).name}`,
        ephemeral: true,
      });
    });

    confirmationCollector.on("collect", async (i) => {
      if (roles.length < 2) {
        await i.reply({
          content: "You need to select two teams!",
          ephemeral: true,
        });
        return;
      } else if (roles[0] === roles[1]) {
        await i.reply({
          content: "You need to select two different teams!",
          ephemeral: true,
        });
        return;
      } else if (!roles[0] || !roles[1]) {
        await i.reply({
          content: "You need to select two teams!",
          ephemeral: true,
        });
        return;
      }

      const role1 = i.guild.roles.cache.get(roles[0]);
      const role2 = i.guild.roles.cache.get(roles[1]);
      const channelName = role1.name + " vs " + role2.name;
      const starterMessage = `Match is starting soon: ${role1} vs ${role2}`;
      await i.reply({
        content: `Creating match channel with roles ${role1.name} and ${role2.name}...`,
        ephemeral: true,
      });

      const guild = i.guild;
      const channel = await guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        parent:
          i.guild.channels.cache.find(
            (channel) =>
              channel.name === "Match Channels" &&
              channel.type === ChannelType.GuildCategory
          ) ||
          (await guild.channels.create({
            name: "Match Channels",
            type: ChannelType.GuildCategory,
          })),
        permissionOverwrites: [
          {
            id: guild.roles.everyone.id,
            deny: [PermissionFlagsBits.ViewChannel],
          },
          {
            id: role1.id,
            allow: [PermissionFlagsBits.ViewChannel],
          },
          {
            id: role2.id,
            allow: [PermissionFlagsBits.ViewChannel],
          },
        ],
      });

      await channel.send(starterMessage);
    });
  },
};
