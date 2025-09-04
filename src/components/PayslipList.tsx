import React, { useState } from "react";
import { Payslip } from "../types/types";
import jsPDF from "jspdf";

const PayslipList: React.FC<{ payslips: Payslip[] }> = ({ payslips }) => {

    const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);

    const handleDownload = (payslip: Payslip | null) => {
        if (!payslip) return;
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Payslip", 10, 15);
        doc.setFontSize(12);
        doc.text(`Employee ID: ${payslip.employeeId.id}`, 10, 30);
        doc.text(`Name: ${payslip.employeeId.firstName} ${payslip.employeeId.lastName}`, 10, 40);
        if (payslip.employeeId.email) {
            doc.text(`Email: ${payslip.employeeId.email}`, 10, 50);
        }
        doc.text("Earnings:", 10, 65);
        doc.text(`Gross: $${payslip.gross}`, 10, 75);
        doc.text(`Tax: $${payslip.tax}`, 10, 85);
        doc.text(`Net: $${payslip.net}`, 10, 95);
        doc.text(`Super: $${payslip.super}`, 10, 105);
        doc.text(`Normal Hours: ${payslip.normalHours}`, 10, 115);
        doc.text(`Overtime Hours: ${payslip.overtimeHours}`, 10, 125);
        doc.save(`payslip-${payslip.employeeId.id}.pdf`);
    }

    return (
        <div className="table-responsive mt-4">
            <h6>Payslips for selected payrun</h6>
            <table className="table table-bordered align-middle">
                <thead className="table-light">
                    <tr>
                        <th className="text-nowrap">Employee ID</th>
                        <th className="text-nowrap">Gross</th>
                        <th className="text-nowrap">Tax</th>
                        <th className="text-nowrap">Net</th>
                        <th className="text-nowrap">Super</th>
                        <th className="text-nowrap">Normal Hours</th>
                        <th className="text-nowrap">Overtime Hours</th>
                        <th className="text-nowrap">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {payslips.map(payslip => (
                        <tr key={payslip.employeeId.id}>
                            <td className="text-nowrap">{payslip.employeeId.id}</td>
                            <td className="text-nowrap">{`$${payslip.gross}`}</td>
                            <td className="text-nowrap">{`$${payslip.tax}`}</td>
                            <td className="text-nowrap">{`$${payslip.net}`}</td>
                            <td className="text-nowrap">{`$${payslip.super}`}</td>
                            <td className="text-nowrap">{payslip.normalHours}</td>
                            <td className="text-nowrap">{payslip.overtimeHours}</td>
                            <td className="text-nowrap">
                                <button className="btn btn-secondary btn-sm"
                                    onClick={() => setSelectedPayslip(payslip)}
                                >View Payslip</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal for selected payslip details */}
            {selectedPayslip && (
                <div className="modal show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Payslip Details</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={() => setSelectedPayslip(null)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p> <strong>Employee ID : </strong> {`${selectedPayslip?.employeeId?.id}`} </p>
                                <p> <strong>Employee name : </strong> {`${selectedPayslip?.employeeId?.firstName} ${selectedPayslip?.employeeId?.lastName}`} </p>
                                <p> <strong>Employee email : </strong> {`${selectedPayslip?.employeeId?.email}` } </p>

                                <h6> Earnings </h6>
                                <p> <strong>Gross : </strong> {`$${selectedPayslip?.gross}`} </p>
                                <p> <strong>Tax : </strong> {`$${selectedPayslip?.tax}`} </p>
                                <p> <strong>Net : </strong> {`$${selectedPayslip?.net}`} </p>
                                <p> <strong>Super : </strong> {`$${selectedPayslip?.super}`} </p>
                            </div>
                            <div className="modal-footer" style={{ flexWrap: 'nowrap' , gap: 10}} >
                                <button type="button" className="btn btn-success" onClick={() => handleDownload(selectedPayslip)}>Download</button>
                                <button type="button" className="btn btn-secondary" onClick={() => setSelectedPayslip(null)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </div>

    )
};

export default PayslipList;