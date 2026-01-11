import { pool } from "../config/database";
import { Campaign, CreateCampaignDTO } from "../types/campaign";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export const createCampaign = async (
    data: CreateCampaignDTO
): Promise<number> => {
    const [result] = await pool.execute<ResultSetHeader>(
        `
    INSERT INTO campaigns
    (user_id, name, process_status, phone_list, message_text,process_date, process_hour)
    VALUES (?, ?, 1, ?, ?,CURDATE(), CURTIME())
    `,
        [data.user_id, data.name, data.phone_list, data.message_text]
    );
    return result.insertId;
};

export const updateStatus = async (
    campaignId: number,
    status: number
): Promise<void> => {
    await pool.execute(
        "UPDATE campaigns SET process_status = ? WHERE id = ?",
        [status, campaignId]
    );
};

export const listByDate = async (
    startDate: string,
    endDate: string
) => {
    const [rows] = await pool.execute(
        `
    SELECT * FROM campaigns
    WHERE process_date BETWEEN ? AND ?
    ORDER BY process_date DESC
    `,
        [startDate, endDate]
    );
    return rows;
};

export const findById = async (id: number): Promise<Campaign> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        "SELECT * FROM campaigns WHERE id = ?",
        [id]
    );
    return rows[0] as Campaign;
};
