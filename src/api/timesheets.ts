import api from '../utils/api';
import { apiConstants } from '../api.constants';

export const addTimeSheet = async (payload: any): Promise<any> => {
    try {
        const response = await api.post(apiConstants.add_timesheet, payload);
        //console.log("API response for adding timesheet:", response);
        if (response && response.data.status) {
            return response.data.data;
        } else if (response && response.data && response.data.error) {
            // Throw backend error message
            throw new Error(response.data.error);
        } else {
            throw new Error('Unknown error from backend.');
        }
    } catch (error: any) {
        console.log("Error adding timesheet:", error);
        // Throw backend error if available, otherwise generic error
        throw error.response?.data?.error || error.message || error;
    }
}


export const getTimeSheets = async (employeeId:string, periodStart:any, periodEnd:any): Promise<any> => {
    try {
        const response = await api.get(apiConstants.get_timesheets, {
            params: {
                employeeId,
                periodStart,
                periodEnd
            }
        }); 
        //console.log("API response for getting timesheets:", response.data);
        if (response && response.data.status) {
            return response.data.data;
        } else if (response && response.data && response.data.error) {
            // Throw backend error message
            throw new Error(response.data.error);
        } else {
            throw new Error('Unknown error from backend.');
        }
    } catch (error: any) {
        console.log("Error getting timesheets:", error);
        // Throw backend error if available, otherwise generic error
        throw error.response?.data?.error || error.message || error;
    }
};


export const updateTimeSheet = async (timesheetId:string, payload: any): Promise<any> => {
    try {
        const response = await api.patch(apiConstants.update_timesheet(timesheetId), payload);
        //console.log("API response for updating timesheet:", response);
        if (response && response.data.status) {
            return response.data.data;
        } else if (response && response.data && response.data.error) {
            // Throw backend error message
            throw new Error(response.data.error);
        } else {
            throw new Error('Unknown error from backend.');
        }
    }   catch (error: any) {        
        console.log("Error updating timesheet:", error);
        // Throw backend error if available, otherwise generic error
        throw error.response?.data?.error || error.message || error;
    }
};