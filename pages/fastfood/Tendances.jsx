import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { StaticIP } from '@/config/staticip';
import LayoutFastfood from '@/components/LayoutFastfood';
import BreadCrumb from '@/components/BreadCrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Tendances = () => {
    const [tendances, setTendances] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchTendances = async () => {
        try {
            const params = {};
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const response = await axios.get(`${StaticIP}api/vente/tendances`, { params });
            if (response.data.success) {
                setTendances(response.data.tendances);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des tendances', error);
        }
    };

    useEffect(() => {
        fetchTendances();
    }, []);

    const exportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(tendances);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Tendances");
        XLSX.writeFile(workbook, "Tendances_Ventes.xlsx");
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text("Tendances des ventes", 14, 10);
        const data = tendances.map(t => [t.designation, t.quantite, t.montant.toLocaleString(), t.tendance]);
        doc.autoTable({
            head: [["Produit", "Quantité", "Montant (F CFA)", "Tendance"]],
            body: data,
        });
        doc.save("Tendances_Ventes.pdf");
    };

    return (
        <LayoutFastfood>
            <BreadCrumb titre="tendances de vente" />
            
            <div className="card">

                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="text-center">Tendances des ventes</h5>
                </div>
                <div className='card-body'>
                    <div className='row'>
                        <div className='col'>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="form-control"
                                placeholder="Date début"
                            />
                        </div>
                        <div className='col'>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="form-control"
                                placeholder="Date fin"
                            />
                        </div>
                        <div className='col'>
                            <button className="btn btn-primary" onClick={fetchTendances}>Filtrer</button>
                        </div>
                        <div className='col'>
                            <button className="btn btn-success btn-sm me-2" onClick={exportExcel}>Exporter Excel</button>
              <button className="btn btn-danger btn-sm" onClick={exportPDF}>Exporter PDF</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-body">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Produit</th>
                                <th>Qté vendue</th>
                                <th>Recette (F CFA)</th>
                                <th>Tendance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tendances.length > 0 ? (
                                tendances.map((tendance, index) => (
                                    <tr key={index}>
                                        <td>{tendance.designation}</td>
                                        <td>{tendance.quantite}</td>
                                        <td>{tendance.montant.toLocaleString()}</td>
                                        <td>{tendance.tendance}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">Aucune donnée disponible</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className='col-md-6 mt-2'>
                <div className="card">
                    <div class="card-body">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={tendances} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="designation" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="quantite" fill="#8884d8" name="Quantité Vendue" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                </div>
            </div>
        </LayoutFastfood>
    );
};

export default Tendances;
