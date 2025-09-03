import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEmployees } from "../api/employees";
// import { runPayrun } from "../api/payruns"; // Implement this API call
import Select from "react-select";

const PayrunPage: React.FC = () => {
    const [periodStart, setPeriodStart] = useState("");
    const [periodEnd, setPeriodEnd] = useState("");
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [error, setError] = useState<string | null>(null);



    const queryClient = useQueryClient();

    // Fetch employees for multi-select
    const { data: employees = [], isLoading } = useQuery({
        queryKey: ["employees"],
        queryFn: getEmployees,
    });

    const employeeOptions = employees.map(emp => ({
        value: emp.id,
        label: `${emp.firstName} ${emp.lastName}`
    }));

    // Mutation for running payrun (stub, implement API)
    // const runPayrunMutation = useMutation({
    //     mutationFn: (payload) => runPayrun(payload),
    //     onSuccess: () => { ... },
    //     onError: (error) => { ... }
    // });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsRunning(true);
        // TODO: Call runPayrun API here
        // try {
        //     await runPayrunMutation.mutateAsync({
        //         periodStart,
        //         periodEnd,
        //         employeeIds: selectedEmployees
        //     });
        // } catch (err: any) {
        //     setError("Failed to run payrun");
        // }
        setIsRunning(false);
    };

    return (
        <div className="container mt-4">
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
            <form className="row g-3 mb-4 d-flex align-items-center" onSubmit={handleSubmit}>
                <div className="col-md-3">
                    <label htmlFor="periodStart" className="form-label">Period Start</label>
                    <input
                        type="date"
                        id="periodStart"
                        className="form-control"
                        value={periodStart}
                        required
                        onChange={e => setPeriodStart(e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <label htmlFor="periodEnd" className="form-label">Period End</label>
                    <input
                        type="date"
                        id="periodEnd"
                        className="form-control"
                        value={periodEnd}
                        required
                        onChange={e => setPeriodEnd(e.target.value)}
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="employeeSelect" className="form-label">Employees</label>
                    <Select
                        inputId="employeeSelect"
                        isMulti
                        options={employeeOptions}
                        value={employeeOptions.filter(opt => selectedEmployees.includes(opt.value))}
                        onChange={opts => setSelectedEmployees(opts.map(opt => opt.value))}
                        classNamePrefix="react-select"
                        placeholder="Select employees..."
                        required
                    />
                    <div className="form-text">Search and select multiple employees</div>
                </div>
                <div className="col-md-12 d-flex gap-2 align-items-center">
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
            {/* TODO: Show payrun results table here */}
        </div>
    );
};

export default PayrunPage;