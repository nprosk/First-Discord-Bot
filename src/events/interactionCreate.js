const { Events, ChannelType, PermissionFlagsBits } = require("discord.js");
const { replyOrEditReply, parseDatabase } = require("../utils/functions");
const fs = require("fs");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    let db = parseDatabase();

    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`
        );
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        }
      }
    } else if (interaction.isButton()) {
      if (!db) {
        await replyOrEditReply(
          interaction,
          "Something went wrong, please try again!",
          true
        );
        return;
      }
      if (db.roles.length < 2) {
        await replyOrEditReply(
          interaction,
          "You need to select two teams!",
          true
        );
        return;
      } else if (db.roles[0] === db.roles[1]) {
        await replyOrEditReply(
          interaction,
          "You need to select two different teams!",
          true
        );
        return;
      } else if (!db.roles[0] || !db.roles[1]) {
        await replyOrEditReply(
          interaction,
          "You need to select two teams!",
          true
        );
        return;
      }

      if (!db.weekSelection) {
        await replyOrEditReply(interaction, "You need to select a week!", true);
        return;
      }

      const guild = interaction.guild;

      const role1 = guild.roles.cache.get(db.roles[0]);
      const role2 = guild.roles.cache.get(db.roles[1]);
      const channelName = role1.name + " vs " + role2.name;
      const starterMessage = `Match is starting soon: ${role1} vs ${role2}`;
      interaction.deferReply({ ephemeral: true });

      
      const channel = await guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        parent:
          guild.channels.cache.find(
            (channel) =>
              channel.name === "Match Channels: " + db.weekSelection &&
              channel.type === ChannelType.GuildCategory
          ) ||
          (await guild.channels.create({
            name: "Match Channels: " + db.weekSelection,
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
      await replyOrEditReply(
        interaction,
        `Match channel created: <#${channel.id}>, for ${db.weekSelection}`,
        true
      );
    } else if (interaction.isRoleSelectMenu()) {
      const selection = interaction.values[0];
      if (interaction.customId === "team1") {
        db.roles[0] = selection;
      }
      if (interaction.customId === "team2") {
        db.roles[1] = selection;
      }
      interaction.deferUpdate();
    } else if (interaction.isStringSelectMenu()) {
      db.weekSelection = interaction.values[0];
      interaction.deferUpdate();
    }

    try {
      fs.writeFileSync("db.json", JSON.stringify(db));
    } catch (err) {
      console.error(err);
    }
  },
};
