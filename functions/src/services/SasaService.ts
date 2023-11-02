import * as dotenv from "dotenv";
dotenv.config({ path: "functions/.env" });

import axios from "axios";

export const fetch_sasa_data = async (): Promise<string> => {
    const url = process.env.SASA_ENDPOINT || "";
    const token = process.env.SASA_TOKEN || "";

    const end_date = new Date(); // Current timestamp
    const end_timestamp = end_date.getTime() / 1000;

    const start_date = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
    const start_timestamp = Math.floor(start_date.getTime() / 1000);


    console.info("These are the timestamps:", {
        startTimestamp: start_timestamp,
        end_timestamp,
    });

    const headers = {
        Authorization: `${token}`,
    };

    const params = {
        start_at: start_timestamp,
        end_at: end_timestamp,
    };

    try {
        const response = await axios.get(url, { headers, params });
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};
