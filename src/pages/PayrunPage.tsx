import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEmployees } from "../api/employees";
import { runPayrun, getPayruns } from "../api/payruns";
import Select from "react-select";
import { formatDateAndTime, formatDate } from "../utils/date.utils";
import PayslipList from "../components/PayslipList";

const PayrunPage: React.FC = () => {
    const [periodStart, setPeriodStart] = useState("");
    const [periodEnd, setPeriodEnd] = useState("");
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
    const [selectedPayslips, setSelectedPayslips] = useState<any[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const queryClient = useQueryClient();

    // Fetch employees for multi-select
    const { data: employees = [], isLoading } = useQuery({
        queryKey: ["employees"],
        queryFn: getEmployees,
    });

    // Fetch payruns 
    const { data: payruns = [], isLoading: isLoadingPayruns } = useQuery({
        queryKey: ["payruns"],
        queryFn: getPayruns,
    });

    const employeeOptions = employees.map(emp => ({
        value: emp.id,
        label: `${emp.firstName} ${emp.lastName}`
    }));

    // Mutation for running payrun 
    const payrunMutation = useMutation({
        mutationFn: (payload: { periodStart: string; periodEnd: string; employeeIds: string[] }) => runPayrun(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payruns'] });
            alert("Payrun executed successfully");
        },
        onError: (err: any) => {
            console.log("Error running payrun:", err);
            setError(err.message || "Failed to run payrun");
            alert(`Error: ${err.message || "Failed to run payrun"}`);
        }

    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsRunning(true);
        payrunMutation.mutate({
            periodStart: periodStart,
            periodEnd: periodEnd,
            employeeIds: selectedEmployees
        });
        setIsRunning(false);
    };

    return (
        <div className="container-fluid" style={{ padding: '15px', height: '100%', width: '100%' }}>
            <h1 className="mb-4">Payrun</h1>
            {isLoading && (
                <div className="alert alert-info" role="alert">
                    Loading employees...
                </div>
            )}
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            <form className="d-flex align-items-center gap-2 mb-2 flex-wrap" onSubmit={handleSubmit}>
                <div className="flex-shrink-0">
                    <label className="form-label mb-0 me-2">Period Start</label>
                    <input
                        type="date"
                        id="periodStart"
                        className="form-control"
                        value={periodStart}
                        required
                        onChange={e => setPeriodStart(e.target.value)}
                        style={{ minWidth: 140 }}
                    />
                </div>
                <div className="flex-shrink-0">
                    <label className="form-label mb-0 me-2">Period End</label>
                    <input
                        type="date"
                        id="periodEnd"
                        className="form-control"
                        value={periodEnd}
                        required
                        onChange={e => setPeriodEnd(e.target.value)}
                        style={{ minWidth: 140 }}
                    />
                </div>
                <div className="flex-shrink-0" style={{ minWidth: 220 }}>
                    <label className="form-label mb-0 me-2">Employees</label>
                    <Select
                        inputId="employeeSelect"
                        isMulti
                        options={employeeOptions}
                        value={employeeOptions.filter(opt => selectedEmployees.includes(opt.value))}
                        onChange={opts => setSelectedEmployees(opts.map(opt => opt.value))}
                        classNamePrefix="form-control"
                        styles={{
                            control: (base) => ({
                                ...base,
                                height: '38px'
                            }),
                            valueContainer: (base) => ({ ...base, padding: '5px' }),
                            indicatorsContainer: (base) => ({ ...base, display: 'none' }),
                            input: (base) => ({ ...base, margin: '0', visibility: 'visible' }),
                            placeholder: (base) => ({ ...base, fontSize: '0.875rem', color: '#6c757d', padding: '5px' })
                        }}
                        placeholder="Select or Search Employees"
                        required
                    />
                </div>
                <div className="flex-shrink-0 d-flex gap-2 align-items-end">
                    <button
                        type="submit"
                        className="btn btn-success"
                        disabled={isRunning || isLoading || !periodStart || !periodEnd || selectedEmployees.length === 0}
                    >
                        {isRunning ? "Running..." : "Payrun"}
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                            setPeriodStart("");
                            setPeriodEnd("");
                            setSelectedEmployees([]);
                        }}
                    >
                        Reset
                    </button>
                </div>
            </form>
            <div className="table-responsive mt-4" style={{ height: '180px', overflowX: 'hidden' }}>
                <h6>Payruns</h6>
                <table className="table table-bordered align-middle">
                    <thead className="table-light">
                        <tr>
                            <th className="text-nowrap">ID</th>
                            <th className="text-nowrap">Period Start</th>
                            <th className="text-nowrap">Period End</th>
                            <th className="text-nowrap">Total Gross</th>
                            <th className="text-nowrap">Total Tax</th>
                            <th className="text-nowrap">Total Net</th>
                            <th className="text-nowrap">Total Super</th>
                            <th className="text-nowrap">Created Date (Australia-Melbourne Timezone)</th>
                            <th className="text-nowrap">Actions</th>
                        </tr>
                    </thead>


                    <tbody>

                        {isLoadingPayruns ? (
                            <tr>
                                <td colSpan={8} className="text-center">Loading payruns...</td>
                            </tr>
                        ) : payruns.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center">No payruns found</td>
                            </tr>
                        ) : (
                            payruns.map(payrun => (
                                <tr key={payrun.id}>
                                    <td className="text-nowrap">{payrun.id}</td>
                                    <td className="text-nowrap">{formatDate(payrun.periodStart)}</td>
                                    <td className="text-nowrap">{formatDate(payrun.periodEnd)}</td>
                                    <td className="text-nowrap">{`$${payrun.totals.gross}`}</td>
                                    <td className="text-nowrap">{`$${payrun.totals.tax}`}</td>
                                    <td className="text-nowrap">{`$${payrun.totals.net}`}</td>
                                    <td className="text-nowrap">{`$${payrun.totals.super}`}</td>
                                    <td className="text-nowrap">{formatDateAndTime(payrun.createdAt)}</td>
                                    <td className="text-nowrap">
                                        <button className="btn btn-primary btn-sm"
                                            onClick={() => setSelectedPayslips(payrun.payslips)}
                                        >View Payslips</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>

                </table>
            </div>

            {selectedPayslips.length > 0 && (
                <PayslipList payslips={selectedPayslips} />
            )}

        </div>
    );
};

export default PayrunPage;