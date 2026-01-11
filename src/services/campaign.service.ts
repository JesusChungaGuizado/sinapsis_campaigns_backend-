import * as CampaignModel from "../models/campaign.model";
import * as MessageModel from "../models/message.model";
import { Campaign, CreateCampaignDTO } from "../types/campaign";

export const createCampaignWithMessages = async (
    data: CreateCampaignDTO
): Promise<Campaign> => {
    const campaignId = await CampaignModel.createCampaign(data);
    const phones = data.phone_list.split(",");
    for (const phone of phones) {
        await MessageModel.createMessage(
            campaignId,
            phone.trim(),
            data.message_text
        );
    }
    const campaign = await CampaignModel.findById(campaignId);
    return campaign;
};

export const processCampaign = async (campaignId: number): Promise<void> => {
    const messages = await MessageModel.findByCampaign(campaignId);

    await CampaignModel.updateStatus(campaignId, 2);

    for (const message of messages) {
        const status = Math.random() > 0.2 ? 2 : 3;
        await MessageModel.updateStatus(message.id, status);
    }

    await CampaignModel.updateStatus(campaignId, 3);
};
