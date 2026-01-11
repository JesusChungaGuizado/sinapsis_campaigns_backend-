import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import * as CampaignService from "../services/campaign.service";
import * as CampaignModel from "../models/campaign.model";
import * as MessageModel from "../models/message.model";
import { errorResponse, successResponse } from "../utils/response";

export const create: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    try {
        const body = JSON.parse(event.body || "{}");
        const campaign = await CampaignService.createCampaignWithMessages(body);
        return successResponse(201, campaign);
    } catch (err) {
        console.error("ERROR createCampaign:", err);
        return errorResponse(500, "Hubo un error interno al crear la campaña.");
    }
};

export const process: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    try {
        const campaignId = Number(event.pathParameters?.id);
        await CampaignService.processCampaign(campaignId);
        return successResponse(200, { message: "La campaña se ha procesado con exito." });
    } catch (err) {
        return errorResponse(500, "Hubo un error interno al procesar la campaña.");
    }
};

export const list: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    try {
        const { startDate, endDate } = event.queryStringParameters || {};

        const start = startDate || '';
        const end = endDate || '';

        const campaigns = await CampaignModel.listByDate(start, end);

        return successResponse(200, campaigns);
    } catch (err) {
        return errorResponse(500, "Hubo un error interno al listar las campañas.");
    }
};

export const messages: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    try {
        const campaignId = Number(event.pathParameters?.id);
        const messages = await MessageModel.findByCampaign(campaignId);
        return successResponse(200, messages);
    } catch (err) {
        return errorResponse(500, "Hubo un error interno al listar los mensajes.");
    }
};
