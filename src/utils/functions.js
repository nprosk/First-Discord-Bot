const fs = require("fs");

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
  parseDatabase() {
    try {
      const data = fs.readFileSync("db.json", "utf8");
      return JSON.parse(data);
    }
    catch (err) {
      console.error(err);
      return null;
    }
  }
};
