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

const Courrier = () => {

    const router = useRouter();

    //Pour la liste des courriers
    const [courriers, setcourriers] = useState([]);
    const [users, setusers] = useState([]);
    const [error, setError] = useState(null);
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Récupération des courriers avec pagination
    const fetchcourriers = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get(`${StaticIP}api/courrier/liste`);
            if (response.data.Status) {
                setcourriers(response.data.Result);
                setTotalPages(response.data.Pagination.totalPages);
                setCurrentPage(response.data.Pagination.currentPage);
            } else {
                setError("Erreur lors de la récupération des courriers");
            }
        } catch (err) {
            setError("Une erreur est survenue lors de la récupération des courriers");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchcourriers(currentPage);
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
    const [selectedcourrier, setselectedcourrier] = useState(null);
    const handleDelete = async () => {
        if (!selectedcourrier) return;
        try {
            const response = await axios.delete(`${StaticIP}api/courrier/supprimer/${selectedcourrier.id}`);
            if (response.data.Status) {
                setcourriers(courriers.filter((cour) => cour.id !== selectedcourrier.id));
                setShowModal(false);
                toast.success("Courrier supprimé avec succès !");
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

    const [datacourrier, setDatacourrier] = useState({
        date_reception: '',
        type: '',
        nature: '',
        objet: '',
        priorite: '',
        expediteur: '',
        mode_transmission: '',
        lieu_stockage: '',
        delai_traitement: '',
        charge_traitement: '',
        commentaires: '',
        userid: null,
    })

    // Utilisez useEffect pour définir l'ID utilisateur une seule fois
    useEffect(() => {
        if (currentUser) {
            setuserId(currentUser.id);
            setDatacourrier((prev) => ({ ...prev, userid: currentUser.id }));
        }
    }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('userid', datacourrier.userid);
        formData.append('date_reception', datacourrier.date_reception);
        formData.append('type', datacourrier.type);
        formData.append('nature', datacourrier.nature);
        formData.append('objet', datacourrier.objet);
        formData.append('priorite', datacourrier.priorite);
        formData.append('expediteur', datacourrier.expediteur);
        formData.append('mode_transmission', datacourrier.mode_transmission);
        formData.append('lieu_stockage', datacourrier.lieu_stockage);
        formData.append('delai_traitement', datacourrier.delai_traitement);
        formData.append('charge_traitement', datacourrier.charge_traitement);
        formData.append('commentaires', datacourrier.commentaires);
        /*for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }*/
        //if (logo_Boutique) formData.append('logo_Boutique', logo_Boutique);

        setLoading(true);
        try {
            const response = await axios.post(`${StaticIP}api/courrier/nouveau`, formData);
            console.log('la réggg :', response.data)
            if (response.data.Status) {
                toast.success('Courrier crée avec succès !');
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
                toast.error(err.response.data.message || 'Erreur lors de la création du courrier');
            } else {
                console.log(err)
                toast.error('Une erreur est survenue');
            }
        }
    };
    //POUR LA RECUPERATION DUNE courrier
    const [showModalcourrier, setShowModalcourrier] = useState(false);
    const [courrierdetail, setcourrierdetail] = useState([]);
    const handleShowcourrier = (id) => {
        setShowModalcourrier(true)
        axios.get(`${StaticIP}api/courrier/detail/` + id)
            .then(result => {
                if (result.data.Status) {
                    if (result.data.Status) {
                        setcourrierdetail(result.data.Result)
                    } else {
                        alert(result.data.Error)
                    }
                }
            })
    }
    const [inputs, setInputs] = useState({
            status: "",
        })
    const handleChange = e => {
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }
    const [showModalUpd, setShowModalUpd] = useState(false);
    const [deletedId, setDeletedId] = useState("")
    const handleUpdate = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.put(`${StaticIP}api/courrier/update_status/` + deletedId, inputs)
            //.then(result => {
            console.log('la réssss est ', response.data)
            if (response.data.Status) {
                toast.success("Statut du courrier mis à jour avec succès !");
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
    const handleViewDocuments = (id) => {
        router.push(`/meeting/DocumentCourriers/${id}`); // Redirige vers la page DocumentCourrier avec l'ID
      };
    return (
        <LayoutMeeting>
            <BreadCrumb titre="Courriers" />
            <div className="row g-3 mb-3">
                <div className="col-xl-5 col-lg-5">
                    <div className="sticky-lg-top">
                        <div className="card mb-3">
                            <CardTitle title="Nouveau" />
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3 align-items-center">
                                    <div className="col-md-6">
                                            <label className="form-label">Date de réception <font color="red">*</font></label>
                                            <input type="datetime-local" class="form-control"
                                                name="date_reception"
                                                onChange={(e) => setDatacourrier({ ...datacourrier, date_reception: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Type <font color="red">*</font></label>
                                            <select class="form-control"
                                                name="type"
                                                onChange={(e) => setDatacourrier({ ...datacourrier, type: e.target.value })}
                                            >
                                                <option value=""> Sélectionner</option>
                                                <option value="Officiel"> Officiel</option>
                                                <option value="Personnel"> Personnel</option>
                                                <option value="Urgent"> Urgent</option>
                                                <option value="Confidentiel"> Confidentiel</option>
                                                <option value="Autres"> Autres</option>

                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Nature <font color="red">*</font></label>
                                            <select class="form-control"
                                                name="nature"
                                                onChange={(e) => setDatacourrier({ ...datacourrier, nature: e.target.value })}
                                            >
                                                <option value=""> Sélectionner</option>
                                                <option value="Entrant"> Entrant </option>
                                                <option value="Sortant"> Sortant</option>

                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Priorité <font color="red">*</font></label>
                                            <select class="form-control"
                                                name="priorite"
                                                onChange={(e) => setDatacourrier({ ...datacourrier, priorite: e.target.value })}
                                            >
                                                <option value=""> Sélectionner</option>
                                                <option value="Normale"> Normale</option>
                                                <option value="Moyenne"> Moyenne</option>
                                                <option value="Urgente"> Urgente</option>

                                            </select>
                                        </div>
                                        <div className="col-md-12">
                                            <label className="form-label">Objet <font color="red">*</font></label>
                                            <textarea class="form-control" name="objet" placeholder="Saisir la description du courrier"
                                                onChange={(e) => setDatacourrier({ ...datacourrier, objet: e.target.value })}></textarea>
                                        </div>
                                        
                                        <div className="col-md-12">
                                        <label className="form-label">Expéditeur/Destinataire <font color="red">*</font></label>
                                        <input type="text" class="form-control"
                                            name="expediteur"
                                            onChange={(e) => setDatacourrier({ ...datacourrier, expediteur: e.target.value })}
                                            placeholder="Saisir le nom de l'expéditeur'"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                            <label className="form-label">Mode de transmission <font color="red">*</font></label>
                                            <select class="form-control"
                                                name="mode_transmission"
                                                onChange={(e) => setDatacourrier({ ...datacourrier, mode_transmission: e.target.value })}
                                            >
                                                <option value=""> Sélectionner</option>
                                                <option value="Email"> Email</option>
                                                <option value="Courrier postal"> Courrier postal</option>
                                                <option value="Messagerie"> Messagerie</option>

                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                        <label className="form-label">Lieu de stockage <font color="red">*</font></label>
                                        <input type="text" class="form-control"
                                            name="lieu_stockage"
                                            onChange={(e) => setDatacourrier({ ...datacourrier, lieu_stockage: e.target.value })}
                                            placeholder="Saisir l'emplacement de stockage"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                            <label className="form-label">Délai de traitement</label>
                                            <input type="datetime-local" class="form-control"
                                                name="delai_traitement"
                                                onChange={(e) => setDatacourrier({ ...datacourrier, delai_traitement: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-12">
                                        <label className="form-label">Chargé du traitement</label>
                                        <input type="text" class="form-control"
                                            name="charge_traitement"
                                            onChange={(e) => setDatacourrier({ ...datacourrier, charge_traitement: e.target.value })}
                                            placeholder="Saisir le nom du chargé"
                                        />
                                    </div>
                                        <div className="col-md-12">
                                            <label className="form-label">Commentaires</label>
                                            <textarea class="form-control" name="commentaires" placeholder=""
                                                onChange={(e) => setDatacourrier({ ...datacourrier, commentaires: e.target.value })}></textarea>
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
                            {courriers.length === 0 ? (
                                <p>Aucun courrier trouvé.</p>
                            ) : (
                                <>
                                    <table id="myDataTable" class="table table-hover align-middle mb-0" style={{ width: '100%' }}>
                                        <thead>
                                            <tr>
                                                <th>N°</th>
                                                <th>Type </th>
                                                <th>Statut </th>
                                                <th>Priorité </th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {courriers.map((courrier, index) => (
                                                <tr key={courrier.id}>
                                                    <td>{courrier.numero}</td>
                                                    <td>{courrier.type}</td>
                                                    <td>{courrier.statut}</td>
                                                    <td>{courrier.priorite}</td>
                                                    <td>
                                                    <button className="btn btn-outline-success btn-sm"
                                                            title="Mettre à jour statut"
                                                            onClick={() => {
                                                                setDeletedId(courrier.id);
                                                                handleShowcourrier(courrier.id)
                                                                setShowModalcourrier(false)
                                                                setShowModalUpd(true);
                                                            }}>
                                                            <i className="icofont-ui-reply"></i>
                                                        </button>
                                                        <button className="btn btn-outline-warning btn-sm"
                                                            title="Détails"
                                                            onClick={() => handleShowcourrier(courrier.id)}>
                                                            <i className='icofont-eye' style={{color:"#cfa108"}}></i>
                                                        </button>
                                                        <button type="button" className="btn btn-outline-info btn-sm" title="Documents"
                                                            onClick={() => handleViewDocuments(courrier.id)}>
                                                                <i className="icofont-files-stack"></i>
                                                        </button>
                                                        <button className="btn btn-outline-danger btn-sm"
                                                            title="Supprimer"
                                                            onClick={() => {
                                                                setselectedcourrier(courrier);
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
                                    Êtes-vous sûr de vouloir supprimer le courrier : <strong>{selectedcourrier?.numero}</strong> ?
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


                            <Modal show={showModalcourrier} tabIndex='-1' scrollable>
                                <Modal.Header>
                                    <Modal.Title style={{ fontSize: '13px', fontWeight: '700', textAlign: 'center' }}>
                                        Détails du courrier
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body key={courrierdetail.id} scrollable>

                                    <div className="row">
                                    {
                                        courrierdetail.date_reception &&
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Délai de traitement</label>
                                            <input type="text" class="form-control"
                                                name="date_reception"
                                                value={new Date(courrierdetail.date_reception).toLocaleString()}
                                            />
                                        </div>
                                        }
                                    {
                                        courrierdetail.delai_traitement &&
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Délai de traitement</label>
                                            <input type="text" class="form-control"
                                                name="delai_traitement"
                                                value={new Date(courrierdetail.delai_traitement).toLocaleString()}
                                            />
                                        </div>
                                        }
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Numéro</label>
                                            <input type="text" class="form-control"
                                                value={courrierdetail.numero}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Type</label>
                                            <input type="text" class="form-control"
                                                name="type"
                                                value={courrierdetail.type}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Nature</label>
                                            <input type="text" class="form-control"
                                                name="nature"
                                                value={courrierdetail.nature}
                                            />
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <label className="form-label">Objet</label>
                                            <input type="text" class="form-control"
                                                name="objet"
                                                value={courrierdetail.objet}
                                            />
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label className="form-label">Priorité</label>
                                            <input type="text" class="form-control"
                                                name="priorite"
                                                value={courrierdetail.priorite}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Expéditeur/Destinaire</label>
                                            <input type="text" class="form-control"
                                                name="expediteur"
                                                value={courrierdetail.expediteur}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Mode de transmission</label>
                                            <input type="text" class="form-control"
                                                name="mode_transmission"
                                                value={courrierdetail.mode_transmission}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Lieu de stockage</label>
                                            <input type="text" class="form-control"
                                                name="lieu_stockage"
                                                value={courrierdetail.lieu_stockage}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Chargé du traitement</label>
                                            <input type="text" class="form-control"
                                                name="charge_traitement"
                                                value={courrierdetail.charge_traitement}
                                            />
                                        </div>
                                        {
                                            courrierdetail.commentaires &&
                                            <div className="col-md-12 mb-3">
                                                <label className="form-label">Commentaires</label>
                                                <textarea class="form-control"
                                                    name="commentaires">
                                                    {courrierdetail.commentaires}
                                                </textarea>

                                            </div>
                                        }

                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="danger" onClick={() => setShowModalcourrier(false)}>
                                        <i className="icofont-close"></i> Fermer
                                    </Button>
                                </Modal.Footer>
                            </Modal>

                            <Modal show={showModalUpd} tabIndex='-1' scrollable>
                                                            <Modal.Header>
                                                                <Modal.Title style={{ fontSize: '13px', fontWeight: '700', textAlign: 'center' }}>
                                                                    Mettre à jour statut du courrier
                                                                </Modal.Title>
                                                            </Modal.Header>
                                                            <Modal.Body key={courrierdetail.id} scrollable>
                            
                                                                <div className="row">
                                                                   
                                                               
                                                                        <>
                                                                        <div className="col-md-12 mb-3">
                                                                            <label className="form-label">Numéro</label>
                                                                            <input type="text" class="form-control"
                                                                                value={courrierdetail.numero}
                                                                            />
                                                                        </div>
                                                                            <div className="col-md-12">
                                                                                <label className="form-label">Statut<font color="red">*</font></label>
                                                                                <select class="form-control"
                                                                                    name="status"
                                                                                    onChange={handleChange}
                                                                                >
                                                                                    <option value=""> Sélectionner</option>
                                                                                    <option value="En attente"> En attente</option>
                                                                                    <option value="En traitement"> En traitement</option>
                                                                                    <option value="Traité"> Traité</option>
                                                                                    <option value="Archivé"> Archivé</option>
                            
                                                                                </select>
                                                                            </div>
                                                                        </>
                                                                    
                                                                </div>
                                                            </Modal.Body>
                                                            <Modal.Footer>
                                                                <Button variant="success" onClick={handleUpdate}>
                                                                    <i className="icofont-ui-reply"></i> Mettre à jour
                                                                </Button>
                                                                <Button variant="danger" onClick={() => setShowModalUpd(false)}>
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

export default Courrier