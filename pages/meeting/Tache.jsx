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

const Tache = () => {

    const router = useRouter();

    //Pour la liste des taches
    const [taches, settaches] = useState([]);
    const [users, setusers] = useState([]);
    const [error, setError] = useState(null);
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Récupération des taches avec pagination
    const fetchtaches = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get(`${StaticIP}api/tache/liste`);
            if (response.data.Status) {
                settaches(response.data.Result);
                setTotalPages(response.data.Pagination.totalPages);
                setCurrentPage(response.data.Pagination.currentPage);
            } else {
                setError("Erreur lors de la récupération des taches");
            }
        } catch (err) {
            setError("Une erreur est survenue lors de la récupération des taches");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchtaches(currentPage);
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
    const [selectedTache, setselectedTache] = useState(null);
    const handleDelete = async () => {
        if (!selectedTache) return;
        try {
            const response = await axios.delete(`${StaticIP}api/tache/supprimer/${selectedTache.id}`);
            if (response.data.Status) {
                settaches(taches.filter((user) => user.id !== selectedTache.id));
                setShowModal(false);
                toast.success("Tâche supprimée avec succès !");
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

    const [dataTache, setDataTache] = useState({
        type_tache: '',
        priorite: '',
        description: '',
        date_debut: '',
        date_echeance: '',
        responsable: '',
        userid: null,
    })

    // Utilisez useEffect pour définir l'ID utilisateur une seule fois
    useEffect(() => {
        if (currentUser) {
            setuserId(currentUser.id);
            setDataTache((prev) => ({ ...prev, userid: currentUser.id }));
        }
    }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('userid', dataTache.userid);
        formData.append('type_tache', dataTache.type_tache);
        formData.append('priorite', dataTache.priorite);
        formData.append('description', dataTache.description);
        formData.append('date_debut', dataTache.date_debut);
        formData.append('date_echeance', dataTache.date_echeance);
        formData.append('responsable', dataTache.responsable);
        /*for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }*/
        //if (logo_Boutique) formData.append('logo_Boutique', logo_Boutique);

        setLoading(true);
        try {
            const response = await axios.post(`${StaticIP}api/tache/nouveau`, formData);
            console.log('la réggg :', response.data)
            if (response.data.Status) {
                toast.success('Tâche créée avec succès !');
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
    const [deletedId, setDeletedId] = useState("")
    const [showModalTache, setShowModalTache] = useState(false);
    const [tachedetail, setTachedetail] = useState([]);
    const handleShowTache = (id) => {
        setShowModalTache(true)
        axios.get(`${StaticIP}api/tache/detail/` + id)
            .then(result => {
                if (result.data.Status) {
                    if (result.data.Status) {
                        setTachedetail(result.data.Result)
                    } else {
                        alert(result.data.Error)
                    }
                }
            })
    }

    //POUR LA MISE A JOUR
    const [inputs3, setInputs3] = useState({
        status: "",
    })

    const handleChange3 = e => {
        setInputs3(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }
    const [showModalUpd3, setShowModalUpd3] = useState(false);
    const handleUpdate3 = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.put(`${StaticIP}api/tache/executer/` + deletedId, inputs3)
            //.then(result => {
            console.log('la réssss est ', response.data)
            if (response.data.Status) {
                toast.success("Tâche mise à jour avec succès !");
                setTimeout(() => {
                    setLoading(false);
                    window.location.reload(); // Rechargement de la page
                    //router.push('/NouveauBoutique');
                }, 2000);
                //setShowModalUpd(false);

            } else {
                toast.error("Attention" + response.data.message);
            }
            //})
        } catch (error) {
            setLoading(false);
            console.log(error)
            if (error.response && error.response.data) {
                // Si l'erreur est liée à un type de fichier non supporté
                toast.error(error.response.data.message || 'Erreur lors de la création de la réunion');
            } else {
                console.log(error)
                toast.error('Une erreur est survenue');
            }
        }
    }

    //FIN MISE A JOUR
    return (
        <LayoutMeeting>
            <BreadCrumb titre="Tâches" />
            <div className="row g-3 mb-3">
                <div className="col-xl-5 col-lg-5">
                    <div className="sticky-lg-top">
                        <div className="card mb-3">
                            <CardTitle title="Nouveau" />
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3 align-items-center">
                                        <div className="col-md-6">
                                            <label className="form-label">Type de tâche <font color="red">*</font></label>
                                            <select class="form-control"
                                                name="type_tache"
                                                onChange={(e) => setDataTache({ ...dataTache, type_tache: e.target.value })}
                                            >
                                                <option value=""> Sélectionner</option>
                                                <option value="Administratif"> Administratif</option>
                                                <option value="Autres"> Autres</option>

                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Priorité <font color="red">*</font></label>
                                            <select class="form-control"
                                                name="priorite"
                                                onChange={(e) => setDataTache({ ...dataTache, priorite: e.target.value })}
                                            >
                                                <option value=""> Sélectionner</option>
                                                <option value="Normale"> Normale</option>
                                                <option value="Moyenne"> Moyenne</option>
                                                <option value="Urgente"> Urgente</option>

                                            </select>
                                        </div>
                                        <div className="col-md-12">
                                            <label className="form-label">Description <font color="red">*</font></label>
                                            <textarea class="form-control" name="description" placeholder="Saisir la description de la tâche"
                                                onChange={(e) => setDataTache({ ...dataTache, description: e.target.value })}></textarea>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Date début <font color="red">*</font></label>
                                            <input type="datetime-local" class="form-control"
                                                name="date_debut"
                                                onChange={(e) => setDataTache({ ...dataTache, date_debut: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Date échéance <font color="red">*</font></label>
                                            <input type="datetime-local" class="form-control"
                                                name="date_echeance"
                                                onChange={(e) => setDataTache({ ...dataTache, date_echeance: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-12">
                                            <label className="form-label">Responsable de la tâche <font color="red">*</font></label>
                                            <select class="form-control"
                                                name="responsable"
                                                onChange={(e) => setDataTache({ ...dataTache, responsable: e.target.value })}
                                            >
                                                <option value=""> Sélectionner </option>
                                                {users.map((user, index) => (
                                                    <option value={user.id} key={user.id}> {user.nom}</option>
                                                ))}
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

                <div class="col-xl-7 col-lg-7">
                    <div class="card">
                        <CardTitle title="Liste" />
                        <div class="card-body">
                            {taches.length === 0 ? (
                                <p>Aucune tâche trouvée.</p>
                            ) : (
                                <>
                                    <table id="myDataTable" class="table table-hover align-middle mb-0" style={{ width: '100%' }}>
                                        <thead>
                                            <tr>
                                                <th>N°</th>
                                                <th>Type </th>
                                                <th>Priorité </th>
                                                <th>Responsable </th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {taches.map((tache, index) => (
                                                <tr key={tache.id}>
                                                    <td>
                                                    {
                                                        tache.status ==="Exécutée" ?
                                                        <span className='badge bg-success'>{tache.numero}</span>:
                                                        <span className='badge bg-warning'>{tache.numero}</span>
                                                        }
                                                    </td>
                                                    <td>{tache.type_tache}</td>
                                                    <td>{tache.priorite}</td>
                                                    <td>{tache.nom_responsable}</td>
                                                    <td>
                                                        <button className="btn btn-outline-info btn-sm">
                                                            <i className='icofont-edit'></i>
                                                        </button>
                                                        <button className="btn btn-outline-warning btn-sm"
                                                            title="Détails"
                                                            onClick={() => handleShowTache(tache.id)}>
                                                            <i className='icofont-eye' style={{color:"#cfa108"}}></i>
                                                        </button>
                                                        {
                                                        tache.status ==="Non exécutée" &&
                                                        <button className="btn btn-outline-danger btn-sm"
                                                            title="Supprimer"
                                                            onClick={() => {
                                                                setselectedTache(tache);
                                                                setShowModal(true);
                                                            }}>
                                                            <i className='icofont-trash'></i>
                                                        </button>
                                                        }
                                                        {
                                                        tache.status ==="Non exécutée" &&
                                                        <button className="btn btn-outline-success btn-sm"
                                                            title="Exécuter"
                                                            onClick={() => {
                                                                setDeletedId(tache.id);
                                                                setselectedTache(tache);
                                                                setShowModal(false);
                                                                setShowModalUpd3(true);
                                                            }}>
                                                            <i className="icofont-ui-reply"></i>
                                                        </button>
                                                        }

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
                                    Êtes-vous sûr de vouloir supprimer la tâche : <strong>{selectedTache?.numero}</strong> ?
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


                            <Modal show={showModalTache} tabIndex='-1' scrollable>
                                <Modal.Header>
                                    <Modal.Title style={{ fontSize: '13px', fontWeight: '700', textAlign: 'center' }}>
                                        Détails de la tâche
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body key={tachedetail.id} scrollable>

                                    <div className="row">
                                        <div className="col-md-12 mb-3">
                                            <label className="form-label">Numéro</label>
                                            <input type="text" class="form-control"
                                                value={tachedetail.numero}
                                            />
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <label className="form-label">Type</label>
                                            <input type="text" class="form-control"
                                                name="type_tache"
                                                value={tachedetail.type_tache}
                                            />
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <label className="form-label">Priorité</label>
                                            <input type="text" class="form-control"
                                                name="priorite"
                                                value={tachedetail.priorite}
                                            />
                                        </div>
                                        {
                                            tachedetail.description &&
                                            <div className="col-md-12 mb-3">
                                                <label className="form-label">Description</label>
                                                <textarea class="form-control"
                                                    name="description">
                                                    {tachedetail.description}
                                                </textarea>

                                            </div>
                                        }
                                        <div className="col-md-12 mb-3">
                                            <label className="form-label">Date et Heure début</label>
                                            <input type="text" class="form-control"
                                                name="date_debut_reunion"
                                                value={new Date(tachedetail.date_debut).toLocaleString()}
                                            />
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <label className="form-label">Date et Heure échéance</label>
                                            <input type="text" class="form-control"
                                                name="date_echeance"
                                                value={new Date(tachedetail.date_echeance).toLocaleString()}
                                            />
                                        </div>
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="danger" onClick={() => setShowModalTache(false)}>
                                        <i className="icofont-close"></i> Fermer
                                    </Button>
                                </Modal.Footer>
                            </Modal>

                            <Modal show={showModalUpd3} tabIndex='-1' scrollable>
                                                            <Modal.Header>
                                                                <Modal.Title style={{ fontSize: '13px', fontWeight: '700', textAlign: 'center' }}>
                                                                    Exécuter la tâche
                                                                </Modal.Title>
                                                            </Modal.Header>
                                                            <Modal.Body key={tachedetail.id} scrollable>
                            
                                                                <div className="row">
                                                                   
                                                                    <div className="col-md-12">
                                                                        <label className="form-label">Sélectionner l'état<font color="red">*</font></label>
                                                                        <select class="form-control"
                                                                            name="status"
                                                                            onChange={handleChange3}
                                                                        >
                                                                            <option value=""> Sélectionner</option>
                                                                            <option value="Exécutée"> Exécuter la tâche</option>
                            
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            </Modal.Body>
                                                            <Modal.Footer>
                                                                <Button variant="success" onClick={handleUpdate3}>
                                                                    <i className="icofont-ui-reply"></i> Clôturer
                                                                </Button>
                                                                <Button variant="danger" onClick={() => setShowModalUpd3(false)}>
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

export default Tache