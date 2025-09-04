import { BASE_API_URL } from "./config/config";

export const apiConstants = {
    get_token : `${BASE_API_URL}/employee/get-token`,
    get_employees : `${BASE_API_URL}/employee`,
    add_employee : `${BASE_API_URL}/employee`,
    update_employee : (id: string) => `${BASE_API_URL}/employee/${id}`,

    add_timesheet: `${BASE_API_URL}/timesheet`,
    get_timesheets: `${BASE_API_URL}/timesheet`,
    update_timesheet: (id: string) => `${BASE_API_URL}/timesheet/${id}`,

    run_payrun: `${BASE_API_URL}/payrun/run`,
    get_payruns: `${BASE_API_URL}/payrun`
};