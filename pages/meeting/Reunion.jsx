import BreadCrumb from '@/components/BreadCrumb';
import CardTitle from '@/components/CardTitle';
import Input from '@/components/Input';
import Layout from '@/components/LayoutRh'
import Pagination from '@/components/Pagination'
import { AuthContext } from '@/context/authContext';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button } from "react-bootstrap";
import LayoutMeeting from '@/components/LayoutMeeting';
import { StaticIP } from '@/config/staticip';

const Reunion = () => {

    const router = useRouter();

    //Pour la liste des grilles
    const [reunions, setreunions] = useState([]);
    const [salles, setsalles] = useState([]);
    const [grilles, setgrilles] = useState([]);
    const [error, setError] = useState(null);
    //PAGINATION DES GRILLES
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(5);
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = reunions.slice(indexOfFirstRecord, indexOfLastRecord);
    const nPages = Math.ceil(reunions.length / recordsPerPage)
    // Récupération des catégories
    const fetchreunions = async (e) => {
        setLoading(true);
        try {
            const response = await axios.get(`${StaticIP}api/reunion/liste`);
            if (response.data.Status) {
                setreunions(response.data.Result);
            } else {
                setError("Erreur lors de la récupération des réunions");
            }
        } catch (err) {
            setError("Une erreur est survenue lors de la récupération des réunions");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchreunions(currentPage);
    }, [currentPage]);

    //RECUPERATION DES salles

    // Récupération des catégories
    const fetchsalles = async (e) => {
        setLoading(true);
        try {
            const response = await axios.get(`${StaticIP}api/salle/liste`);
            if (response.data.Status) {
                setsalles(response.data.Result);
            } else {
                setError("Erreur lors de la récupération des salles");
            }
        } catch (err) {
            setError("Une erreur est survenue lors de la récupération des salles");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchsalles(salles);
    }, []);

    const goToPage = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    //FIN LISTE

    //POUR LA SUPPRESSION
    const [showModal, setShowModal] = useState(false);
    const [selectedReunion, setselectedReunion] = useState(null);
    const handleDelete = async () => {
        if (!selectedReunion) return;
        try {
            const response = await axios.delete(`${StaticIP}api/reunion/supprimer/${selectedReunion.id}`);
            if (response.data.Status) {
                setreunions(reunions.filter((reun) => reun.id !== selectedReunion.id));
                setShowModal(false);
                toast.success("Réunion supprimée avec succès !");
            } else {
                alert("Erreur : " + response.data.message);
            }
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
            alert("Une erreur est survenue lors de la suppression.");
        }
    };
    //FIN SUPPRESSION

    //POUR LA RECUPERATION DUNE REUNION
    const [showModalReunion, setShowModalReunion] = useState(false);
    const [reuniondetail, setReunionReunion] = useState([]);
    const handleShowReunion = (id) => {
        setShowModalReunion(true)
        axios.get(`${StaticIP}api/reunion/detail/` + id)
            .then(result => {
                if (result.data.Status) {
                    if (result.data.Status) {
                        setReunionReunion(result.data.Result)
                    } else {
                        alert(result.data.Error)
                    }
                }
            })
    }
    //FIN SUPPRESSION
    //POUR LA MISE A JOUR
    const [inputs, setInputs] = useState({
        date_debut_reunion: "",
        date_fin_reunion: "",
        emplacement_decision: "",
        emplacement: "",
        lieu: "",
        salle_id: "",
    })

    const handleChange = e => {
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }
    const [showModalUpd, setShowModalUpd] = useState(false);
    const [deletedId, setDeletedId] = useState("")
    const handleUpdate = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.put(`${StaticIP}api/reunion/update/` + deletedId, inputs)
            //.then(result => {
            console.log('la réssss est ', response.data)
            if (response.data.Status) {
                toast.success("Réunion reportée avec succès !");
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
    //POUR LE RAPPORT
    const [inputs2, setInputs2] = useState({
        rapport_final: "",
        si_decision: "",
        decision: "",
        fichier_rapport: "",
    })

    const handleChange2 = e => {
        setInputs2(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }
    const [showModalUpd2, setShowModalUpd2] = useState(false);
    const handleUpdate2 = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.put(`${StaticIP}api/reunion/rapport/` + deletedId, inputs2)
            //.then(result => {
            console.log('la réssss est ', response.data)
            if (response.data.Status) {
                toast.success("Rapport ajoutée avec succès !");
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

    //FIN RAPPORT

    const { currentUser } = useContext(AuthContext)
    const [userid, setuserId] = useState(null)
    const [loading, setLoading] = useState(false);

    const [dataReunion, setDataReunion] = useState({
        theme: '',
        details: '',
        date_debut_reunion: '',
        date_fin_reunion: '',
        emplacement: '',
        lieu: '',
        salle_id: '',
        userid: null,
    })

    // Utilisez useEffect pour définir l'ID utilisateur une seule fois
    useEffect(() => {
        if (currentUser) {
            setuserId(currentUser.id);
            setDataReunion((prev) => ({ ...prev, userid: currentUser.id }));
        }
    }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('userid', dataReunion.userid);
        formData.append('theme', dataReunion.theme);
        formData.append('details', dataReunion.details);
        formData.append('date_debut_reunion', dataReunion.date_debut_reunion);
        formData.append('date_fin_reunion', dataReunion.date_fin_reunion);
        formData.append('emplacement', dataReunion.emplacement);
        formData.append('lieu', dataReunion.lieu);
        formData.append('salle_id', dataReunion.salle_id);
        /*for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }*/
        //if (logo_Boutique) formData.append('logo_Boutique', logo_Boutique);

        setLoading(true);
        try {
            const response = await axios.post(`${StaticIP}api/reunion/nouveau`, formData);
            console.log('la réggg :', response.data)
            if (response.data.Status) {
                toast.success('Réunion créée avec succès !');
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
            //console.log(err)
            //console.log('URL appelée :', `${StaticIP}api/reunion/nouveau`);
            //console.log('Données envoyées :', formData);
            if (err.response && err.response.data) {
                // Si l'erreur est liée à un type de fichier non supporté
                //console.log('Voici la reponse ', err.response.data)
                toast.error(err.response.data.message || 'Erreur lors de la création de la réunion');
            } else {
                //console.log(err)
                toast.error('Une erreur est survenue');
            }
        }
    };
    const handleViewParticipants = (id) => {
        router.push(`/meeting/Participants/${id}`); // Redirige vers la page Participants avec l'ID
      };
      const handleViewDocuments = (id) => {
        router.push(`/meeting/DocumentReunions/${id}`); // Redirige vers la page DocumentCourrier avec l'ID
      };

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
            const response = await axios.put(`${StaticIP}api/reunion/cloturer/` + deletedId, inputs3)
            //.then(result => {
            console.log('la réssss est ', response.data)
            if (response.data.Status) {
                toast.success("Réunion clôturée avec succès !");
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
            <BreadCrumb titre="Réunions" />
            <div className="row g-3 mb-3">
                <div className="col-xl-6 col-lg-6">
                    <div className="sticky-lg-top">
                        <div className="card mb-3">
                            <CardTitle title="Nouveau" />
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3 align-items-center">
                                        <div className="col-md-12">
                                            <label className="form-label">Thème <font color="red">*</font></label>
                                            <input type="text" class="form-control"
                                                name="theme"
                                                onChange={(e) => setDataReunion({ ...dataReunion, theme: e.target.value })}
                                                placeholder="Saisir le thème de la réunion"
                                            />
                                        </div>
                                        <div className="col-md-12">
                                            <label className="form-label">Détails</label>
                                            <textarea class="form-control" name="details"
                                                onChange={(e) => setDataReunion({ ...dataReunion, details: e.target.value })}
                                                placeholder="Saisir les détails de la réunion"
                                            ></textarea>
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Date et Heure début <font color="red">*</font></label>
                                            <input type="datetime-local" class="form-control"
                                                name="date_debut_reunion"
                                                onChange={(e) => setDataReunion({ ...dataReunion, date_debut_reunion: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Date et Heure fin <font color="red">*</font></label>
                                            <input type="datetime-local" class="form-control"
                                                name="date_fin_reunion"
                                                onChange={(e) => setDataReunion({ ...dataReunion, date_fin_reunion: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Emplacement <font color="red">*</font></label>
                                            <select class="form-control"
                                                name="emplacement"
                                                onChange={(e) => setDataReunion({ ...dataReunion, emplacement: e.target.value })}
                                            >
                                                <option value=""> Sélectionner</option>
                                                <option value="Interne"> Interne</option>
                                                <option value="Externe"> Externe</option>

                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Lieu</label>
                                            <input type="text" class="form-control"
                                                name="lieu"
                                                onChange={(e) => setDataReunion({ ...dataReunion, lieu: e.target.value })}
                                                placeholder="Saisir le lieu de la réunion"
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Salle de réunion</label>
                                            <select class="form-control"
                                                name="salle_id"
                                                onChange={(e) => setDataReunion({ ...dataReunion, salle_id: e.target.value })}
                                            >
                                                <option value=""> Sélectionner</option>
                                                {salles.map((salle, index) => (
                                                    <option value={salle.id} key={salle.id}> {salle.numero_salle}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-12">
                                            <button type="submit" className="btn btn-success btn-sm mt-2" disabled={loading}>
                                                <i className='icofont-save'></i> {loading ? 'Connexion en cours...' : 'Enregistrer'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <ToastContainer />
                </div>

                <div class="col-xl-6 col-lg-6">
                    <div class="card">
                        <CardTitle title="Liste" />
                        <div class="card-body">
                            {reunions.length === 0 ? (
                                <p>Aucune réunion trouvée.</p>
                            ) : (
                                <>
                                    <table id="myDataTable" class="table table-hover align-middle mb-0" style={{ width: '100%' }}>
                                        <thead>
                                            <tr>
                                                <th>N°</th>
                                                <th>Date & heure début</th>
                                                <th>Salle/ Lieu</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentRecords.map((reunion, index) => (
                                                <tr key={reunion.id}>
                                                    <td>
                                                        {
                                                            reunion.status =="Cloturée" ?
                                                            <span className='badge bg-success'>{reunion.numero}</span>:
                                                            <span className='badge bg-warning'>{reunion.numero}</span>
                                                        }
                                                    </td>
                                                    <td>
                                                        {
                                                            new Date(reunion.date_debut_reunion).toLocaleString()
                                                        }
                                                    </td>
                                                    <td>
                                                        {
                                                            reunion.emplacement == "Interne" ?
                                                                reunion.salle_reunion
                                                                : reunion.lieu
                                                        }
                                                    </td>
                                                    <td>
                                                        <button className="btn btn-outline-info btn-sm">
                                                            <i className='icofont-edit'></i>
                                                        </button>
                                                        {
                                                            reunion.status == "Non démarré" &&
                                                        <button className="btn btn-outline-danger btn-sm"
                                                            title="Supprimer"
                                                            onClick={() => {
                                                                setselectedReunion(reunion);
                                                                setShowModal(true);
                                                            }}>
                                                            <i className='icofont-trash'></i>
                                                        </button>
                                                            }
                                                        <button type="button" className="btn btn-outline-info btn-sm" title="Documents"
                                                            onClick={() => handleViewDocuments(reunion.id)}>
                                                                <i className="icofont-files-stack"></i>
                                                        </button>
                                                        <br/>
                                                        <button className="btn btn-outline-warning btn-sm"
                                                            title="Détails"
                                                            onClick={() => handleShowReunion(reunion.id)}>
                                                            <i className='icofont-eye' style={{color:"#cfa108"}}></i>
                                                        </button>

                                                        

                                                        <button className="btn btn-outline-primary btn-sm"
                                                            title="Rapport de réunion"
                                                            onClick={() => {
                                                                setDeletedId(reunion.id);
                                                                setInputs2({ ...inputs, si_decision: "" })
                                                                setShowModalUpd2(true);
                                                            }}>
                                                            <i className='icofont-file-alt'></i>
                                                        </button>
                                                        
                                                        <button type="button" className="btn btn-outline-info btn-sm" title="Ajouter les participants"
                                                            onClick={() => handleViewParticipants(reunion.id)}>
                                                                <i className="icofont-users"></i>
                                                        </button>
                                                        {
                                                            reunion.status == "Non démarré" &&
                                                            <>
                                                            <button className="btn btn-outline-success btn-sm"
                                                            title="Reporter"
                                                            onClick={() => {
                                                                setDeletedId(reunion.id);
                                                                setInputs({ ...inputs, emplacement_decision: "" })
                                                                setShowModalUpd(true);
                                                            }}>
                                                            <i className="icofont-ui-reply"></i>
                                                        </button>
                                                            <button className="btn btn-success btn-sm"
                                                            title="Clôturer"
                                                            onClick={() => {
                                                                setDeletedId(reunion.id);
                                                                setselectedReunion(reunion);
                                                                setShowModal(false);
                                                                setShowModalUpd3(true);
                                                            }}>
                                                            <i className="icofont-close"></i>
                                                        </button>
                                                            
                                                            </>
                                                        
                                                                }

                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <br />
                                    <Pagination
                                        nPages={nPages}
                                        currentPage={currentPage}
                                        setCurrentPage={setCurrentPage}
                                    />
                                </>
                            )}
                            {/* Modal de confirmation */}
                            <Modal show={showModal} onHide={() => setShowModal(false)}>
                                <Modal.Header closeButton>
                                    <Modal.Title style={{ fontSize: '13px', fontWeight: '700', textAlign: 'center' }}>Confirmation</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    Êtes-vous sûr de vouloir supprimer cette réunion ?
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                                        <i className="icofont-close"></i> Annuler
                                    </Button>
                                    <Button variant="danger" onClick={handleDelete}>
                                        Confirmer
                                    </Button>
                                </Modal.Footer>
                            </Modal>

                            <Modal show={showModalReunion} tabIndex='-1' scrollable>
                                <Modal.Header>
                                    <Modal.Title style={{ fontSize: '13px', fontWeight: '700', textAlign: 'center' }}>
                                        Détails de la réunion
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body key={reuniondetail.id} scrollable>

                                    <div className="row">
                                        <div className="col-md-12 mb-3">
                                            <label className="form-label">Numéro</label>
                                            <input type="text" class="form-control"
                                                value={reuniondetail.numero}
                                            />
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <label className="form-label">Thème</label>
                                            <input type="text" class="form-control"
                                                name="theme"
                                                value={reuniondetail.theme}
                                            />
                                        </div>
                                        {
                                            reuniondetail.details &&
                                            <div className="col-md-12 mb-3">
                                                <label className="form-label">Détails</label>
                                                <textarea class="form-control"
                                                    name="details">
                                                    {reuniondetail.details}
                                                </textarea>

                                            </div>
                                        }
                                        <div className="col-md-12 mb-3">
                                            <label className="form-label">Date et Heure début</label>
                                            <input type="text" class="form-control"
                                                name="date_debut_reunion"
                                                value={new Date(reuniondetail.date_debut_reunion).toLocaleString()}
                                            />
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <label className="form-label">Date et Heure de fin</label>
                                            <input type="text" class="form-control"
                                                name="date_fin_reunion"
                                                value={new Date(reuniondetail.date_debut_reunion).toLocaleString()}
                                            />
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <label className="form-label">Emplacement</label>
                                            <input type="text" class="form-control"
                                                name="emplacement"
                                                value={reuniondetail.emplacement}
                                            />
                                        </div>
                                        {
                                            reuniondetail.emplacement == "Interne" ?
                                                <div className="col-md-12 mb-3">
                                                    <label className="form-label">Salle de réunion</label>
                                                    <input type="text" class="form-control"
                                                        name="emplacement"
                                                        value={reuniondetail.salle_reunion}
                                                    />
                                                </div>
                                                :
                                                <div className="col-md-12 mb-3">
                                                    <label className="form-label">Lieu</label>
                                                    <input type="text" class="form-control"
                                                        name="emplacement"
                                                        value={reuniondetail.lieu}
                                                    />
                                                </div>
                                        }
                                        {
                                            reuniondetail.rapport_final &&
                                            <div className="col-md-12 mb-3">
                                                <label className="form-label">Rapport de la réunion</label>
                                                <textarea class="form-control"
                                                    name="rapport">
                                                    {reuniondetail.rapport_final}
                                                </textarea>

                                            </div>
                                        }
                                        {
                                            reuniondetail.decision &&
                                            <div className="col-md-12 mb-3">
                                                <label className="form-label">Décision finale de la réunion</label>
                                                <textarea class="form-control"
                                                    name="decision">
                                                    {reuniondetail.decision}
                                                </textarea>

                                            </div>
                                        }

                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="danger" onClick={() => setShowModalReunion(false)}>
                                    <i className="icofont-close"></i> Fermer
                                    </Button>
                                </Modal.Footer>
                            </Modal>

                            <Modal show={showModalUpd} tabIndex='-1' scrollable>
                                <Modal.Header>
                                    <Modal.Title style={{ fontSize: '13px', fontWeight: '700', textAlign: 'center' }}>
                                        Reporter/ Modifier réunion
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body key={reuniondetail.id} scrollable>

                                    <div className="row">
                                        <div className="col-md-12 mb-3">
                                            <label className="form-label">Date et Heure début<font color="red">*</font></label>
                                            <input type="datetime-local" class="form-control"
                                                name="date_debut_reunion"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <label className="form-label">Date et Heure de fin<font color="red">*</font></label>
                                            <input type="datetime-local" class="form-control"
                                                name="date_fin_reunion"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col-md-12">
                                            <label className="form-label">Modifier le lieu de la réunion?<font color="red">*</font></label>
                                            <select class="form-control"
                                                name="emplacement_decision"
                                                onChange={handleChange}
                                            >
                                                <option value=""> Sélectionner</option>
                                                <option value="Oui"> Oui</option>
                                                <option value="Non"> Non</option>

                                            </select>
                                        </div>
                                        {
                                            inputs.emplacement_decision == "Oui" &&
                                            <>
                                                <div className="col-md-12">
                                                    <label className="form-label">Emplacement<font color="red">*</font></label>
                                                    <select class="form-control"
                                                        name="emplacement"
                                                        onChange={handleChange}
                                                    >
                                                        <option value=""> Sélectionner</option>
                                                        <option value="Interne"> Interne</option>
                                                        <option value="Externe"> Externe</option>

                                                    </select>
                                                </div>
                                                <div className="col-md-12">
                                                    <label className="form-label">Lieu</label>
                                                    <input type="text" class="form-control"
                                                        name="lieu"
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="col-md-12">
                                                    <label className="form-label">Salle de réunion</label>
                                                    <select class="form-control"
                                                        name="salle_id"
                                                        onChange={handleChange}
                                                    >
                                                        <option value=""> Sélectionner</option>
                                                        {salles.map((salle, index) => (
                                                            <option value={salle.id} key={salle.id}> {salle.numero_salle}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </>
                                        }

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

                            {/** MODAL DE FIN */}
                            <Modal show={showModalUpd2} tabIndex='-1' scrollable>
                                <Modal.Header>
                                    <Modal.Title style={{ fontSize: '13px', fontWeight: '700', textAlign: 'center' }}>
                                        Rapport de réunion
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body key={reuniondetail.id} scrollable>

                                    <div className="row">

                                        <div className="col-md-12">
                                            <label className="form-label">Rapport de la réunion<font color="red">*</font></label>
                                            <textarea class="form-control"
                                                name="rapport_final"
                                                onChange={handleChange2}
                                            ></textarea>
                                        </div>
                                        <div className="col-md-12">
                                            <label className="form-label">Voulez-vous ajouter la décision du DG ?<font color="red">*</font></label>
                                            <select class="form-control"
                                                name="si_decision"
                                                onChange={handleChange2}
                                            >
                                                <option value=""> Sélectionner</option>
                                                <option value="Oui"> Oui</option>
                                                <option value="Non"> Non</option>

                                            </select>
                                        </div>
                                        {
                                            inputs2.si_decision == "Oui" &&
                                            <>
                                                <div className="col-md-12">
                                                    <label className="form-label">Décision du DG/ Décision finale<font color="red">*</font></label>
                                                    <textarea class="form-control"
                                                        name="decision"
                                                        onChange={handleChange2}
                                                    ></textarea>
                                                </div>
                                            </>
                                        }
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="success" onClick={handleUpdate2}>
                                        <i className="icofont-ui-reply"></i> Ajouter rapport
                                    </Button>
                                    <Button variant="danger" onClick={() => setShowModalUpd2(false)}>
                                        <i className="icofont-close"></i> Fermer
                                    </Button>
                                </Modal.Footer>
                            </Modal>


                            <Modal show={showModalUpd3} tabIndex='-1' scrollable>
                                <Modal.Header>
                                    <Modal.Title style={{ fontSize: '13px', fontWeight: '700', textAlign: 'center' }}>
                                        Clôturer la réunion
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body key={reuniondetail.id} scrollable>

                                    <div className="row">
                                       
                                        <div className="col-md-12">
                                            <label className="form-label">Sélectionner l'état<font color="red">*</font></label>
                                            <select class="form-control"
                                                name="status"
                                                onChange={handleChange3}
                                            >
                                                <option value=""> Sélectionner</option>
                                                <option value="Cloturée"> Clôturer</option>

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
                {loading && (
                    <div className="overlay">
                        <div className="loader"></div>
                    </div>
                )}
            </div>


        </LayoutMeeting>
    )
}

export default Reunion