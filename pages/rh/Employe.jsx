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
import { StaticIP } from '@/config/staticip';

const Employe = () => {

    const router = useRouter();

    //Pour la liste des CCC
    const [employes, setEmployes] = useState([]);
    const [error, setError] = useState(null);
    //PAGINATION DES EMPLOYES
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(5);
    const indexOfLastRecord = currentPage * recordsPerPage;
   const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
   const currentRecords = employes.slice(indexOfFirstRecord, indexOfLastRecord);
   const nPages = Math.ceil(employes.length / recordsPerPage)
    // Récupération des catégories
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
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchemployes(currentPage);
    }, [currentPage]);

    const goToPage = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    //FIN LISTE

    //POUR LA SUPPRESSION
    const [showModal, setShowModal] = useState(false);
    const [selectedEmploye, setselectedEmploye] = useState(null);
    const handleDelete = async () => {
        if (!selectedEmploye) return;
        try {
            const response = await axios.delete(`${StaticIP}api/employe/supprimer/${selectedEmploye.id}`);
            if (response.data.Status) {
                setEmployes(employes.filter((emp) => emp.id !== selectedEmploye.id));
                setShowModal(false);
                toast.success("Employé supprimé avec succès !");
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

    const [dataEmploye, setDataEmploye] = useState({
        nom: '',
        prenoms: '', date_de_naissance: '', lieu_de_naissance: '', sexe: '', situation_matrimoniale: '', diplome_obtenu: '', nombre_emploi_deja: '',
        telephone_employe: '', email_employe: '', nationalite_employe: '', ville_residence: '', adresse_residence: '', numero_carte: '', lieu_etablissement_carte: '',
        date_edition_carte: '', date_expiration_carte: '', numero_cnss: '', nombre_enfant: '', nom_pere_employe: '', nom_mere_employe: '',
        userid: null,
    })

    // Utilisez useEffect pour définir l'ID utilisateur une seule fois
    useEffect(() => {
        if (currentUser) {
            setuserId(currentUser.id);
            setDataEmploye((prev) => ({ ...prev, userid: currentUser.id }));
        }
    }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('userid', dataEmploye.userid);
        formData.append('nom', dataEmploye.nom);formData.append('prenoms', dataEmploye.prenoms);formData.append('date_de_naissance', dataEmploye.date_de_naissance);
        formData.append('lieu_de_naissance', dataEmploye.lieu_de_naissance);formData.append('sexe', dataEmploye.sexe);formData.append('situation_matrimoniale', dataEmploye.situation_matrimoniale);
        formData.append('diplome_obtenu', dataEmploye.diplome_obtenu);formData.append('nombre_emploi_deja', dataEmploye.nombre_emploi_deja);formData.append('telephone_employe', dataEmploye.telephone_employe);
        formData.append('email_employe', dataEmploye.email_employe);formData.append('nationalite_employe', dataEmploye.nationalite_employe);formData.append('ville_residence', dataEmploye.ville_residence);
        formData.append('adresse_residence', dataEmploye.adresse_residence);formData.append('numero_carte', dataEmploye.numero_carte);formData.append('lieu_etablissement_carte', dataEmploye.lieu_etablissement_carte);
        formData.append('date_edition_carte', dataEmploye.date_edition_carte);formData.append('date_expiration_carte', dataEmploye.date_expiration_carte);formData.append('numero_cnss', dataEmploye.numero_cnss);
        formData.append('nombre_enfant', dataEmploye.nombre_enfant);formData.append('nom_pere_employe', dataEmploye.nom_pere_employe);formData.append('nom_mere_employe', dataEmploye.nom_mere_employe);
        /*for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }*/
        //if (logo_Boutique) formData.append('logo_Boutique', logo_Boutique);

        setLoading(true);
        try {
            const response = await axios.post('${StaticIP}api/employe/nouveau', formData);
            console.log('la réggg :', response.data)
            if (response.data.Status) {
                toast.success('Employé crée avec succès !');
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
                toast.error(err.response.data.message || 'Erreur lors de la création de l\'employé');
            } else {
                console.log(err)
                toast.error('Une erreur est survenue');
            }
        }
    };
    return (
        <Layout>
            <BreadCrumb titre="Employés" />
            <div className="row g-3 mb-3">
                <div className="col-xl-12 col-lg-12">
                    <div className="sticky-lg-top">
                        <div className="card mb-3">
                            <CardTitle title="Nouveau" />
                            <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3 align-items-center">
                                <div className="col-md-2">
                                        <label className="form-label">Nom <font color="red">*</font></label>
                                        <input type="text" class="form-control"
                                            name="nom"
                                            onChange={(e) => setDataEmploye({ ...dataEmploye, nom: e.target.value })}
                                            placeholder="Saisir le nom de l'employé"
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label">Prénoms <font color="red">*</font> </label>
                                        <input type="text" class="form-control"
                                            name="prenoms"
                                            onChange={(e) => setDataEmploye({ ...dataEmploye, prenoms: e.target.value })}
                                            
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label">Date de naissance </label>
                                        <input type="date" class="form-control"
                                            name="date_de_naissance"
                                            onChange={(e) => setDataEmploye({ ...dataEmploye, date_de_naissance: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label">Lieu de naissance </label>
                                        <input type="text" class="form-control"
                                            name="lieu_de_naissance"
                                            onChange={(e) => setDataEmploye({ ...dataEmploye, lieu_de_naissance: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-1">
                                        <label className="form-label">Sexe</label>
                                        <select class="form-control"
                                            name="sexe"
                                            onChange={(e) => setDataEmploye({ ...dataEmploye, sexe: e.target.value })}
                                        >
                                            <option value=""> Sélectionner</option>
                                            <option value="M"> M</option>
                                            <option value="F"> F</option>
                                            
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Situation matrimoniale</label>
                                        <select class="form-control"
                                            name="situation_matrimoniale"
                                            onChange={(e) => setDataEmploye({ ...dataEmploye, situation_matrimoniale: e.target.value })}
                                        >
                                            <option value=""> Sélectionner</option>
                                            <option value="Célibataire"> Célibataire</option>
                                            <option value="Marié"> Marié.e</option>
                                            <option value="Veuf"> Veuf.ve</option>
                                            
                                        </select>
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label">Diplôme obtenu </label>
                                        <input type="text" class="form-control"
                                            name="diplome_obtenu"
                                            onChange={(e) => setDataEmploye({ ...dataEmploye, diplome_obtenu: e.target.value })}
                                            placeholder="Ex: BAC+3"
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label">Nombre d&apos;emploi </label>
                                        <input type="number" class="form-control"
                                            name="nombre_emploi_deja"
                                            onChange={(e) => setDataEmploye({ ...dataEmploye, nombre_emploi_deja: e.target.value })}
                                        />
                                    </div>
                                    
                                    <div className="col-md-2">
                                        <label className="form-label">Téléphone </label>
                                        <input type="text" class="form-control"
                                            name="telephone_employe"
                                            onChange={(e) => setDataEmploye({ ...dataEmploye, telephone_employe: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label">Email </label>
                                        <input type="text" class="form-control"
                                            name="email_employe"
                                            onChange={(e) => setDataEmploye({ ...dataEmploye, email_employe: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label">Nationalité </label>
                                        <input type="text" class="form-control"
                                            name="nationalite_employe"
                                            onChange={(e) => setDataEmploye({ ...dataEmploye, nationalite_employe: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label">Ville de résidence </label>
                                        <input type="text" class="form-control"
                                            name="ville_residence"
                                            onChange={(e) => setDataEmploye({ ...dataEmploye, ville_residence: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label">Adresse de résidence </label>
                                        <input type="text" class="form-control"
                                            name="adresse_residence"
                                            onChange={(e) => setDataEmploye({ ...dataEmploye, adresse_residence: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label">N°Pièce d&apos;identité </label>
                                        <input type="text" class="form-control"
                                            name="numero_carte"
                                            onChange={(e) => setDataEmploye({ ...dataEmploye, numero_carte: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label">Lieu établiss </label>
                                        <input type="text" class="form-control"
                                            name="lieu_etablissement_carte"
                                            onChange={(e) => setDataEmploye({ ...dataEmploye, lieu_etablissement_carte: e.target.value })}
                                            
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label">Date émission </label>
                                        <input type="date" class="form-control"
                                            name="date_edition_carte"
                                            onChange={(e) => setDataEmploye({ ...dataEmploye, date_edition_carte: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label">Date expiration </label>
                                        <input type="date" class="form-control"
                                            name="date_expiration_carte"
                                            onChange={(e) => setDataEmploye({ ...dataEmploye, date_expiration_carte: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label">N°CNSS </label>
                                        <input type="text" class="form-control"
                                            name="numero_cnss"
                                            onChange={(e) => setDataEmploye({ ...dataEmploye, numero_cnss: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label">Nombre d&apos;enfant </label>
                                        <input type="text" class="form-control"
                                            name="nombre_enfant"
                                            onChange={(e) => setDataEmploye({ ...dataEmploye, nombre_enfant: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Nom du Père </label>
                                        <input type="text" class="form-control"
                                            name="nom_pere_employe"
                                            onChange={(e) => setDataEmploye({ ...dataEmploye, nom_pere_employe: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Nom de la Mère </label>
                                        <input type="text" class="form-control"
                                            name="nom_mere_employe"
                                            onChange={(e) => setDataEmploye({ ...dataEmploye, nom_mere_employe: e.target.value })}
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
                                        {employes.length === 0 ? (
                                                <p>Aucun employé trouvé.</p>
                                            ) : (
                                                <>
                                            <table id="myDataTable" class="table table-hover align-middle mb-0" style={{ width:'100%'}}>
                                                <thead>
                                                    <tr>
                                                        <th>N°</th>
                                                        <th>Nom</th>
                                                        <th>Prénoms</th>
                                                        <th>Sexe</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {currentRecords.map((employe, index) => (
                                                    <tr key={employe.id}>
                                                        <td>{index +1}</td>
                                                        <td>{employe.nom_employe}</td>
                                                        <td>{employe.prenoms_employe}</td>
                                                        <td>{employe.sexe}</td>
                                                        <td>
                                                            <button className="btn btn-outline-info btn-sm">
                                                                <i className='icofont-edit'></i>
                                                            </button>
                                                            <button className="btn btn-outline-danger btn-sm"
                                                                title="Supprimer"
                                                                onClick={() => {
                                                                    setselectedEmploye(employe);
                                                                    setShowModal(true);
                                                                }}>
                                                                <i className='icofont-trash'></i>
                                                            </button>
                                                            
                                                        </td>
                                                    </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <br/>
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
                                                    Êtes-vous sûr de vouloir supprimer l&apos;employé : <strong>{selectedEmploye?.nom_employe}</strong> ?  
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
            </div>


        </Layout>
    )
}

export default Employe