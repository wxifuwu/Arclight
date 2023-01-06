import { prisma, redisClient } from "../../helpers/DB";
import { logger } from "../../helpers/logger";
import { Modal } from "../../types";

const modal: Modal = {
    id: "verify-modal",
    execute: async (interaction, client) => {
        if(!interaction.guild || !interaction.member) return;

        let cachedRoleID = await redisClient.get(`captcharole-${interaction.guild.id}`).catch(e => logger.error(`Redis DB Error: ${e}`));
        let roleID: string;
        if(!cachedRoleID) {
            let data = await prisma.captchaConfig.findUnique({
                where: {
                    guildID: interaction.guild.id
                }
            });

            if(!data) return interaction.reply({ content: "Captcha not set up in this server!", ephemeral: true });
            roleID = data.memberRoleID;
        } else {
            roleID = cachedRoleID;
        }

        if(!roleID) return interaction.reply({ content: "Captcha isn't set up in this server!", ephemeral: true });

        let Role = await interaction.guild.roles.fetch(roleID);
        if(!Role) return interaction.reply({ content: "The captcha role doesn't exist anymore", ephemeral: true });

        let botuser = await interaction.guild.members.fetchMe();
        if(Role.position > botuser.roles.highest.position) return interaction.reply({ content: "Unable to add Role, please contact an admin!", ephemeral: true });

        let pin = client.codes.get(`verify-${interaction.member.user.id}`)
        if(!pin) return interaction.reply({ content: "An error occured checking your pin, please try again later", ephemeral: true})
        if(interaction.fields.getTextInputValue("pincode") === pin.toString()) {
            try {
                let user = await interaction.guild.members.fetch(interaction.member.user.id);
                user.roles.add(Role);
                client.codes.delete(`verify-${interaction.member.user.id}`);
                interaction.reply({ content: "You've been verified!", ephemeral: true});
            } catch(e) {
                logger.error(`Issue adding role: ${e}`);
                return interaction.reply({ content: "Issue adding role, please try again later", ephemeral: true });
            }
        }
    }
}

export default modal;