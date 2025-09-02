import React, { useEffect, useState } from 'react';
import '../styles/EmployeesPage.css';
import { Employee } from './../types/types';
import { getEmployees, addEmployee, updateEmployee } from '../api/employees';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const EmployeesPage: React.FC = () => {

    // const [employees, setEmployees] = useState<Employee[]>([]);
    // const [formData, setFormData] = useState<Partial<Employee>>({});
    // const [isEditing, setIsEditing] = useState<boolean>(false);
    // const [loading, setLoading] = useState<boolean>(false);
    // const [error, setError] = useState<string | null>(null);

    // const queryClient = useQueryClient();

    // // Fetch employees on component mount
    // useEffect(() => {
    //     fetchEmployees();
    // }, []);

    // const fetchEmployees = async () => {
    //     setLoading(true);
    //     setError(null);
    //     try {
    //         const data = await getEmployees();
    //         setEmployees(data);
    //         console.log("Fetched employees:", data);
    //     } catch (err) {
    //         console.log("Error fetching employees:", err);
    //         setError('Failed to fetch employees. Please try again.');
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    // const handleEdit = (emp: Employee) => {
    //     setIsEditing(true);
    //     setFormData(emp);
    // }

    // const handleFormSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     if (isEditing) {
    //         // Update existing employee logic
    //         try {
    //             const { id, ...formDataWithoutId } = formData;
    //             const res = await updateEmployee(formData.id! || '', formDataWithoutId);
    //             if (res) {
    //                 setEmployees(employees.map(emp => emp.id === res.id ? res : emp));
    //                 setIsEditing(false);
    //                 setFormData({});
    //             }
    //         }
    //         catch (err) {
    //             console.log("Error updating employee:", err);
    //             setError('Failed to update employee. Please try again.');
    //         }
    //     }
    //     else {
    //         // Add new employee logic
    //         try {
    //             const res = await addEmployee(formData);
    //             if (res) {
    //                 setEmployees([...employees, res]);
    //                 setFormData({});
    //             }
    //         } catch (err) {
    //             console.log("Error adding employee:", err);
    //             setError('Failed to add employee. Please try again.');
    //         }
    //     }
    // };


    const [formData, setFormData] = useState<Partial<Employee>>({});
    const [isEditing, setIsEditing] = useState<boolean>(false);

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
        <div className="employees-container">
            <h1>Employees</h1>

            <form className='employee-form' onSubmit={handleFormSubmit}>

                <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName || ''}
                    required
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName || ''}
                    required
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email || ''}
                    required
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <select
                    name="type"
                    value={formData.type || ''}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    required
                >
                    <option value="" disabled>
                        Select Type
                    </option>
                    <option value="HOURLY">Hourly</option>
                </select>

                <input
                    type="number"
                    name="baseHourlyRate"
                    placeholder="Base Hourly Rate"
                    required
                    value={formData.baseHourlyRate || ''}
                    onChange={(e) => setFormData({ ...formData, baseHourlyRate: parseFloat(e.target.value) })}
                />
                <input
                    type="number"
                    name="superRate"
                    placeholder="Super Rate (%)"
                    required
                    value={formData.superRate || ''}
                    onChange={(e) => setFormData({ ...formData, superRate: parseFloat(e.target.value) })}
                />
                <input
                    type="text"
                    name="bankBsb"
                    placeholder="Bank BSB"
                    required
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
                <input
                    type="text"
                    name="bankAccount"
                    placeholder="Bank Account"
                    required
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

                <select
                    name="status"
                    value={formData.status || ''}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                    <option value="" disabled>
                        Select Status
                    </option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                </select>

                <button type="submit">{isEditing ? 'Update Employee' : 'Add Employee'}</button>
                <button type="button" onClick={() => { setIsEditing(false); setFormData({}); }}>Cancel</button>
            </form>

            <div className="table-container">
                <table className="employees-table">
                    <thead>
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
                                <td colSpan={9} style={{ textAlign: 'center' }}>No employees found.</td>
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
                                <td> <button onClick={() => handleEdit(emp)} >Edit</button> </td>
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