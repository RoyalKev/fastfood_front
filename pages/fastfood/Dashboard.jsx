import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Dashboardvendeur from '@/components/Dashboardvendeur';
import Copyright from '@/components/Copyright';
import { AuthContext } from '@/context/authContext';
import LayoutFastfood from '@/components/LayoutFastfood';
import VenteMensuelle from '@/components/VenteMensuelles';
import VentesJour from '@/components/Admin/VentesJour';
import { StaticIP } from '@/config/staticip';
import Link from 'next/link';
import { PieChart, Cell, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";



export default function Dashboard() {
    const router = useRouter();
    const { name, profil } = router.query;
    const [userRole, setUserRole] = useState('');
    const { currentUser } = useContext(AuthContext)
    const [nbProduitsSeuil, setNbProduitsSeuil] = useState(0);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await axios.get(`${StaticIP}api/produit/produits-seuil-count`);
                setNbProduitsSeuil(response.data.count);
            } catch (error) {
                console.error("Erreur lors de la récupération du nombre :", error);
            }
        };
        fetchCount();
    }, []);

    const [moisActuel, setMoisActuel] = useState(0);
    const [moisPasse, setMoisPasse] = useState(0);

    useEffect(() => {
        axios.get(`${StaticIP}api/vente/stats-ventes-mensuelles`)
            .then((res) => {
                setMoisActuel(res.data.moisActuel);
                setMoisPasse(res.data.moisPasse);
            })
            .catch((err) => {
                console.error("Erreur lors de la récupération des stats :", err);
            });
    }, []);
    //VENTE COMPARATIF
    const [ventes, setVentes] = useState({ mois_courant: 0, mois_passe: 0 });
    useEffect(() => {
        axios.get(`${StaticIP}api/vente/comparatif-mensuel`)
            .then((res) => {
                if (res.data.success) {
                    setVentes(res.data.data);
                }
            })
            .catch((err) => {
                console.error("Erreur lors de la récupération des ventes mensuelles", err);
            });
    }, []);
    const data1 = [
        {
            mois: "Mois précédent",
            montant: ventes.mois_passe
        },
        {
            mois: "Mois en cours",
            montant: ventes.mois_courant
        }
    ];
    //FIN VENTE COMPARATIF

    //VENTE HEBDO
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    const [datahebdo, setDatahebdo] = useState([]);
    useEffect(() => {
        axios.get(`${StaticIP}api/vente/vente-hebdomadaire`).then(res => {
            const formatted = res.data.data.map(item => ({
                semaine: `S${item.semaine.toString().slice(-2)}`,
                montant: item.montant
            }));
            setDatahebdo(formatted);
        });
    }, []);
    //FIN VENTE HEBDO

    return (
        <LayoutFastfood>
            {
                currentUser && currentUser.role == "Admin" &&
                <>
                    <div class="row g-3 mb-3 row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-2 row-cols-xl-4">
                        <div class="col">
                            <div class="alert-success alert mb-0">
                                <div class="d-flex align-items-center">
                                    <div class="avatar rounded no-thumbnail bg-success text-light"><i class="fa fa-dollar fa-lg"></i></div>
                                    <div class="flex-fill ms-3 text-truncate">
                                        <div class="h6 mb-0">Revenue mois en cours</div>
                                        <span class="small">{moisActuel.toLocaleString()} F</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col">
                            <div class="alert-danger alert mb-0">
                                <div class="d-flex align-items-center">
                                    <div class="avatar rounded no-thumbnail bg-danger text-light"><i class="fa fa-credit-card fa-lg"></i></div>
                                    <div class="flex-fill ms-3 text-truncate">
                                        <div class="h6 mb-0">Revenue mois passé</div>
                                        <span class="small">{moisPasse.toLocaleString()} F</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col">
                            <div class="alert-warning alert mb-0">
                                <div class="d-flex align-items-center">
                                    <div class="avatar rounded no-thumbnail bg-warning text-light"><i class="fa fa-smile-o fa-lg"></i></div>
                                    <div class="flex-fill ms-3 text-truncate">
                                        <div class="h6 mb-0">Total appro</div>
                                        <span class="small">345.000F</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col">
                            <div class="alert-info alert mb-0">
                                <div class="d-flex align-items-center">
                                    <div class="avatar rounded no-thumbnail bg-info text-light"><i class="fa fa-shopping-bag" aria-hidden="true"></i></div>
                                    <div class="flex-fill ms-3 text-truncate">
                                        <div class="h6 mb-0">Autres dépenses</div>
                                        <span class="small">65.856F</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div class="col alert-light alert mb-0"> Produits en alerte de stock : &nbsp;&nbsp;
                        <span className='badge bg-danger'>{nbProduitsSeuil}</span> &nbsp;&nbsp;&nbsp;&nbsp;
                        <Link href="/fastfood/ProduitSeuil">Voir la liste </Link>
                    </div>

                    <div class="row">
                        <div className='col-md-6 mt-2'>
                            <div className="card">
                                <div class="card-header">
                                    <h6>Stat mensuelle des ventes</h6>
                                </div>
                                <div class="card-body">
                                    <VenteMensuelle />
                                </div>

                            </div>
                        </div>
                        <div className='col-md-6 mt-2'>
                            <div className="card">
                                <div class="card-header">
                                    <h6>Ventes du jour</h6>
                                </div>
                                <div class="card-body">
                                    <VentesJour />
                                </div>

                            </div>
                        </div>
                        <div className='col-md-4 mt-2'>
                            <div className="card">
                                <div class="card-header">
                                    <h6>Comparatif des Ventes mensuelles(FCFA)</h6>
                                </div>
                                <div class="card-body">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={data1} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="mois" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="montant" fill="#8884d8" name="Montant total" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                            </div>
                        </div>
                        <div className='col-md-4 mt-2'>
                            <div className="card">
                                <div class="card-header">
                                    <h6>Comparatif des ventes hebdomadaire(FCFA)</h6>
                                </div>
                                <div class="card-body">
                                    <PieChart width={400} height={300}>
                                        <Pie
                                            data={datahebdo}
                                            dataKey="montant"
                                            nameKey="semaine"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            fill="#8884d8"
                                            label
                                        >
                                            {datahebdo.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => `${value.toLocaleString()} F`} />
                                        <Legend />
                                    </PieChart>
                                </div>

                            </div>
                        </div>
                    </div>
                </>
            }

        </LayoutFastfood>
    );
}