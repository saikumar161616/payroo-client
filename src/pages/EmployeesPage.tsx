import React, { useState } from 'react';
import '../styles/EmployeesPage.css';
import { Employee } from './../types/types';
import { getEmployees, addEmployee, updateEmployee } from '../api/employees';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const EmployeesPage: React.FC = () => {

    const [formData, setFormData] = useState<Partial<Employee>>({});
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [formError, setFormError] = useState<any>({});

    const validateForm = () => {
        const errors: any = {}

        const emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!formData.firstName || formData.firstName.trim() === '') errors.firstName = 'First name is required';
        if (!formData.lastName || formData.lastName.trim() === '') errors.lastName = 'Last name is required';

        //min 2 max 50 characters for first and last name
        if (formData.firstName && (formData.firstName.length < 2 || formData.firstName.length > 50)) errors.firstName = 'First name must be between 2 and 50 characters';
        if (formData.lastName && (formData.lastName.length < 2 || formData.lastName.length > 50)) errors.lastName = 'Last name must be between 2 and 50 characters';

        if (!formData.email || formData.email.trim() === '') errors.email = 'Email is required';
        else if (!emailPattern.test(formData.email)) errors.email = 'Email is invalid';
        if (!formData.type || formData.type.trim() === '') errors.type = 'Employee type is required';
        if (!formData.baseHourlyRate) errors.baseHourlyRate = 'Base hourly is required';
        if (!formData.superRate) errors.superRate = 'Super rate is required';
        if (!formData.bank?.bsb || formData.bank?.bsb.trim() === '') errors.bsb = 'Bank BSB is required';
        else if (!/^\d{3}-\d{3}$/.test(formData.bank.bsb)) errors.bsb = 'BSB must be in the format 083-123';
        if (!formData.bank?.account || formData.bank?.account.trim() === '') errors.account = 'Bank account is required';
        else if (!/^\d{6,12}$/.test(formData.bank.account)) errors.account = 'Account number must be 6 to 12 digits';
        return errors;
    }

    const queryClient = useQueryClient();

    // Fetch employees using React Query
    const { data: employees = [], isLoading, error } = useQuery({
        queryKey: ['employees'],
        queryFn: getEmployees,
    });

    // Mutation for adding a new employee
    const addEmployeeMutation = useMutation({
        mutationFn: (employee: Partial<Employee>) => addEmployee(employee),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['employees']
            }); // Refetch employees after adding
            setFormData({});
            alert('Employee added successfully!');
        },
        onError: (error) => {
            alert('Failed to add employee. Please try again.');
            console.log("Error in addEmployeeMutation:", error);
        }
    });

    // Mutation for updating an existing employee
    const updateEmployeeMutation = useMutation({
        mutationFn: ({ id, employee }: { id: string, employee: Partial<Employee> }) => updateEmployee(id, employee),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['employees']
            }); // Refetch employees after updating
            setIsEditing(false);
            setFormData({});
            alert('Employee updated successfully!');
        },
        onError: (error) => {
            alert('Failed to update employee. Please try again.');
            console.log("Error in updateEmployeeMutation:", error);
        }
    });

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errors = validateForm();
        setFormError(errors);
        if (Object.keys(errors).length > 0) return; // If there are validation errors, do not proceed
        if (isEditing) {
            // Update employee
            const { id, ...formDataWithoutId } = formData;
            updateEmployeeMutation.mutate({ id: id!, employee: formDataWithoutId });
        } else {
            // Add new employee
            addEmployeeMutation.mutate(formData);
        }
    };

    const handleEdit = (emp: Employee) => {
        setIsEditing(true);
        setFormData(emp);
    };

    if (isLoading) return <p>Loading employees...</p>;
    if (error) return <p className="error">{(error instanceof Error ? error.message : String(error))}</p>;

    return (
        <div className="container-fluid" style={{ padding: '15px', height: '100%', width: '100%' }}>
            <h1 className="mb-4">Employees</h1>

            {/* Error and loading display */}
            {isLoading && (
                <div className="alert alert-info" role="alert">
                    Loading employees...
                </div>
            )}
            {error && (
                <div className="alert alert-danger" role="alert">
                    {(typeof error === 'object' && error !== null && 'message' in error ? (error as Error).message : String(error))}
                </div>
            )}

            {/* Employee Form */}
            <form className="row g-3 mb-4 d-flex align-items-center" onSubmit={handleFormSubmit}>
                <div className="col-md-3 align-items-center">
                    <input
                        type="text"
                        name="firstName"
                        className="form-control"
                        placeholder="First Name"
                        value={formData.firstName || ''}
                        // required
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                    {formError?.firstName && <div className="text-danger small" id="firstNameError">{formError.firstName}</div>}
                </div>
                <div className="col-md-3">
                    <input
                        type="text"
                        name="lastName"
                        className="form-control"
                        placeholder="Last Name"
                        value={formData.lastName || ''}
                        // required
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                    {formError?.lastName && <div className="text-danger small" id="lastNameError">{formError.lastName}</div>}
                </div>
                <div className="col-md-3">
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="Email"
                        value={formData.email || ''}
                        // required
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    {formError?.email && <div className="text-danger small" id="emailError">{formError.email}</div>}
                </div>
                <div className="col-md-3">
                    <select
                        name="type"
                        className="form-select"
                        value={formData.type || ''}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    // required
                    >
                        <option value="" disabled>
                            Select Type
                        </option>
                        <option value="HOURLY">Hourly</option>
                    </select>
                    {formError?.type && <div className="text-danger small" id="typeError">{formError.type}</div>}
                </div>
                <div className="col-md-2">
                    <input
                        type="number"
                        name="baseHourlyRate"
                        className="form-control"
                        placeholder="Base Hourly Rate"
                        // required
                        min={0}
                        step="0.01"
                        value={formData.baseHourlyRate || ''}
                        onChange={(e) => setFormData({ ...formData, baseHourlyRate: parseFloat(e.target.value) })}
                    />
                    {formError?.baseHourlyRate && <div className="text-danger small" id="baseHourlyRateError">{formError.baseHourlyRate}</div>}
                </div>
                <div className="col-md-2">
                    <input
                        type="number"
                        name="superRate"
                        className="form-control"
                        placeholder="Super Rate (%)"
                        min={0}
                        step="0.01"
                        // required
                        value={formData.superRate || ''}
                        onChange={(e) => setFormData({ ...formData, superRate: parseFloat(e.target.value) })}
                    />
                    {formError?.superRate && <div className="text-danger small" id="superRateError">{formError.superRate}</div>}
                </div>
                <div className="col-md-2">
                    <input
                        type="text"
                        name="bankBsb"
                        className="form-control"
                        placeholder="Bank BSB (e.g. 083-123)"
                        // pattern='^\d{3}-\d{3}$'
                        // title='BSB must be in the format 083-123'
                        // required
                        value={formData.bank?.bsb || ''}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                bank: {
                                    bsb: e.target.value,
                                    account: formData.bank?.account || ''
                                }
                            })
                        }
                    />
                    {formError?.bsb && <div className="text-danger small" id="bsbError">{formError.bsb}</div>}
                </div>
                <div className="col-md-2">
                    <input
                        type="text"
                        name="bankAccount"
                        className="form-control"
                        placeholder="Bank Account (6-12 digits)"
                        // pattern='^\d{6,12}$'
                        // title='Account number must be 6 to 12 digits'
                        // required
                        value={formData.bank?.account || ''}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                bank: {
                                    bsb: formData.bank?.bsb || '',
                                    account: e.target.value
                                }
                            })
                        }
                    />
                    {formError?.account && <div className="text-danger small" id="accountError">{formError.account}</div>}
                </div>
                <div className="col-md-2">
                    <select
                        name="status"
                        className="form-select"
                        value={formData.status || ''}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                        <option value="" disabled>
                            Select Status
                        </option>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                    </select>
                </div>
                <div className="col-md-2 d-flex gap-2 align-items-center">
                    <button type="submit" className="btn btn-success">{isEditing ? 'Update' : 'Add'}</button>
                    <button type="button" className="btn btn-secondary" onClick={() => { setIsEditing(false); setFormData({}); }}>Cancel</button>
                </div>
            </form>

            {/* Employees Table */}
            {/* <div className="table-responsive">
                <table className="table table-bordered align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Type</th>
                            <th>Base Hourly Rate</th>
                            <th>Super Rate</th>
                            <th>Bank BSB</th>
                            <th>Bank Account</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="text-center">No employees found.</td>
                            </tr>
                        ) : (employees.map((emp) => (
                            <tr key={emp.id}>
                                <td>{emp.firstName}</td>
                                <td>{emp.lastName}</td>
                                <td>{emp.email}</td>
                                <td>{emp.type}</td>
                                <td>{emp.baseHourlyRate}</td>
                                <td>{emp.superRate}</td>
                                <td>{emp.bank.bsb}</td>
                                <td>{emp.bank.account}</td>
                                <td>
                                    <button className="btn btn-primary btn-sm" onClick={() => handleEdit(emp)}>Edit</button>
                                </td>
                            </tr>
                        ))
                        )}
                    </tbody>
                </table>
            </div> */}

            <div className="table-responsive overflow-auto">
                <table className="table table-bordered align-middle">
                    <thead className="table-light">
                        <tr>
                            <th className="text-nowrap">First Name</th>
                            <th className="text-nowrap">Last Name</th>
                            <th className="text-nowrap">Email</th>
                            <th className="text-nowrap">Type</th>
                            <th className="text-nowrap">Base Hourly Rate</th>
                            <th className="text-nowrap">Super Rate</th>
                            <th className="text-nowrap">Bank BSB</th>
                            <th className="text-nowrap">Bank Account</th>
                            <th className="text-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="text-center text-nowrap">No employees found.</td>
                            </tr>
                        ) : (employees.map((emp) => (
                            <tr key={emp.id}>
                                <td className="text-nowrap">{emp.firstName}</td>
                                <td className="text-nowrap">{emp.lastName}</td>
                                <td className="text-nowrap">{emp.email}</td>
                                <td className="text-nowrap">{emp.type}</td>
                                <td className="text-nowrap">{emp.baseHourlyRate}</td>
                                <td className="text-nowrap">{emp.superRate}</td>
                                <td className="text-nowrap">{emp.bank.bsb}</td>
                                <td className="text-nowrap">{emp.bank.account}</td>
                                <td className="text-nowrap">
                                    <button className="btn btn-primary btn-sm px-2"
                                        onClick={() => handleEdit(emp)}>Edit</button>
                                </td>
                            </tr>
                        ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default EmployeesPage;