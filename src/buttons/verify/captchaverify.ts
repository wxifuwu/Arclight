import { ActionRowBuilder, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { generatePin } from "../../functions";
import { logger } from "../../helpers/logger";
import { Button } from "../../types";

const button: Button = {
    id: "captchaverify",
    execute: async (interaction, client) => {
        try {
            if(!interaction.member || !interaction.guild) return;
            let pin = await generatePin();

            const modal = new ModalBuilder().setCustomId("verify-modal").setTitle(`Verify Pin: ${pin}`);
            const input = new TextInputBuilder().setCustomId("pincode").setMaxLength(4).setLabel(`Please type your verify pin: ${pin}`).setPlaceholder(`${pin}`).setStyle(TextInputStyle.Short);

            const inputRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(input);
            modal.addComponents(inputRow);

            client.codes.set(`verify-${interaction.member.user.id}`, pin);

            await interaction.showModal(modal);
        } catch(e) {
            logger.error(`Issue with verify button: ${e}`);
            console.log(e)
        }
    }
}

export default button;