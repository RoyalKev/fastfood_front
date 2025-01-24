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

const CategorieEmploye = () => {

    const router = useRouter();

    //Pour la liste des categories
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Récupération des catégories avec pagination
    const fetchCategories = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get(`${StaticIP}api/categorieemploye/liste?page=${page}&limit=5`);
            if (response.data.Status) {
                setCategories(response.data.Result);
                setTotalPages(response.data.Pagination.totalPages);
                setCurrentPage(response.data.Pagination.currentPage);
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
        fetchCategories(currentPage);
    }, [currentPage]);

    const goToPage = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    //FIN LISTE

    //POUR LA SUPPRESSION
    const [showModal, setShowModal] = useState(false);
    const [selectedCategorie, setSelectedCategorie] = useState(null);
    const handleDelete = async () => {
        if (!selectedCategorie) return;
        try {
            const response = await axios.delete(`${StaticIP}api/categorieemploye/supprimer/${selectedCategorie.id}`);
            if (response.data.Status) {
                setCategories(categories.filter((cat) => cat.id !== selectedCategorie.id));
                setShowModal(false);
                toast.success("Catégorie supprimée avec succès !");
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

    const [datacategorie, setDatacategorie] = useState({
        code: '',
        libelle: '',
        userid: null,
    })

    // Utilisez useEffect pour définir l'ID utilisateur une seule fois
    useEffect(() => {
        if (currentUser) {
            setuserId(currentUser.id);
            setDatacategorie((prev) => ({ ...prev, userid: currentUser.id }));
        }
    }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('userid', datacategorie.userid);
        formData.append('code', datacategorie.code);
        formData.append('libelle', datacategorie.libelle);
        /*for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }*/
        //if (logo_Boutique) formData.append('logo_Boutique', logo_Boutique);

        setLoading(true);
        try {
            const response = await axios.post('${StaticIP}api/categorieemploye/nouveau', formData);
            console.log('la réggg :', response.data)
            if (response.data.Status) {
                toast.success('Catégorie créée avec succès !');
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
                toast.error(err.response.data.message || 'Erreur lors de la création de la catégorie');
            } else {
                console.log(err)
                toast.error('Une erreur est survenue');
            }
        }
    };
    return (
        <Layout>
            <BreadCrumb titre="Catégories des employés" />
            <div className="row g-3 mb-3">
                <div className="col-xl-4 col-lg-4">
                    <div className="sticky-lg-top">
                        <div className="card mb-3">
                            <CardTitle title="Nouveau" />
                            <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3 align-items-center">
                                    <div className="col-md-12">
                                        <label className="form-label">Code</label>
                                        <input type="text" class="form-control"
                                            name="code"
                                            onChange={(e) => setDatacategorie({ ...datacategorie, code: e.target.value })}
                                            placeholder="Saisir le code de la catégorie"
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <label className="form-label">Libellé</label>
                                        <input type="text" class="form-control"
                                            name="libelle"
                                            onChange={(e) => setDatacategorie({ ...datacategorie, libelle: e.target.value })}
                                            placeholder="Saisir le libellé de la catégorie"
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
                                        {categories.length === 0 ? (
                                                <p>Aucune catégorie trouvée.</p>
                                            ) : (
                                                <>
                                            <table id="myDataTable" class="table table-hover align-middle mb-0" style={{ width:'100%'}}>
                                                <thead>
                                                    <tr>
                                                        <th>N°</th>
                                                        <th>Code</th>
                                                        <th>Libellé</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {categories.map((categorie, index) => (
                                                    <tr key={categorie.id}>
                                                        <td>{index +1}</td>
                                                        <td>{categorie.code_categorie_employe}</td>
                                                        <td>{categorie.libelle_categorie_employe}</td>
                                                        <td>
                                                            <button className="btn btn-outline-info btn-sm">
                                                                <i className='icofont-edit'></i>
                                                            </button>
                                                            <button className="btn btn-outline-danger btn-sm"
                                                                title="Supprimer"
                                                                onClick={() => {
                                                                    setSelectedCategorie(categorie);
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
                                                    Êtes-vous sûr de vouloir supprimer la catégorie : <strong>{selectedCategorie?.libelle_categorie_employe}</strong> ?
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

export default CategorieEmploye