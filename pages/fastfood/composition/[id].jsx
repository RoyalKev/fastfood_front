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
import LayoutFastfood from '@/components/LayoutFastfood';

const Composition = () => {
    const router = useRouter();
    const { id } = router.query; // Récupère l'id passé en paramètre
    const { currentUser } = useContext(AuthContext)
    const [userid, setuserId] = useState(null)
    const [loading, setLoading] = useState(false);
    const [showModalProduit, setShowModalProduit] = useState(false);
    const [produits, setproduits] = useState([]);
    const fetchproduits = async (e) => {
        //setLoading(true);
        try {
            const response = await axios.get(`${StaticIP}api/produit/liste`);
            if (response.data.Status) {
                setproduits(response.data.Result);
            } else {
                alert("Erreur lors de la récupération des produits");
            }
        } catch (err) {
            alert("Une erreur est survenue lors de la récupération des produits");
            console.error(err);
        }
    };
    useEffect(() => {
        fetchproduits(produits);
    }, []);

    const [filteredProduits, setFilteredProduits] = useState(produits);
    const [selectedProduitName, setSelectedProduitName] = useState('');
    const [selectedProduitId, setSelectedProduitId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setSearchTerm(searchValue);
        setFilteredProduits(
            produits.filter((produit) =>
                produit.designation.toLowerCase().includes(searchValue)
            )
        );
    };

    const selectProduit = (produit) => {
        setSelectedProduitName(produit.designation);
        setSelectedProduitId(produit.id);
        setShowModalProduit(false);
    };

    useEffect(() => {
        if (currentUser) {
            setuserId(currentUser.id);
            setdatacompo((prev) => ({ ...prev, userid: currentUser.id, produit_converti_id: id }));
        }
    }, [currentUser, id]);

    const [datacompo, setdatacompo] = useState({
        produit_converti_id: id,
        selectedProduitId: null,
        quantite: '',
        userid: null,
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('userid', datacompo.userid);
        formData.append('produit_converti_id', datacompo.produit_converti_id);
        formData.append('selectedProduitId', selectedProduitId);
        formData.append('quantite', datacompo.quantite);
        setLoading(true);
        try {
            const response = await axios.post(`${StaticIP}api/composition/nouveau`, formData, selectedProduitId);
            console.log('la réggg :', response.data)
            if (response.data.Status) {
                toast.success('Ligne créée avec succès !');
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
                toast.error(err.response.data.message || 'Erreur lors de la création de la ligne');
            } else {
                console.log(err)
                toast.error('Une erreur est survenue');
            }
        }
    };

    const [lignes, setlignes] = useState([]);

    const fetchlignes = async () => {
        if (!id) return; // On ne fait rien si l'id n'est pas défini
      
        setLoading(true);
        try {
          const response = await axios.get(`${StaticIP}api/composition/lignes?id=${id}`);
          if (response.data.Status) {
            setlignes(Array.isArray(response.data.Result) ? response.data.Result : []);
          } else {
            alert("Erreur lors de la récupération des lignes.");
          }
        } catch (err) {
          alert("Une erreur est survenue lors de la récupération des lignes.");
          console.error("Erreur lors de la requête :", err);
        } finally {
          setLoading(false);
        }
      };

      useEffect(() => {
        if (id) { // Vérifiez que l'id est bien défini
          fetchlignes();
        }
      }, [id]);


    //POUR LA SUPPRESSION
    const [showModal, setShowModal] = useState(false);
    const [selectedcompo, setselectedcompo] = useState(null);
    const handleDelete = async () => {
        if (!selectedcompo) return;
        try {
            const response = await axios.delete(`${StaticIP}api/composition/supprimer/${selectedcompo.id}`);
            if (response.data.Status) {
                setlignes(lignes.filter((comp) => comp.id !== selectedcompo.id));
                setShowModal(false);
                toast.success("Composition supprimée avec succès !");
            } else {
                alert("Erreur : " + response.data.message);
            }
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
            alert("Une erreur est survenue lors de la suppression.");
        }
    };
    //FIN SUPPRESSION

    return (
        <LayoutFastfood>
            <BreadCrumb titre="Compositions" />
            <div className="row g-3 mb-3">
                <div className="col-xl-6 col-lg-6">
                    <div className="sticky-lg-top">
                        <div className="card mb-3">
                            <CardTitle title="Nouveau" />
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3 align-items-center">
                                        <div className="col-md-8">
                                            <label className="form-label">Produit <font color="red">*</font></label>
                                            <input type="text" class="form-control"
                                                value={selectedProduitName}
                                                onClick={() => setShowModalProduit(true)}
                                                placeholder="Cliquez pour sélectionner un produit"
                                                readOnly
                                            />
                                        </div>
                                        <div className="col-md-2" hidden>
                                            <label className="form-label">Produit ID <font color="red">*</font></label>
                                            <input type="text" class="form-control"
                                                placeholder="L'ID sélectionné s'affichera ici"
                                                value={selectedProduitId}
                                                readOnly
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Qté utilisée <font color="red">*</font> </label>
                                            <input type="text" class="form-control"
                                                name="quantite"
                                                onChange={(e) => setdatacompo({ ...datacompo, quantite: e.target.value })}
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
                </div>
                <div class="col-xl-6 col-lg-6">
                    <div class="card">
                        <CardTitle title="Composition" />
                        <div class="card-body">
                            {lignes.length === 0 ? (
                                <p>Aucune ligne trouvée.</p>
                                    ) : (
                                <>
                                    <table id="myDataTable" class="table table-hover align-middle mb-0" style={{ width: '100%' }}>
                                        <thead>
                                            <tr>
                                                <th>N°</th>
                                                <th>Désignation</th>
                                                <th>Quantité</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {lignes.map((compo, index) => (
                                                <tr key={compo.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{compo.designation}</td>
                                                    <td>{compo.quantite}</td>
                                                    <td>
                                                    <button className="btn btn-outline-danger btn-sm"
                                                        title="Supprimer"
                                                        onClick={() => {
                                                            setselectedcompo(compo);
                                                            setShowModal(true);
                                                        }}>
                                                        <i className='icofont-trash'></i>
                                                    </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </>
                            )}
                        </div>
                        {/* Modal de confirmation */}
                        <Modal show={showModal} onHide={() => setShowModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Confirmation</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Êtes-vous sûr de vouloir supprimer ce produit de la composition ?
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
                {loading && (
                    <div className="overlay">
                        <div className="loader"></div>
                    </div>
                )}
                <ToastContainer />

                <Modal show={showModalProduit} onHide={() => setShowModalProduit(false)} size="">
                    <Modal.Header closeButton>
                        <Modal.Title>Rechercher la désignation d'un produit</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* Barre de recherche */}
                        <Form.Group controlId="searchPro">
                            <Form.Control
                                type="text"
                                placeholder="Saisir une partie de la désignation..."
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </Form.Group>

                        {/* Tableau des employés */}
                        <Table striped bordered hover className="mt-3">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Désignation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProduits.map((produit) => (
                                    <tr
                                        key={produit.id}
                                        onClick={() => selectProduit(produit)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <td>{produit.id}</td>
                                        <td>{produit.designation}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => setShowModalProduit(false)}>
                            Fermer
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </LayoutFastfood>
    )
}

export default Composition