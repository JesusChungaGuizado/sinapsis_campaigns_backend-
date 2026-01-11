export interface CreateCampaignDTO {
    user_id: number;
    name: string;
    phone_list: string;
    message_text: string;
}

export interface Campaign {
    id: number;
    user_id: number;
    name: string;
    process_status: number;
    process_date: string | null;
    process_hour: string | null;
}