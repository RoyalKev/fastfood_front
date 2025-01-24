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

const GrilleSalariale = () => {

    const router = useRouter();

    //Pour la liste des grilles
    const [categories, setCategories] = useState([]);
    const [niveaux, setniveaux] = useState([]);
    const [grilles, setgrilles] = useState([]);
    const [error, setError] = useState(null);
    //PAGINATION DES GRILLES
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(5);
    const indexOfLastRecord = currentPage * recordsPerPage;
   const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
   const currentRecords = grilles.slice(indexOfFirstRecord, indexOfLastRecord);
   const nPages = Math.ceil(grilles.length / recordsPerPage)
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

    //RECUPERATION DES NIVEAUX

    // Récupération des catégories
    const fetchniveaux = async (e) => {
        setLoading(true);
        try {
            const response = await axios.get(`${StaticIP}api/niveau/liste`);
            if (response.data.Status) {
                setniveaux(response.data.Result);
            } else {
                setError("Erreur lors de la récupération des niveaux");
            }
        } catch (err) {
            setError("Une erreur est survenue lors de la récupération des niveaux");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchniveaux(niveaux);
    }, []);

    // Récupération des grilles avec pagination
    const fetchgrilles = async (e) => {
        //setLoading(true);
        try {
            const response = await axios.get(`${StaticIP}api/grillesalariale/liste`);
            if (response.data.Status) {
                console.log(response.data.Result)
                setgrilles(response.data.Result);
            } else {
                setError("Erreur lors de la récupération des grilles");
            }
        } catch (err) {
            setError("Une erreur est survenue lors de la récupération des grilles");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchgrilles(currentPage);
    }, [currentPage]);

    const goToPage = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    //FIN LISTE

    //POUR LA SUPPRESSION
    const [showModal, setShowModal] = useState(false);
    const [selectedGrille, setselectedGrille] = useState(null);
    const handleDelete = async () => {
        if (!selectedGrille) return;
        try {
            const response = await axios.delete(`${StaticIP}api/grillesalariale/supprimer/${selectedGrille.id}`);
            if (response.data.Status) {
                setgrilles(grilles.filter((gril) => gril.id !== selectedGrille.id));
                setShowModal(false);
                toast.success("Grille supprimée avec succès !");
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

    const [dataGrille, setDataGrille] = useState({
        categorie_id: '',
        niveau_id: '',
        salaire: '',
        userid: null,
    })

    // Utilisez useEffect pour définir l'ID utilisateur une seule fois
    useEffect(() => {
        if (currentUser) {
            setuserId(currentUser.id);
            setDataGrille((prev) => ({ ...prev, userid: currentUser.id }));
        }
    }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('userid', dataGrille.userid);
        formData.append('categorie_id', dataGrille.categorie_id);
        formData.append('niveau_id', dataGrille.niveau_id);
        formData.append('salaire', dataGrille.salaire);
        /*for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }*/
        //if (logo_Boutique) formData.append('logo_Boutique', logo_Boutique);

        setLoading(true);
        try {
            const response = await axios.post('${StaticIP}api/grillesalariale/nouveau', formData);
            console.log('la réggg :', response.data)
            if (response.data.Status) {
                toast.success('Grille créée avec succès !');
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
                toast.error(err.response.data.message || 'Erreur lors de la création de la grille');
            } else {
                console.log(err)
                toast.error('Une erreur est survenue');
            }
        }
    };
    return (
        <Layout>
            <BreadCrumb titre="Grille salariale" />
            <div className="row g-3 mb-3">
                <div className="col-xl-4 col-lg-4">
                    <div className="sticky-lg-top">
                        <div className="card mb-3">
                            <CardTitle title="Nouveau" />
                            <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3 align-items-center">
                                <div className="col-md-12">
                                        <label className="form-label">Catégorie de la grille</label>
                                        <select class="form-control"
                                            name="categorie_id"
                                            onChange={(e) => setDataGrille({ ...dataGrille, categorie_id: e.target.value })}
                                        >
                                            <option value=""> Sélectionner</option>
                                            {categories.map((cat, index) => (
                                            <option value={cat.id} key={cat.id}> {cat.code_categorie_employe} {cat.libelle_categorie_employe}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="form-label">Niveau de la grille</label>
                                        <select class="form-control"
                                            name="niveau_id"
                                            onChange={(e) => setDataGrille({ ...dataGrille, niveau_id: e.target.value })}
                                        >
                                            <option value=""> Sélectionner</option>
                                            {niveaux.map((niveau, index) => (
                                            <option value={niveau.id} key={niveau.id}> {niveau.libelle_niveau} </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="form-label">Salaire de la grille</label>
                                        <input type="text" class="form-control"
                                            name="salaire"
                                            onChange={(e) => setDataGrille({ ...dataGrille, salaire: e.target.value })}
                                            placeholder="Saisir le salaire de la grille"
                                        />
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
                                        {grilles.length === 0 ? (
                                                <p>Aucune grille salariale trouvée.</p>
                                            ) : (
                                                <>
                                            <table id="myDataTable" class="table table-hover align-middle mb-0" style={{ width:'100%'}}>
                                                <thead>
                                                    <tr>
                                                        <th>N°</th>
                                                        <th>Categorie</th>
                                                        <th>Niveau</th>
                                                        <th>Salaire</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {currentRecords.map((grille, index) => (
                                                    <tr key={grille.id}>
                                                        <td>{index +1}</td>
                                                        <td>{grille.code_categorie_employe} {grille.libelle_categorie_employe}</td>
                                                        <td>{grille.libelle_niveau}</td>
                                                        <td>{grille.salaire_grille}</td>
                                                        <td>
                                                            <button className="btn btn-outline-info btn-sm">
                                                                <i className='icofont-edit'></i>
                                                            </button>
                                                            <button className="btn btn-outline-danger btn-sm"
                                                                title="Supprimer"
                                                                onClick={() => {
                                                                    setselectedGrille(grille);
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
                                                    Êtes-vous sûr de vouloir supprimer la grille 
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

export default GrilleSalariale