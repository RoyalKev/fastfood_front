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

const Poste = () => {

    const router = useRouter();

    //Pour la liste des grilles
    const [categories, setCategories] = useState([]);
    const [departements, setDepartements] = useState([]);
    const [postes, setPoste] = useState([]);
    const [error, setError] = useState(null);
    //PAGINATION DES GRILLES
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(5);
    const indexOfLastRecord = currentPage * recordsPerPage;
   const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
   const currentRecords = postes.slice(indexOfFirstRecord, indexOfLastRecord);
   const nPages = Math.ceil(postes.length / recordsPerPage)
    // Récupération des catégories
    const fetchCategories = async (e) => {
        setLoading(true);
        try {
            const response = await axios.get(`${StaticIP}api/categorieemploye/liste`);
            if (response.data.Status) {
                setCategories(response.data.Result);
            } else {
                setError("Erreur lors de la récupération des catégories");
            }
        } catch (err) {
            setError("Une erreur est survenue lors de la récupération des catégories");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchCategories(categories);
    }, []);

    //RECUPERATION DES DEPARTEMENTS

    // Récupération des catégories
    const fetchdepartements = async (e) => {
        setLoading(true);
        try {
            const response = await axios.get(`${StaticIP}api/departement/liste`);
            if (response.data.Status) {
                setDepartements(response.data.Result);
            } else {
                setError("Erreur lors de la récupération des niveaux");
            }
        } catch (err) {
            setError("Une erreur est survenue lors de la récupération des departements");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchdepartements(departements);
    }, []);

    // Récupération des grilles avec pagination
    const fetchpostes = async (e) => {
        //setLoading(true);
        try {
            const response = await axios.get(`${StaticIP}api/poste/liste`);
            if (response.data.Status) {
                console.log(response.data.Result)
                setPoste(response.data.Result);
            } else {
                setError("Erreur lors de la récupération des postes");
            }
        } catch (err) {
            setError("Une erreur est survenue lors de la récupération des postes");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchpostes(currentPage);
    }, [currentPage]);

    const goToPage = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    //FIN LISTE

    //POUR LA SUPPRESSION
    const [showModal, setShowModal] = useState(false);
    const [selectedPoste, setselectedPoste] = useState(null);
    const handleDelete = async () => {
        if (!selectedPoste) return;
        try {
            const response = await axios.delete(`${StaticIP}api/poste/supprimer/${selectedPoste.id}`);
            if (response.data.Status) {
                setPoste(postes.filter((poste) => poste.id !== selectedPoste.id));
                setShowModal(false);
                toast.success("Poste supprimée avec succès !");
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

    const [dataPoste, setDataPoste] = useState({
        libelle: '',
        categorie_id: '',
        departement_id: '',
        userid: null,
    })

    // Utilisez useEffect pour définir l'ID utilisateur une seule fois
    useEffect(() => {
        if (currentUser) {
            setuserId(currentUser.id);
            setDataPoste((prev) => ({ ...prev, userid: currentUser.id }));
        }
    }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('userid', dataPoste.userid);
        formData.append('categorie_id', dataPoste.categorie_id);
        formData.append('departement_id', dataPoste.departement_id);
        formData.append('libelle', dataPoste.libelle);
        /*for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }*/
        //if (logo_Boutique) formData.append('logo_Boutique', logo_Boutique);

        setLoading(true);
        try {
            const response = await axios.post('${StaticIP}api/poste/nouveau', formData);
            console.log('la réggg :', response.data)
            if (response.data.Status) {
                toast.success('Poste crée avec succès !');
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
                toast.error(err.response.data.message || 'Erreur lors de la du poste');
            } else {
                console.log(err)
                toast.error('Une erreur est survenue');
            }
        }
    };
    return (
        <Layout>
            <BreadCrumb titre="Postes" />
            <div className="row g-3 mb-3">
                <div className="col-xl-4 col-lg-4">
                    <div className="sticky-lg-top">
                        <div className="card mb-3">
                            <CardTitle title="Nouveau" />
                            <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3 align-items-center">
                                <div className="col-md-12">
                                        <label className="form-label">Nom du poste</label>
                                        <input type="text" class="form-control"
                                            name="libelle"
                                            onChange={(e) => setDataPoste({ ...dataPoste, libelle: e.target.value })}
                                            placeholder="Saisir le nom du poste"
                                        />
                                    </div>
                                <div className="col-md-12">
                                        <label className="form-label">Catégorie d&apos;appartenace</label>
                                        <select class="form-control"
                                            name="categorie_id"
                                            onChange={(e) => setDataPoste({ ...dataPoste, categorie_id: e.target.value })}
                                        >
                                            <option value=""> Sélectionner</option>
                                            {categories.map((cat, index) => (
                                            <option value={cat.id} key={cat.id}> {cat.code_categorie_employe} {cat.libelle_categorie_employe}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="form-label">Département</label>
                                        <select class="form-control"
                                            name="departement_id"
                                            onChange={(e) => setDataPoste({ ...dataPoste, departement_id : e.target.value })}
                                        >
                                            <option value=""> Sélectionner</option>
                                            {departements.map((dep, index) => (
                                            <option value={dep.id} key={dep.id}> {dep.nom_departement} </option>
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

                <div class="col-xl-8 col-lg-8">
                    <div class="card">
                    <CardTitle title="Liste" />
                        <div class="card-body">
                                        {postes.length === 0 ? (
                                                <p>Aucun poste trouvé.</p>
                                            ) : (
                                                <>
                                            <table id="myDataTable" class="table table-hover align-middle mb-0" style={{ width:'100%'}}>
                                                <thead>
                                                    <tr>
                                                        <th>N°</th>
                                                        <th>Nom</th>
                                                        <th>Categorie</th>
                                                        <th>Département</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {currentRecords.map((poste, index) => (
                                                    <tr key={poste.id}>
                                                        <td>{index +1}</td>
                                                        <td>{poste.libelle_poste}</td>
                                                        <td>{poste.code_categorie_employe} {poste.libelle_categorie_employe}</td>
                                                        <td>{poste.nom_departement}</td>
                                                       
                                                        <td>
                                                            <button className="btn btn-outline-info btn-sm">
                                                                <i className='icofont-edit'></i>
                                                            </button>
                                                            <button className="btn btn-outline-danger btn-sm"
                                                                title="Supprimer"
                                                                onClick={() => {
                                                                    setselectedPoste(poste);
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
                                                    Êtes-vous sûr de vouloir supprimer le poste  : <strong>{selectedPoste?.libelle_poste}</strong> ? 
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

export default Poste