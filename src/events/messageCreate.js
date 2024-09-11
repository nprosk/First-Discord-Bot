const { Events } = require("discord.js");
const OpenAI = require("openai");

const possibleContains = [
  `slickburrito735`,
  `frankie`,
  `slickburrito`,
  `francis`,
  `frank`,
  `pig`,
  `piggy`,
];

const checkFor = (message, text) => {
  return message.content.toLowerCase().includes(text);
};

const replaceAll = (str, find, replace) => {
  return str.replace(new RegExp(find, "g"), replace);
};

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;

    for (const possibleMessage of possibleContains) {
      if (checkFor(message, possibleMessage)) {
        const openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY});
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: "Come up with a silly roast of Frankie",
            },
          ],
        });
        message.reply(replaceAll(completion.choices[0].message.content, `Frankie`, `<@425857682877054988>`));
        break;
      }
    }
  },
};
