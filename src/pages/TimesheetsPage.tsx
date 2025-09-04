import React, { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import '../styles/TimesheetsPage.css';
import { getEmployees } from '../api/employees';
import { addTimeSheet, getTimeSheets, updateTimeSheet } from '../api/timesheets';

// Helper to get all dates in a custom range
function getDateRange(start: string, end: string): string[] {
    const dates: string[] = [];
    let current = new Date(start);
    const last = new Date(end);
    while (current <= last) {
        dates.push(current.toISOString().slice(0, 10));
        current.setDate(current.getDate() + 1);
    }
    return dates;
}

// Helper to check if date range is exactly 7 days
function isSevenDayRange(start: string, end: string): boolean {
    if (!start || !end) return false;
    const startDate = new Date(start);
    const endDate = new Date(end);
    // 6 days difference means 7 days inclusive
    return (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) === 6;
}

// Validation helpers matching Joi schema
function validateTimesheet({
    employeeId,
    periodStart,
    periodEnd,
    entries,
    allowances,
}: {
    employeeId: string;
    periodStart: string;
    periodEnd: string;
    entries: any[];
    allowances: number;
}) {
    const errors: string[] = [];

    if (!employeeId || typeof employeeId !== 'string') {
        errors.push('Employee is required.');
    }
    if (!periodStart || isNaN(Date.parse(periodStart))) {
        errors.push('Period start date is required.');
    }
    if (!periodEnd || isNaN(Date.parse(periodEnd))) {
        errors.push('Period end date is required.');
    } else if (periodStart && new Date(periodEnd) < new Date(periodStart)) {
        errors.push('Period end date must be after start date.');
    }
    if (!Array.isArray(entries) || entries.length < 1) {
        errors.push('At least one timesheet entry is required.');
    } else {
        entries.forEach((entry, idx) => {
            if (!entry.date || isNaN(Date.parse(entry.date))) {
                errors.push(`Entry ${idx + 1}: Date is required.`);
            }
            if (
                !entry.startTime ||
                !/^([0-1]\d|2[0-3]):([0-5]\d)$/.test(entry.startTime)
            ) {
                errors.push(`Entry ${idx + 1}: Start time must be in HH:mm format.`);
            }
            if (
                !entry.endTime ||
                !/^([0-1]\d|2[0-3]):([0-5]\d)$/.test(entry.endTime)
            ) {
                errors.push(`Entry ${idx + 1}: End time must be in HH:mm format.`);
            }
            if (
                typeof entry.breakMins !== 'number' ||
                entry.breakMins < 0
            ) {
                errors.push(`Entry ${idx + 1}: Break minutes must be 0 or more.`);
            }
        });
    }
    if (typeof allowances !== 'number' || allowances < 0) {
        errors.push('Allowances must be 0 or more.');
    }
    return errors;
}

const TimesheetsPage: React.FC = () => {
    const queryClient = useQueryClient();

    const [selectedEmployee, setSelectedEmployee] = useState<string>('');
    const [selectedWeekStart, setSelectedWeekStart] = useState<string>('');
    const [selectedWeekEnd, setSelectedWeekEnd] = useState<string>('');
    const [timesheetEntries, setTimesheetEntries] = useState<any[]>([]);
    const [formErrors, setFormErrors] = useState<string[]>([]);
    const [timesheetLoaded, setTimesheetLoaded] = useState(false);
    const [timesheetId, setTimesheetId] = useState<string | null>(null);
    const [allowances, setAllowances] = useState<number>(0); // Currently not used in UI

    // Fetch employees for the dropdown
    const { data: employees = [], isLoading, error } = useQuery({
        queryKey: ['employees'],
        queryFn: getEmployees,
    });

    // Mutation to load timesheet
    const loadTimesheetMutation = useMutation({
        mutationFn: async ({ employeeId, periodStart, periodEnd }: any) =>
            getTimeSheets(employeeId, periodStart, periodEnd),
        onSuccess: (data: any) => {
            // Prefill entries if API returns data, else create blank entries for the selected range
            const apiEntries = Array.isArray(data) && data.length > 0 ? data[0].entries : [];
            const allowances = Array.isArray(data) && data.length > 0 ? data[0].allowances || 0 : 0;

            const id = Array.isArray(data) && data.length > 0 ? data[0]._id : null;
            setTimesheetId(id);

            // Map selected date range and prefill from API if available
            const filledEntries = getDateRange(selectedWeekStart, selectedWeekEnd).map(date => {
                const found = apiEntries.find((e: any) => e.date.slice(0, 10) === date);
                return {
                    date,
                    startTime: found ? found.start : '',
                    endTime: found ? found.end : '',
                    breakMins: found ? found.unpaidBreakMins : 0,
                    // allowance: allowances,
                };
            });

            setTimesheetEntries(filledEntries);
            setTimesheetLoaded(true);
        },
        onError: () => {
            alert('Failed to load timesheet.');
            setTimesheetLoaded(false);
            setTimesheetId(null);
        }
    });

    // Handlers
    const handleEntryChange = (idx: number, field: string, value: any) => {
        setTimesheetEntries(entries =>
            entries.map((entry, i) =>
                i === idx ? { ...entry, [field]: value } : entry
            )
        );
    };

    // Date range pickers
    const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedWeekStart(e.target.value);
        setTimesheetLoaded(false);
        if (selectedWeekEnd && e.target.value > selectedWeekEnd) {
            setSelectedWeekEnd('');
        }
    };

    const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedWeekEnd(e.target.value);
        setTimesheetLoaded(false);
    };

    // Load timesheet handler
    const handleLoadTimesheet = () => {
        setFormErrors([]);
        setTimesheetLoaded(false);
        if (
            selectedEmployee &&
            selectedWeekStart &&
            selectedWeekEnd &&
            isSevenDayRange(selectedWeekStart, selectedWeekEnd)
        ) {
            loadTimesheetMutation.mutate({
                employeeId: selectedEmployee,
                periodStart: selectedWeekStart,
                periodEnd: selectedWeekEnd,
            });
        } else {
            setFormErrors(['Please select employee and a valid 7-day date range.']);
        }
    };

    // Mutation to add timesheet
    const addTimesheetMutation = useMutation({
        mutationFn: (payload: any) => addTimeSheet(payload),
        onSuccess: () => {
            alert('Timesheet submitted successfully!');
            // Optionally refetch or reset form
        },
        onError: (error: any) => {
            alert('Failed to submit timesheet.');
        }
    });

    // Mutation to update timesheet
    const updateTimesheetMutation = useMutation({
        mutationFn: (payload: any) => {
            if (!timesheetId) {
                return Promise.reject('No timesheet ID to update.');
            }
            return updateTimeSheet(timesheetId, payload);
        },
        onSuccess: () => {
            alert('Timesheet updated successfully!');
            // Optionally refetch or reset form
        },
        onError: (error: any) => {
            alert('Failed to update timesheet.');
        }
    });


    // Save handler
    const handleSave = () => {
        const errors = validateTimesheet({
            employeeId: selectedEmployee,
            periodStart: selectedWeekStart,
            periodEnd: selectedWeekEnd,
            entries: timesheetEntries,
            allowances: allowances // timesheetEntries.reduce((sum, e) => sum + (e.allowance || 0), 0),
        });
        setFormErrors(errors);
        if (errors.length === 0) {
            const payload = {
                employeeId: selectedEmployee,
                periodStart: selectedWeekStart,
                periodEnd: selectedWeekEnd,
                entries: timesheetEntries.map(e => ({
                    date: e.date,
                    start: e.startTime,
                    end: e.endTime,
                    unpaidBreakMins: e.breakMins
                })),
                allowances: allowances,
            };
            timesheetId ? updateTimesheetMutation.mutate(payload) : addTimesheetMutation.mutate(payload);
        }
    };

    return (
        <div className="container-fluid" style={{ padding: '15px', height: '100%', width: '100%' }}>
            <h2 className="mb-4">Timesheet Entry</h2>

            {/* Error display */}
            {formErrors && formErrors.length > 0 && (
                <div className="alert alert-danger" role="alert">
                    <ul className="mb-0">
                        {formErrors.map((err, idx) => (
                            <li key={idx}>{err}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Date range warning */}
            {selectedWeekStart && selectedWeekEnd && selectedWeekEnd >= selectedWeekStart && !isSevenDayRange(selectedWeekStart, selectedWeekEnd) && (
                <div className="alert alert-warning" role="alert">
                    Date range must be exactly 7 days.
                </div>
            )}

            {/* Employee and Date Range Form */}

            <form className="row g-3 mb-3 align-items-center">
                <div className="col-md-3">
                    <label className="form-label">Employee</label>
                    <select
                        id="employee-select"
                        className="form-select"
                        value={selectedEmployee}
                        onChange={e => {
                            setSelectedEmployee(e.target.value);
                            setTimesheetLoaded(false);
                        }}
                        required
                    >
                        <option value="">Select employee...</option>
                        {employees.map(emp => (
                            <option key={emp.id} value={emp.id}>
                                {emp.firstName} {emp.lastName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-3">
                    <label className="form-label">Period Start</label>
                    <input
                        id="week-start-picker"
                        className="form-control"
                        type="date"
                        value={selectedWeekStart}
                        onChange={handleStartChange}
                        required
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label">Period End</label>
                    <input
                        id="week-end-picker"
                        className="form-control"
                        type="date"
                        value={selectedWeekEnd}
                        min={selectedWeekStart}
                        onChange={handleEndChange}
                        required
                    />
                </div>
                <div className='col-md-3'>
                    <button
                        className="btn btn-primary"
                        type="button"
                        onClick={handleLoadTimesheet}
                        disabled={
                            !selectedEmployee ||
                            !selectedWeekStart ||
                            !selectedWeekEnd ||
                            selectedWeekEnd < selectedWeekStart ||
                            !isSevenDayRange(selectedWeekStart, selectedWeekEnd) ||
                            loadTimesheetMutation.isPending
                        }
                    >
                        {loadTimesheetMutation.isPending ? 'Loading...' : 'Load Timesheet'}
                    </button>
                </div>
            </form>

            {timesheetLoaded && (
                <>
                    <div className="table-responsive mb-3">
                        <table className="table table-bordered align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Date</th>
                                    <th>Start</th>
                                    <th>End</th>
                                    <th>Break (mins)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {timesheetEntries.map((entry, idx) => (
                                    <tr key={entry.date}>
                                        <td>{entry.date}</td>
                                        <td>
                                            <input
                                                type="time"
                                                className="form-control"
                                                value={entry.startTime}
                                                onChange={e => {
                                                    const newStart = e.target.value;
                                                    if (entry.endTime && newStart >= entry.endTime) {
                                                        alert('Start time must be before end time');
                                                        return;
                                                    }
                                                    handleEntryChange(idx, 'startTime', newStart);
                                                }}
                                                required
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="time"
                                                className="form-control"
                                                value={entry.endTime}
                                                onChange={e => {
                                                    const newEnd = e.target.value;
                                                    if (entry.startTime && newEnd <= entry.startTime) {
                                                        alert('End time must be after start time');
                                                        return;
                                                    }
                                                    handleEntryChange(idx, 'endTime', newEnd);
                                                }}
                                                required
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-control"
                                                min={0}
                                                value={entry.breakMins}
                                                onChange={e =>
                                                    handleEntryChange(idx, 'breakMins', Number(e.target.value))
                                                }
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mb-3">
                            <label className="form-label">Allowances ($)</label>
                            <input
                                id="allowances-input"
                                className="form-control"
                                type="number"
                                min={0}
                                step={0.01}
                                value={allowances}
                                onChange={e => setAllowances(Number(e.target.value))}
                                placeholder="Total Allowances for the week"
                            />
                        </div>
                    </div>
                    {/* Actions: Only show after timesheetLoaded */}
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-success"
                            disabled={
                                !selectedEmployee ||
                                !selectedWeekStart ||
                                !selectedWeekEnd ||
                                selectedWeekEnd < selectedWeekStart ||
                                !isSevenDayRange(selectedWeekStart, selectedWeekEnd) ||
                                !timesheetLoaded
                            }
                            onClick={handleSave}
                            type="button"
                        >
                            {timesheetId ? 'Update Timesheet' : 'Save Timesheet'}
                        </button>
                        <button className="btn btn-secondary" type="button" onClick={() => window.location.reload()}>Cancel</button>
                    </div>
                </>
            )}

        </div>
    );


};

export default TimesheetsPage;