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
import { Modal, Button, Form, Table } from "react-bootstrap";
import { StaticIP } from '@/config/staticip';

const Contrat = () => {

    const router = useRouter();

    //RECUPERATION DES EMPLOYES

    const [showModalEmp, setShowModalEmp] = useState(false);
    const [employes, setEmployes] = useState([]);
    const fetchemployes = async (e) => {
        setLoading(true);
        try {
            const response = await axios.get(`${StaticIP}api/employe/liste`);
            if (response.data.Status) {
                setEmployes(response.data.Result);
            } else {
                setError("Erreur lors de la récupération des employes");
            }
        } catch (err) {
            setError("Une erreur est survenue lors de la récupération des employes");
            console.error(err);
        }
    };
    useEffect(() => {
        fetchemployes(employes);
    }, []);
    const [filteredEmployees, setFilteredEmployees] = useState(employes);
    const [selectedEmployeeName, setSelectedEmployeeName] = useState('');
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setSearchTerm(searchValue);
        setFilteredEmployees(
            employes.filter((employee) =>
                employee.employe_data.toLowerCase().includes(searchValue)
            )
        );
    };

    const selectEmployee = (employee) => {
        setSelectedEmployeeName(employee.employe_data);
        setSelectedEmployeeId(employee.id);
        setShowModalEmp(false);
    };


    //RECUPERATION DES BANQUES

    const [banques, setBanques] = useState([]);
    const fetchbanques = async (e) => {
        setLoading(true);
        try {
            const response = await axios.get(`${StaticIP}api/banque/liste`);
            if (response.data.Status) {
                setBanques(response.data.Result);
            } else {
                setError("Erreur lors de la récupération des banques");
            }
        } catch (err) {
            setError("Une erreur est survenue lors de la récupération des banques");
            console.error(err);
        }
    };
    useEffect(() => {
        fetchbanques(banques);
    }, []);

    //RECUPERATION DES POSTES

    const [postes, setPostes] = useState([]);
    const fetchpostes = async (e) => {
        setLoading(true);
        try {
            const response = await axios.get(`${StaticIP}api/poste/liste`);
            if (response.data.Status) {
                setPostes(response.data.Result);
            } else {
                setError("Erreur lors de la récupération des postes");
            }
        } catch (err) {
            setError("Une erreur est survenue lors de la récupération des postes");
            console.error(err);
        }
    };
    useEffect(() => {
        fetchpostes(postes);
    }, []);

     //RECUPERATION DES GRILLES SALARIALES

     const [grilles, setGrilles] = useState([]);
     const fetchgrilles = async (e) => {
         setLoading(true);
         try {
             const response = await axios.get(`${StaticIP}api/grillesalariale/liste`);
             if (response.data.Status) {
                 setGrilles(response.data.Result);
             } else {
                 setError("Erreur lors de la récupération des grilles");
             }
         } catch (err) {
             setError("Une erreur est survenue lors de la récupération des grilles");
             console.error(err);
         }
     };
     useEffect(() => {
         fetchgrilles(grilles);
     }, []);

    //Pour la liste des CCC
    const [contrats, setcontrats] = useState([]);
    const [error, setError] = useState(null);
    //PAGINATION DES contratS
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(20);
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = contrats.slice(indexOfFirstRecord, indexOfLastRecord);
    const nPages = Math.ceil(contrats.length / recordsPerPage)
    // Récupération des catégories
    const fetchcontrats = async (e) => {
        setLoading(true);
        try {
            const response = await axios.get(`${StaticIP}api/contrat/liste`);
            if (response.data.Status) {
                setcontrats(response.data.Result);
            } else {
                setError("Erreur lors de la récupération des contrats");
            }
        } catch (err) {
            setError("Une erreur est survenue lors de la récupération des contrats");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchcontrats(currentPage);
    }, [currentPage]);

    const goToPage = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    //FIN LISTE

    //POUR LA SUPPRESSION
    const [showModal, setShowModal] = useState(false);
    const [selectedcontrat, setselectedcontrat] = useState(null);
    const handleDelete = async () => {
        if (!selectedcontrat) return;
        try {
            const response = await axios.delete(`${StaticIP}api/contrat/supprimer/${selectedcontrat.id}`);
            if (response.data.Status) {
                setcontrats(contrats.filter((emp) => emp.id !== selectedcontrat.id));
                setShowModal(false);
                toast.success("Contrat supprimé avec succès !");
            } else {
                alert("Erreur : " + response.data.message);
            }
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
            alert("Une erreur est survenue lors de la suppression.");
        }
    };
    //FIN SUPPRESSION

    //POUR LA RECUPERATION DUN CONTRAT DONNE
    const [showModalContrat, setShowModalContrat] = useState(false);
    const [contratdetail, setContratDetail] = useState([]);
    const handleShowContrat = (id) => {
        setShowModalContrat(true)
        axios.get(`${StaticIP}api/contrat/detail/` +id)
            .then(result => {
                if (result.data.Status) {
                    if (result.data.Status) {
                        setContratDetail(result.data.Result)
                    } else {
                        alert(result.data.Error)
                    }
                }
            })
    }
    //FIN SUPPRESSION

    const { currentUser } = useContext(AuthContext)
    const [userid, setuserId] = useState(null)
    const [loading, setLoading] = useState(false);

    const [datacontrat, setDatacontrat] = useState({
        type_contrat:'', objet_contrat:'', sous_projet:'',
        date_debut_contrat: '', date_fin_contrat: '', nombre_heure: '', sursalaire: '', prime_risque: '', prime_transport: '', mode_paiement: '',
        banque_id: '', numero_compte: '', poste_id: '', grille_id: '',
        userid: null,
        selectedEmployeeId: null,
    })

    // Utilisez useEffect pour définir l'ID utilisateur une seule fois
    useEffect(() => {
        if (currentUser) {
            setuserId(currentUser.id);
            setDatacontrat((prev) => ({ ...prev, userid: currentUser.id }));
        }
    }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('userid', datacontrat.userid);
        formData.append('selectedEmployeeId', selectedEmployeeId);
        formData.append('type_contrat', datacontrat.type_contrat); formData.append('objet_contrat', datacontrat.objet_contrat);
        formData.append('sous_projet', datacontrat.sous_projet); formData.append('date_debut_contrat', datacontrat.date_debut_contrat); formData.append('date_fin_contrat', datacontrat.date_fin_contrat);
        formData.append('nombre_heure', datacontrat.nombre_heure); formData.append('sursalaire', datacontrat.sursalaire); formData.append('prime_risque', datacontrat.prime_risque);
        formData.append('prime_transport', datacontrat.prime_transport); formData.append('mode_paiement', datacontrat.mode_paiement); formData.append('banque_id', datacontrat.banque_id);
        formData.append('numero_compte', datacontrat.numero_compte); formData.append('poste_id', datacontrat.poste_id); formData.append('grille_id', datacontrat.grille_id);

        /*for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }*/
        //if (logo_Boutique) formData.append('logo_Boutique', logo_Boutique);

        setLoading(true);
        try {
            const response = await axios.post('${StaticIP}api/contrat/nouveau', formData, selectedEmployeeId );
            console.log('la réggg :', response.data)
            if (response.data.Status) {
                toast.success('Contrat crée avec succès !');
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
                toast.error(err.response.data.message || 'Erreur lors de la création de l\'Contrat');
            } else {
                console.log(err)
                toast.error('Une erreur est survenue');
            }
        }
    };
    return (
        <Layout>
            <BreadCrumb titre="Contrats" />
            <div className="row g-3 mb-3">
                <div className="col-xl-12 col-lg-12">
                    <div className="sticky-lg-top">
                        <div className="card mb-3">
                            <CardTitle title="Nouveau" />
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3 align-items-center">
                                        <div className="col-md-4">
                                            <label className="form-label">Employé <font color="red">*</font></label>
                                            <input type="text" class="form-control"
                                                value={selectedEmployeeName}
                                                onClick={() => setShowModalEmp(true)}
                                                placeholder="Cliquez pour sélectionner un employé"
                                                readOnly
                                            />
                                        </div>
                                        <div className="col-md-2" hidden>
                                            <label className="form-label">Employé <font color="red">*</font></label>
                                            <input type="text" class="form-control"
                                                placeholder="L'ID sélectionné s'affichera ici"
                                                value={selectedEmployeeId}
                                                readOnly
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <label className="form-label">Type de contrat</label>
                                            <select class="form-control"
                                                name="type_contrat"
                                                onChange={(e) => setDatacontrat({ ...datacontrat, type_contrat: e.target.value })}
                                            >
                                                <option value=""> Sélectionner</option>
                                                <option value="Stage"> Stage</option>
                                                <option value="CDD"> CDD</option>
                                                <option value="CDI"> CDI</option>

                                            </select>
                                        </div>
                                        <div className="col-md-2">
                                            <label className="form-label">Objet du contrat <font color="red">*</font> </label>
                                            <input type="text" class="form-control"
                                                name="objet_contrat"
                                                onChange={(e) => setDatacontrat({ ...datacontrat, objet_contrat: e.target.value })}

                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <label className="form-label">Sous projet<font color="red">*</font> </label>
                                            <input type="text" class="form-control"
                                                name="sous_projet"
                                                onChange={(e) => setDatacontrat({ ...datacontrat, sous_projet: e.target.value })}

                                            />
                                        </div>
                                        <div className="col-md-2">
                                        <label className="form-label">Poste occupé</label>
                                        <select class="form-control"
                                            name="poste_id"
                                            onChange={(e) => setDatacontrat({ ...datacontrat, poste_id : e.target.value })}
                                        >
                                            <option value=""> Sélectionner</option>
                                            {postes.map((poste, index) => (
                                            <option value={poste.id} key={poste.id}> {poste.libelle_poste} </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Grille salariale</label>
                                        <select class="form-control"
                                            name="grille_id"
                                            onChange={(e) => setDatacontrat({ ...datacontrat, grille_id : e.target.value })}
                                        >
                                            <option value=""> Sélectionner</option>
                                            {grilles.map((grille, index) => (
                                            <option value={grille.id} key={grille.id}> {grille.libelle_categorie_employe} | {grille.salaire_grille} </option>
                                            ))}
                                        </select>
                                    </div>
                                        <div className="col-md-2">
                                            <label className="form-label">Date début contrat </label>
                                            <input type="date" class="form-control"
                                                name="date_debut_contrat"
                                                onChange={(e) => setDatacontrat({ ...datacontrat, date_debut_contrat: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <label className="form-label">Date fin contrat </label>
                                            <input type="date" class="form-control"
                                                name="date_fin_contrat"
                                                onChange={(e) => setDatacontrat({ ...datacontrat, date_fin_contrat: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Sursalaire </label>
                                            <input type="number" class="form-control"
                                                name="sursalaire"
                                                onChange={(e) => setDatacontrat({ ...datacontrat, sursalaire: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <label className="form-label">Nombre d'heure/sem </label>
                                            <input type="number" class="form-control"
                                                name="nombre_heure"
                                                onChange={(e) => setDatacontrat({ ...datacontrat, nombre_heure: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <label className="form-label">Prime risque </label>
                                            <input type="number" class="form-control"
                                                name="prime_risque"
                                                onChange={(e) => setDatacontrat({ ...datacontrat, prime_risque: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <label className="form-label">Prime transport </label>
                                            <input type="number" class="form-control"
                                                name="prime_transport"
                                                onChange={(e) => setDatacontrat({ ...datacontrat, prime_transport: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <label className="form-label">Mode de paiement</label>
                                            <select class="form-control"
                                                name="mode_paiement"
                                                onChange={(e) => setDatacontrat({ ...datacontrat, mode_paiement: e.target.value })}
                                            >
                                                <option value=""> Sélectionner</option>
                                                <option value="Virement"> Virement</option>
                                                <option value="Espèce"> Espèce</option>

                                            </select>
                                        </div>
                                        <div className="col-md-2">
                                        <label className="form-label">Banque</label>
                                        <select class="form-control"
                                            name="banque_id"
                                            onChange={(e) => setDatacontrat({ ...datacontrat, banque_id : e.target.value })}
                                        >
                                            <option value=""> Sélectionner</option>
                                            {banques.map((banque, index) => (
                                            <option value={banque.id} key={banque.id}> {banque.nom_banque} </option>
                                            ))}
                                        </select>
                                    </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Numero de compte </label>
                                            <input type="text" class="form-control"
                                                name="numero_compte"
                                                onChange={(e) => setDatacontrat({ ...datacontrat, numero_compte: e.target.value })}
                                                placeholder=""
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

                <div class="col-xl-12 col-lg-12">
                    <div class="card">
                        <CardTitle title="Liste" />
                        <div class="card-body">
                            {contrats.length === 0 ? (
                                <p>Aucun Contrat trouvé.</p>
                            ) : (
                                <>
                                    <table id="myDataTable" class="table table-hover align-middle mb-0" style={{ width: '100%' }}>
                                        <thead>
                                            <tr>
                                                <th>N°</th>
                                                <th>Nom de l&apos;employé</th>
                                                <th>Type de contrat</th>
                                                <th>Date début</th>
                                                <th>Date fin</th>
                                                <th>Durée</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentRecords.map((contrat, index) => (
                                                <tr key={contrat.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{contrat.employe_data}</td>
                                                    <td>{contrat.type_contrat}</td>
                                                    <td>
                                                    {
                                                        new Date(contrat.date_debut_contrat).toLocaleString('fr', {
                                                            month: 'long',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                        })
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        new Date(contrat.date_fin_contrat).toLocaleString('fr', {
                                                            month: 'long',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                        })
                                                    }
                                                </td>
                                                <td>{contrat.duree_contrat} mois</td>
                                                    <td>
                                                        <button className="btn btn-outline-info btn-sm">
                                                            <i className='icofont-edit'></i>
                                                        </button>
                                                        <button className="btn btn-outline-danger btn-sm"
                                                            title="Supprimer"
                                                            onClick={() => {
                                                                setselectedcontrat(contrat);
                                                                setShowModal(true);
                                                            }}>
                                                            <i className='icofont-trash'></i>
                                                        </button>

                                                        <button className="btn btn-outline-info btn-sm"
                                                            title="Détails"
                                                            onClick={() => handleShowContrat(contrat.id)}>
                                                            <i className='icofont-eye'></i>j
                                                        </button>

                                                        
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
                                    <Modal.Title>Confirmation</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    Êtes-vous sûr de vouloir supprimer le contrat de : <strong>{selectedcontrat?.employe_data}</strong> ?
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
                {loading && (
                    <div className="overlay">
                        <div className="loader"></div>
                    </div>
                )}

                <Modal show={showModalEmp} onHide={() => setShowModalEmp(false)} size="">
                    <Modal.Header closeButton>
                        <Modal.Title>Rechercher le nom d'un employé</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* Barre de recherche */}
                        <Form.Group controlId="searchEmployee">
                            <Form.Control
                                type="text"
                                placeholder="Saisir une partie du nom ou prénoms..."
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </Form.Group>

                        {/* Tableau des employés */}
                        <Table striped bordered hover className="mt-3">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nom</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmployees.map((employee) => (
                                    <tr
                                        key={employee.id}
                                        onClick={() => selectEmployee(employee)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <td>{employee.id}</td>
                                        <td>{employee.employe_data}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => setShowModalEmp(false)}>
                            Fermer
                        </Button>
                    </Modal.Footer>
                </Modal>
                
                <Modal show={showModalContrat} size="xl" tabIndex='-1'>
                        <Modal.Body key={contratdetail.id} scrollable>
                            <p>
                                {contratdetail.type_contrat}
                            </p>
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="danger" onClick={() => setShowModalContrat(false)}>
                            Fermer
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </Layout>
    )
}

export default Contrat