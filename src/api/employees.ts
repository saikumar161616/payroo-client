import api from '../utils/api';
import { apiConstants } from '../api.constants';
import { Employee } from '../types/types';

export const getToken = async (name: string): Promise<any> => {
    try {
        const response = await api.post(apiConstants.get_token, { name: name });
        console.log("API response for token:", response);
        if (response && response.data.status) {
            return response.data.data;
        }
    } catch (error) {
        console.log("Error fetching token:", error);
        throw error;
    }
};

export const getEmployees = async (): Promise<Employee[]> => {
    try {
        const response = await api.get(apiConstants.get_employees);
        console.log("API response for employees:", response);
        if (response && response.data.status) {
            return response.data.data || [];
        }
        return [];
    } catch (error) {
        console.log("Error fetching employees:", error);
        throw error;
    }
};

export const addEmployee = async (emp: Partial<Employee>): Promise<Employee | undefined> => {
    try {
        const response = await api.post(apiConstants.add_employee, emp);
        console.log("API response for adding employee:", response);
        if (response && response.data.status) {
            return response.data.data;
        }
    }
    catch (error) {
        console.log("Error adding employee:", error);
        throw error;
    }
};

export const updateEmployee = async (id: string, emp: Partial<Employee>): Promise<Employee | undefined> => {
    try {
        const response = await api.patch(apiConstants.update_employee(String(id)), emp);
        console.log("API response for updating employee:", response);
        if (response && response.data.status) {
            return response.data.data;
        }   
    }
    catch (error) {
        console.log("Error updating employee:", error);
        throw error;
    }   
};