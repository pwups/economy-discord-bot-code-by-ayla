const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const fs = require("fs");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const PREFIX = ";";
const economy = JSON.parse(fs.readFileSync("economy.json", "utf8"));

client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.guild) return;

    const args = message.content.trim().split(/\s+/);
    const command = args.shift().toLowerCase();

    if (command === ";balance") {
        const userId = message.author.id;
        const balance = economy[userId]?.balance || 0;

        const balanceEmbed = new EmbedBuilder()
            .setColor("#F1F1F1")
            .setDescription(`you have **${balance}** lollipops bby!`)
            .setFooter({ text: "made by @apcllsiep", iconURL: message.author.displayAvatarURL() });

        message.reply({ embeds: [balanceEmbed] });
    }

    if (command === ";daily") {
        const userId = message.author.id;
        const lastClaim = economy[userId]?.lastClaim || 0;
        const now = Date.now();

        if (now - lastClaim < 86400000) {
            const errorEmbed = new EmbedBuilder()
                .setColor("#F1F1F1")
                .setDescription("heyy.. you already claimed your daily reward! try again later bby.")
                .setFooter({ text: "made by @apcllsiep", iconURL: message.author.displayAvatarURL() });

            return message.reply({ embeds: [errorEmbed] });
        }

        economy[userId] = {
            balance: (economy[userId]?.balance || 0) + 100,
            lastClaim: now
        };

        fs.writeFileSync("economy.json", JSON.stringify(economy, null, 2));

        const dailyEmbed = new EmbedBuilder()
            .setColor("#F1F1F1")
            .setDescription("you have earned **100 lollipops** bby!")
            .setFooter({ text: "made by @apcllsiep", iconURL: message.author.displayAvatarURL() });

        message.reply({ embeds: [dailyEmbed] });
    }
});

client.login("MTMyNDk3Nzc5MjI2MTI5MjA3Mg.Gfa88e.jOMzOPNwiT8Tqro6mevI3vrG7dUhMso9PY-ipk");
