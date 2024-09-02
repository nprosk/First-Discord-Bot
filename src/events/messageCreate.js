const { Events } = require("discord.js");

// come up with a bunch of hate messages for <@425857682877054988>
const responses = [
  `<@425857682877054988> probably talks to NPCs in real life.`,
  `<@425857682877054988> is the kind of person who claps when the plane lands.`,
  `<@425857682877054988> thinks "Ctrl+Z" will undo life decisions.`,
  `Whenever something goes wrong, just blame <@425857682877054988>.`,
  `<@425857682877054988> would lose a fight to a butterfly.`,
  `<@425857682877054988> is the reason why we have "Do Not Disturb" mode.`,
  `I'm convinced <@425857682877054988> is a bot.`,
  `<@425857682877054988> probably roots for the tutorial boss.`,
  `<@425857682877054988>'s Wi-Fi password is probably 'password'.`,
  `<@425857682877054988> once got lost in a parking lot.`,
  `<@425857682877054988> thinks memes are a type of fruit.`,
  `<@425857682877054988> is what happens when you try your best, but you don't succeed.`,
  `<@425857682877054988> takes "Press F to pay respects" way too seriously.`,
  `<@425857682877054988> still wonders if the chicken or the egg came first.`,
  `If life were a video game, <@425857682877054988> would be the loading screen.`,
  `<@425857682877054988> was the reason for the "Are you sure?" button.`,
  `<@425857682877054988> probably believes that gullible is written on the ceiling.`,
  `I hate <@425857682877054988> more than Mondays.`,
  `<@425857682877054988> is why we can't have nice things.`,
  `<@425857682877054988> is a bitch`,
];

const possibleContains = [
  `slickburrito735`,
  `frankie`,
  `slickburrito`,
  `francis`,
  `frank`,
  `pig`,
  `piggy`,
];

const getRandomResponse = () => {
  return responses[Math.floor(Math.random() * responses.length)];
};

const checkFor = (message, text) => {
  return message.content.toLowerCase().includes(text);
};

module.exports = {
  name: Events.MessageCreate,
  execute(message) {
    if (message.author.bot) return;

    for (const possibleMessage of possibleContains) {
      if (checkFor(message, possibleMessage)) {
        message.reply(getRandomResponse());
        break;
      }
    }
  },
};
