import BreadCrumb from '@/components/BreadCrumb';
import CardTitle from '@/components/CardTitle';
import Input from '@/components/Input';
import Layout from '@/components/LayoutRh'
import { AuthContext } from '@/context/authContext';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button } from "react-bootstrap";
import { StaticIP } from '@/config/staticip';
import LayoutFastfood from '@/components/LayoutFastfood';

const ModifierTable = () => {

    const router = useRouter();

    const { id } = router.query;

    //Pour la liste des tables
    const [tables, settables] = useState([]);
    const [error, setError] = useState(null);
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1); 

    // Récupération des tables avec pagination
    const fetchtables = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get(`${StaticIP}api/table/liste?page=${page}&limit=5`);
            if (response.data.Status) {
                settables(response.data.Result);
                setTotalPages(response.data.Pagination.totalPages);
                setCurrentPage(response.data.Pagination.currentPage);
            } else {
                setError("Erreur lors de la récupération des tables");
            }
        } catch (err) {
            setError("Une erreur est survenue lors de la récupération des tables");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchtables(currentPage);
    }, [currentPage]);

    const goToPage = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    //FIN LISTE

    //POUR LA SUPPRESSION
    const [showModal, setShowModal] = useState(false);
    const [selectedtable, setselectedtable] = useState(null);
    const handleDelete = async () => {
        if (!selectedtable) return;
        try {
            const response = await axios.delete(`${StaticIP}api/table/supprimer/${selectedtable.id}`);
            if (response.data.Status) {
                settables(tables.filter((dep) => dep.id !== selectedtable.id));
                setShowModal(false);
                toast.success("table supprimée avec succès !");
            } else {
                alert("Erreur : " + response.data.message);
            }
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
            alert("Une erreur est survenue lors de la suppression."); 
        }
    };
    //FIN SUPPRESSION

    const { currentUser } = useContext(AuthContext)
    const [userid, setuserId] = useState(null)
    const [loading, setLoading] = useState(false);

    //DONNEES DE MODIFICATION DUN CATEGORIE
        const [detailtable, setddetailtable] = useState([])
        
            const fetchdetailtable = async (e) => {
                setLoading(true);
                if (!id) return;
                try {
                    const response = await axios.get(`${StaticIP}api/table/detail/${id}`);
                    if (response.data.Status) {
                        setddetailtable(response.data.Result);
                    } else {
                        setError("Erreur lors de la récupération des categories");
                    }
                } catch (err) {
                    setError("Une erreur est survenue lors des categories");
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            useEffect(() => {
                fetchdetailtable();
            }, [id]);
            useEffect(() => {
            if (detailtable && Object.keys(detailtable).length > 0) {
                setDatatable({
                    emplacement: detailtable.emplacement || "",
                    reference: detailtable.reference || "",
                    userid: currentUser?.id || null,
                });
            }
        }, [detailtable]);
    //FIN DONNEE MODIF CATEGORIE

    const [datatable, setDatatable] = useState({
        reference: detailtable.reference ,
        emplacement: detailtable.emplacement,
        userid: null,
    })

    // Utilisez useEffect pour définir l'ID utilisateur une seule fois
    useEffect(() => {
        if (currentUser) {
            setuserId(currentUser.id);
            setDatatable((prev) => ({ ...prev, userid: currentUser.id }));
        }
    }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('userid', datatable.userid);
        formData.append('reference', datatable.reference);
        formData.append('emplacement', datatable.emplacement);
        /*for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }*/
        //if (logo_Boutique) formData.append('logo_Boutique', logo_Boutique);

        setLoading(true);
        try {
            const response = await axios.put(`${StaticIP}api/table/modifier/${id}`, formData);
            console.log('la réggg :', response.data)
            if (response.data.Status) {
                toast.success('Table créée avec succès !');
                fetchtables();
            } else {
                toast.error(response.data.Error);
                setLoading(false);
            }
        } catch (err) {
            setLoading(false);
            console.log(err)
            if (err.response && err.response.data) {
                // Si l'erreur est liée à un type de fichier non supporté
                toast.error(err.response.data.message || 'Erreur lors de la création de la table');
            } else {
                console.log(err)
                toast.error('Une erreur est survenue');
            }
        }
    };
    return (
        <LayoutFastfood>
            <BreadCrumb titre="tables" />
            <div className="row g-3 mb-3">
                <div className="col-xl-4 col-lg-4">
                    <div className="sticky-lg-top">
                        <div className="card mb-3">
                            <CardTitle title="Nouveau" />
                            <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3 align-items-center">
                                    <div className="col-md-12">
                                        <label className="form-label">Référence de la table<font color="red">*</font></label>
                                        <input type="text" class="form-control"
                                            name="reference"
                                            onChange={(e) => setDatatable({ ...datatable, reference: e.target.value })}
                                            value={datatable.reference}
                                        />
                                    </div>
                                    <div className="col-md-12">
                                            <label className="form-label">Emplacement<font color="red">*</font></label>
                                            <select class="form-control"
                                                name="emplacement"
                                                onChange={(e) => setDatatable({ ...datatable, emplacement: e.target.value })}
                                            >
                                                <option value={datatable.emplacement}> {datatable.emplacement}</option>
                                                <option value="Intérieur"> Intérieur</option>
                                                <option value="Extérieur"> Extérieur</option>
                                            </select>
                                        </div>
                                    <div className="col-md-12">
                                        <button type="submit" className="btn btn-success btn-sm mt-2" disabled={loading}>
                                            <i className='icofont-save'></i> {loading ? 'Enregistrement en cours...' : 'Enregistrer'}
                                        </button>
                                    </div>
                                </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <ToastContainer />
                </div>

                <div class="col-xl-8 col-lg-8">
                    <div class="card">
                    <CardTitle title="Liste" />
                        <div class="card-body">
                                        {tables.length === 0 ? (
                                                <p>Aucune table trouvée.</p>
                                            ) : (
                                                <>
                                            <table id="myDataTable" class="table table-hover align-middle mb-0" style={{ width:'100%'}}>
                                                <thead>
                                                    <tr>
                                                        <th>N°</th>
                                                        <th>Référence</th>
                                                        <th>Emplacement</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {tables.map((table, index) => (
                                                    <tr key={table.id}>
                                                        <td>{index +1}</td>
                                                        <td>{table.reference}</td>
                                                        <td>{table.emplacement}</td>
                                                        <td>
                                                            <button className="btn btn-outline-info btn-sm">
                                                                <i className='icofont-edit'></i>
                                                            </button>
                                                            <button className="btn btn-outline-danger btn-sm"
                                                                title="Supprimer"
                                                                onClick={() => {
                                                                    setselectedtable(table);
                                                                    setShowModal(true);
                                                                }}>
                                                                <i className='icofont-trash'></i>
                                                            </button>
                                                            
                                                        </td>
                                                    </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <div style={{ marginTop: "20px", textAlign: "center" }}>
                                            <button
                                                onClick={() => goToPage(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                style={{ marginRight: "10px" }}
                                                className="btn btn-warning btn-sm"
                                            >
                                                <span aria-hidden="true">&laquo;</span> Précédent
                                            </button>
                                            <span>Page {currentPage} sur {totalPages}</span>
                                            <button
                                                onClick={() => goToPage(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                style={{ marginLeft: "10px" }}
                                                className="btn btn-warning btn-sm"
                                            >
                                                Suivant <span aria-hidden="true">&raquo;</span>
                                            </button>
                                        </div>
                                        </>
                                            )}
                                            {/* Modal de confirmation */}
                                            <Modal show={showModal} onHide={() => setShowModal(false)}>
                                                <Modal.Header closeButton>
                                                    <Modal.Title>Confirmation</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    Êtes-vous sûr de vouloir supprimer la table : <strong>{selectedtable?.reference}</strong> ?
                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                                                        Annuler
                                                    </Button>
                                                    <Button variant="danger" onClick={handleDelete}>
                                                        Confirmer
                                                    </Button>
                                                </Modal.Footer>
                                            </Modal>
                                </div>

                    </div>
                </div>
                
            </div>
        </LayoutFastfood>
    )
}

export default ModifierTable