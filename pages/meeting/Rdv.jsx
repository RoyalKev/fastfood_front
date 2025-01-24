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
import LayoutMeeting from '@/components/LayoutMeeting';
import { StaticIP } from '@/config/staticip';

const Rdv = () => {

    const router = useRouter();

    //Pour la liste des rdv
    const [rdv, setrdv] = useState([]);
    const [users, setusers] = useState([]);
    const [error, setError] = useState(null);
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Récupération des rdv avec pagination
    const fetchrdv = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get(`${StaticIP}api/rdv/liste`);
            if (response.data.Status) {
                setrdv(response.data.Result);
                setTotalPages(response.data.Pagination.totalPages);
                setCurrentPage(response.data.Pagination.currentPage);
            } else {
                setError("Erreur lors de la récupération des rdv");
            }
        } catch (err) {
            setError("Une erreur est survenue lors de la récupération des rdv");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchrdv(currentPage);
    }, [currentPage]);

    const goToPage = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    // Récupération des users
    const fetchusers = async (e) => {
        setLoading(true);
        try {
            const response = await axios.get(`${StaticIP}api/auth/liste`);
            if (response.data.Status) {
                setusers(response.data.Result);
            } else {
                setError("Erreur lors de la récupération des utilisateurs");
            }
        } catch (err) {
            setError("Une erreur est survenue lors de la récupération des utilisateurs");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchusers(users);
    }, []);
    //FIN LISTE

    //POUR LA SUPPRESSION
    const [showModal, setShowModal] = useState(false);
    const [selectedRdv, setselectedRdv] = useState(null);
    const handleDelete = async () => {
        if (!selectedRdv) return;
        try {
            const response = await axios.delete(`${StaticIP}api/rdv/supprimer/${selectedRdv.id}`);
            if (response.data.Status) {
                setrdv(rdv.filter((rd) => rd.id !== selectedRdv.id));
                setShowModal(false);
                toast.success("RDV supprimée avec succès !");
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

    const [dataRdv, setDatarDV] = useState({
        type_rdv: '',
        priorite: '',
        description: '',
        date_rdv: '',
        emplacement: '',
        lieu: '',
        concerne: '',
        userid: null,
    })

    // Utilisez useEffect pour définir l'ID utilisateur une seule fois
    useEffect(() => {
        if (currentUser) {
            setuserId(currentUser.id);
            setDatarDV((prev) => ({ ...prev, userid: currentUser.id }));
        }
    }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('userid', dataRdv.userid);
        formData.append('type_rdv', dataRdv.type_rdv);
        formData.append('priorite', dataRdv.priorite);
        formData.append('description', dataRdv.description);
        formData.append('date_rdv', dataRdv.date_rdv);
        formData.append('emplacement', dataRdv.emplacement);
        formData.append('lieu', dataRdv.lieu);
        formData.append('concerne', dataRdv.concerne);
        /*for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }*/
        //if (logo_Boutique) formData.append('logo_Boutique', logo_Boutique);

        setLoading(true);
        try {
            const response = await axios.post(`${StaticIP}api/rdv/nouveau`, formData);
            console.log('la réggg :', response.data)
            if (response.data.Status) {
                toast.success('RDV créée avec succès !');
                setTimeout(() => {
                    setLoading(false);
                    window.location.reload(); // Rechargement de la page
                    //router.push('/NouveauBoutique');
                }, 2000);
            } else {
                toast.error(response.data.Error);
                setLoading(false);
            }
        } catch (err) {
            setLoading(false);
            console.log(err)
            if (err.response && err.response.data) {
                // Si l'erreur est liée à un type de fichier non supporté
                toast.error(err.response.data.message || 'Erreur lors de la création de la tâche');
            } else {
                console.log(err)
                toast.error('Une erreur est survenue');
            }
        }
    };
    //POUR LA RECUPERATION DUNE TACHE
    const [showModalRdv, setshowModalRdv] = useState(false);
    const [rdvdetail, setRdvdetail] = useState([]);
    const handleShowRdv = (id) => {
        setshowModalRdv(true)
        axios.get(`${StaticIP}api/rdv/detail/` + id)
            .then(result => {
                if (result.data.Status) {
                    if (result.data.Status) {
                        setRdvdetail(result.data.Result)
                    } else {
                        alert(result.data.Error)
                    }
                }
            })
    }
    return (
        <LayoutMeeting>
            <BreadCrumb titre="Rendez-vous" />
            <div className="row g-3 mb-3">
                <div className="col-xl-5 col-lg-5">
                    <div className="sticky-lg-top">
                        <div className="card mb-3">
                            <CardTitle title="Nouveau" />
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3 align-items-center">
                                        <div className="col-md-6">
                                            <label className="form-label">Type de rdv <font color="red">*</font></label>
                                            <select class="form-control"
                                                name="type_rdv"
                                                onChange={(e) => setDatarDV({ ...dataRdv, type_rdv: e.target.value })}
                                            >
                                                <option value=""> Sélectionner</option>
                                                <option value="Travail"> Travail</option>
                                                <option value="Négociation"> Négociation</option>
                                                <option value="Présentation"> Présentation</option>

                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Priorité <font color="red">*</font></label>
                                            <select class="form-control"
                                                name="priorite"
                                                onChange={(e) => setDatarDV({ ...dataRdv, priorite: e.target.value })}
                                            >
                                                <option value=""> Sélectionner</option>
                                                <option value="Normale"> Normale</option>
                                                <option value="Moyenne"> Moyenne</option>
                                                <option value="Urgente"> Urgente</option>

                                            </select>
                                        </div>
                                        <div className="col-md-12">
                                            <label className="form-label">Description <font color="red">*</font></label>
                                            <textarea class="form-control" name="description" placeholder="Saisir la description"
                                                onChange={(e) => setDatarDV({ ...dataRdv, description: e.target.value })}></textarea>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Date Rdv <font color="red">*</font></label>
                                            <input type="datetime-local" class="form-control"
                                                name="date_rdv"
                                                onChange={(e) => setDatarDV({ ...dataRdv, date_rdv: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Emplacement <font color="red">*</font></label>
                                            <select class="form-control"
                                                name="emplacement"
                                                onChange={(e) => setDatarDV({ ...dataRdv, emplacement: e.target.value })}
                                            >
                                                <option value=""> Sélectionner</option>
                                                <option value="Interne"> Interne</option>
                                                <option value="Externe"> Externe</option>

                                            </select>
                                        </div>
                                        {
                                            dataRdv.emplacement == "Externe" &&
                                            <div className="col-md-12">
                                            <label className="form-label">Lieu </label>
                                            <input type="text" class="form-control"
                                                name="lieu"
                                                onChange={(e) => setDatarDV({ ...dataRdv, lieu: e.target.value })}
                                            />
                                        </div>
                                        }
                                        
                                        <div className="col-md-12">
                                            <label className="form-label">Précisez le.s concerné.s <font color="red">*</font></label>
                                            <input type="text" class="form-control"
                                                name="concerne"
                                                onChange={(e) => setDatarDV({ ...dataRdv, concerne: e.target.value })}
                                            />
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

                <div class="col-xl-7 col-lg-7">
                    <div class="card">
                        <CardTitle title="Liste" />
                        <div class="card-body">
                            {rdv.length === 0 ? (
                                <p>Aucun rdv trouvé.</p>
                            ) : (
                                <>
                                    <table id="myDataTable" class="table table-hover align-middle mb-0" style={{ width: '100%' }}>
                                        <thead>
                                            <tr>
                                                <th>N°</th>
                                                <th>Type </th>
                                                <th>Priorité </th>
                                                <th>Concerné.s </th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rdv.map((rdv, index) => (
                                                <tr key={rdv.id}>
                                                    <td>{rdv.numero}</td>
                                                    <td>{rdv.type_rdv}</td>
                                                    <td>{rdv.priorite}</td>
                                                    <td>{rdv.concerne}</td>
                                                    <td>
                                                        <button className="btn btn-outline-info btn-sm">
                                                            <i className='icofont-edit'></i>
                                                        </button>
                                                        <button className="btn btn-outline-warning btn-sm"
                                                            title="Détails"
                                                            onClick={() => handleShowRdv(rdv.id)}>
                                                            <i className='icofont-eye' style={{color:"#cfa108"}}></i>
                                                        </button>
                                                        <button className="btn btn-outline-danger btn-sm"
                                                            title="Supprimer"
                                                            onClick={() => {
                                                                setselectedRdv(rdv);
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
                                    Êtes-vous sûr de vouloir supprimer le rdv : <strong>{selectedRdv?.numero}</strong> ?
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


                            <Modal show={showModalRdv} tabIndex='-1' scrollable>
                                <Modal.Header>
                                    <Modal.Title style={{ fontSize: '13px', fontWeight: '700', textAlign: 'center' }}>
                                        Détails du RDV
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body key={rdvdetail.id} scrollable>

                                    <div className="row">
                                        <div className="col-md-12 mb-3">
                                            <label className="form-label">Numéro</label>
                                            <input type="text" class="form-control"
                                                value={rdvdetail.numero}
                                            />
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <label className="form-label">Type</label>
                                            <input type="text" class="form-control"
                                                name="type_tache"
                                                value={rdvdetail.type_rdv}
                                            />
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <label className="form-label">Priorité</label>
                                            <input type="text" class="form-control"
                                                name="priorite"
                                                value={rdvdetail.priorite}
                                            />
                                        </div>
                                        {
                                            rdvdetail.description &&
                                            <div className="col-md-12 mb-3">
                                                <label className="form-label">Description</label>
                                                <textarea class="form-control"
                                                    name="description">
                                                    {rdvdetail.description}
                                                </textarea>

                                            </div>
                                        }
                                        <div className="col-md-12 mb-3">
                                            <label className="form-label">Date et Heure du RDV</label>
                                            <input type="text" class="form-control"
                                                name="date_rdv_reunion"
                                                value={new Date(rdvdetail.date_rdv).toLocaleString()}
                                            />
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <label className="form-label">Emplacement</label>
                                            <input type="text" class="form-control"
                                                name="emplacement"
                                                value={rdvdetail.emplacement}
                                            />
                                        </div>
                                        {
                                            rdvdetail.lieu &&
                                        <div className="col-md-12 mb-3">
                                            <label className="form-label">Lieu</label>
                                            <input type="text" class="form-control"
                                                name="lieu"
                                                value={rdvdetail.lieu}
                                            />
                                        </div>
                                            }
                                            <div className="col-md-12 mb-3">
                                            <label className="form-label">Concerné.s</label>
                                            <input type="text" class="form-control"
                                                name="concerne"
                                                value={rdvdetail.concerne}
                                            />
                                        </div>
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="danger" onClick={() => setshowModalRdv(false)}>
                                        <i className="icofont-close"></i> Fermer
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </div>

                    </div>
                </div>

            </div>
            {loading && (
                <div className="overlay">
                    <div className="loader"></div>
                </div>
            )}
        </LayoutMeeting>
    )
}

export default Rdv