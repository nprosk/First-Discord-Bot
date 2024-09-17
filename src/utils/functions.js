module.exports = {
  async replyOrEditReply(interaction, msg, ephemeral = false) {
    if (interaction.replied || interaction.deferred) {
      return await interaction.editReply({
        content: msg,
        ephemeral: ephemeral,
      });
    }
    return await interaction.reply({
      content: msg,
      ephemeral: ephemeral,
    });
  },
};
