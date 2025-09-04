import api from '../utils/api';
import { apiConstants } from '../api.constants';

export const runPayrun = async (payload: { periodStart: string; periodEnd: string; employeeIds: string[] }): Promise<any> => {
    try {
        const response = await api.post(apiConstants.run_payrun, payload);
        console.log("API response for running payrun:", response);
        if (response && response.data.status) {
            return response.data.data;
        } else if (response && response.data && response.data.error) {
            // Throw backend error message
            throw new Error(response.data.error);
        } else {
            throw new Error('Unknown error from backend.');
        }
    } catch (error) {
        console.error("Error running payrun:", error);
        throw error;
    }
};


export const getPayruns = async (): Promise<any[]> => {
    try {
        const response = await api.get(apiConstants.get_payruns);
        console.log("API response for running payrun:", response);
        if (response && response.data.status) {
            return response.data.data;
        } else if (response && response.data && response.data.error) {
            // Throw backend error message
            console.log("Backend error:", response.data.error);
            throw new Error(response.data.error);
        } else {
            throw new Error('Unknown error from backend.');
        }
    }
    catch (error: any) {
        console.log("Error fetching payruns:", error);
        throw error;
    }
}
