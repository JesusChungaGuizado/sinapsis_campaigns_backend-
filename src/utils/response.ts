import { APIGatewayProxyResult } from "aws-lambda";

interface ApiResponse<T> {
    success: boolean;
    timestamp: string;
    data?: T;
    error?: {
        message: string;
    };
}

const defaultHeaders = {
    "Content-Type": "application/json"
};

export const successResponse = <T>(
    statusCode: number,
    data: T
): APIGatewayProxyResult => {
    const response: ApiResponse<T> = {
        success: true,
        timestamp: new Date().toISOString(),
        data
    };

    return {
        statusCode,
        headers: defaultHeaders,
        body: JSON.stringify(response)
    };
};

export const errorResponse = (
    statusCode: number,
    message: string
): APIGatewayProxyResult => {
    const response: ApiResponse<null> = {
        success: false,
        timestamp: new Date().toISOString(),
        error: { message }
    };

    return {
        statusCode,
        headers: defaultHeaders,
        body: JSON.stringify(response)
    };
};
