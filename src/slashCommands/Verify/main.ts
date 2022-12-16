// --- Verify Setup 

import { SlashCommandBuilder, EmbedBuilder, ChannelType, ButtonBuilder, ButtonStyle, ActionRow, ActionRowBuilder, PermissionFlagsBits } from "discord.js"
import { prisma, redisClient } from "../../helpers/DB";
import { logger } from "../../helpers/logger";
import { SlashCommand } from "../../types";

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("captcha")
    .setDescription("All Captcha Related Commands")
    .addSubcommand(sub => sub.setName("setup").setDescription("Initialize/Configure your captcha").addRoleOption(r => r.setName("member_role").setDescription("The Role to give to members after the captcha").setRequired(true)).addChannelOption(c => c.setName("channel").setDescription("Channel to send the captcha embed to").setRequired(true)))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    ,
    execute: async (interaction, client) => {
        if(interaction.options.getSubcommand() !== "setup" || !interaction.options.getSubcommand) return interaction.reply({ content: "This command is outdated, please reload your Discord client"});

        if(!interaction.guild) return interaction.reply({ content: "This command can only be used in a server!"});

        let chan = await interaction.guild.channels.fetch(interaction.options.getChannel("channel", true).id);
        if(!chan || chan.type !== ChannelType.GuildText) return interaction.reply({ content: "Please select a valid text channel!"});

        let role = await interaction.guild.roles.fetch(interaction.options.getRole("member_role", true).id);
        if(!client.user) return interaction.reply({ content: "An error occured!"});
        let botuser = await interaction.guild.members.fetchMe(); // TODO: Improve?
        if(!role || role.position > botuser.roles.highest.position) return interaction.reply({ content: "Using this role as the member role isn't possible. Please pick a role below the bots highest role!", ephemeral: true });

        prisma.captchaConfig.upsert({
            where: {
                guildID: interaction.guild.id
            },
            create: {
                guildID: interaction.guild.id,
                memberRoleID: role.id
            },
            update: {
                memberRoleID: role.id
            }
        }).catch(e => {
            logger.error(`Prisma DB Error: ${e}`);
            return interaction.reply({ content: "Unfortunately an error occured while saving your data, please try again later.", ephemeral: true});
        });

        redisClient.set(`captcharole-${interaction.guild.id}`, role.id).catch(e => logger.error(`Redis Client Error: ${e}`));

        let verifButton = new ButtonBuilder().setCustomId('captchaverify').setLabel("Verify").setStyle(ButtonStyle.Primary);
        let verifButtonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(verifButton);
        try {
            await chan.send({ embeds: [new EmbedBuilder().setTitle(`Welcome to ${interaction.guild.name}`).setDescription("ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ").setFooter({ text: `Click the button below to verify! Note that by doing so you agreed to the server rules!`}).setColor("#2F3136")], components: [verifButtonRow]})
        } catch(e) {
            logger.error(`Issue sending Verify Message: ${e}`);
            return interaction.reply({ content: "An error occured sending the message, please try again and check channel permissions if this issue persists.", ephemeral: true});
        }

        return interaction.reply({ content: `Sent verify message to channel: <#${chan.id}> using ${role.name} as the role for members!`, ephemeral: true });
    },
    cooldown: 10
}

export default command