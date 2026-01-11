import { pool } from "../config/database";

export const createMessage = async (
    campaignId: number,
    phone: string,
    text: string
): Promise<void> => {
    await pool.execute(
        `
    INSERT INTO messages
    (campaign_id, phone, text, shipping_status)
    VALUES (?, ?, ?, 1)
    `,
        [campaignId, phone, text]
    );
};

export const findByCampaign = async (campaignId: number) => {
    const [rows]: any = await pool.execute(
        "SELECT * FROM messages WHERE campaign_id = ?",
        [campaignId]
    );
    return rows;
};

export const updateStatus = async (
    messageId: number,
    status: number
): Promise<void> => {
    await pool.execute(
        "UPDATE messages SET shipping_status = ? , process_date = CURDATE(), process_hour = CURTIME() WHERE id = ?",
        [status, messageId]
    );
};
