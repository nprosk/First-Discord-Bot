const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create-match-channel')
		.setDescription('Creates a match channel')
    .addRoleOption(option =>
      option
        .setName('role1')
        .setDescription('Home team role')
        .setRequired(true)
    )
    .addRoleOption(option =>
      option
        .setName('role2')
        .setDescription('Away team role')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('channel-name')
        .setDescription('Set custom channel name')
    )
    .addStringOption(option =>
      option
        .setName('starter-message')
        .setDescription('Set custom starter message')
    ),
	async execute(interaction) {
    const role1 = interaction.options.getRole('role1');
    const role2 = interaction.options.getRole('role2');
    const channelName = interaction.options.getString('channel-name') || role1.name + ' vs ' + role2.name;
    const starterMessage = interaction.options.getString('starter-message') || 'Match is starting soon!';
		await interaction.reply({ content: `Creating match channel with roles ${role1.name} and ${role2.name}...`, ephemeral: true });

    const guild = interaction.guild;
    const channel = await guild.channels.create({
      name: channelName,
      type: ChannelType.GuildText,
      parent: interaction.guild.channels.cache.find(channel => channel.name === 'Match Channels' && channel.type === ChannelType.GuildCategory) || await guild.channels.create({ name: "Match Channels" , type: ChannelType.GuildCategory }),
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
	},
};

