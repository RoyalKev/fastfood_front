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
import LayoutFastfood from '@/components/LayoutFastfood';

const ProduitSeuil = () => {

    const router = useRouter();

    //Pour la liste des produits
    const [produits, setproduits] = useState([]);
    const [categories, setcategories] = useState([]);
    const [unitemesures, setunitemesures] = useState([]);
    const [error, setError] = useState(null);
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Récupération des produits avec pagination
    const fetchproduits = async (e) => {
        setLoading(true);
        try {
            const response = await axios.get(`${StaticIP}api/produit/produits-seuil`);
                setproduits(response.data);
        } catch (err) {
            setError("Une erreur est survenue lors de la récupération des produits");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchproduits(produits);
    }, []);

    const goToPage = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    //POUR LA SUPPRESSION
    const [showModal, setShowModal] = useState(false);
    const [selectedproduit, setselectedproduit] = useState(null);
    const handleDelete = async () => {
        if (!selectedproduit) return;
        try {
            const response = await axios.delete(`${StaticIP}api/produit/supprimer/${selectedproduit.id}`);
            if (response.data.Status) {
                setproduits(produits.filter((categorie) => categorie.id !== selectedproduit.id));
                setShowModal(false);
                toast.success("Produit supprimée avec succès !");
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

    const [image, setImage] = useState(null);

    const [dataproduit, setDataproduit] = useState({
        designation: '',
        unite: '',
        seuil: '',
        stock_bloquant: '',
        puisable_en_portion: '',
        contenance: '',
        userid: null,
    })

    // Utilisez useEffect pour définir l'ID utilisateur une seule fois
    useEffect(() => {
        if (currentUser) {
            setuserId(currentUser.id);
            setDataproduit((prev) => ({ ...prev, userid: currentUser.id }));
        }
    }, [currentUser]);
    
    //POUR LA RECUPERATION DUNE produit
    const [deletedId, setDeletedId] = useState("")
    const [showModalproduit, setShowModalproduit] = useState(false);
    const [produitdetail, setproduitdetail] = useState([]);
    const handleShowproduit = (id) => {
        setShowModalproduit(true)
        axios.get(`${StaticIP}api/produit/detail/` + id)
            .then(result => {
                if (result.data.Status) {
                    if (result.data.Status) {
                        setproduitdetail(result.data.Result)
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
            const response = await axios.put(`${StaticIP}api/produit/executer/` + deletedId, inputs3)
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

    const [showModalmouvement, setshowModalmouvement] = useState(false);
    const [mouvement, setmouvement] = useState([]);
    const handleShowmouvement = (id) => {
        setshowModalmouvement(true)
        axios.get(`${StaticIP}api/produit/mouvement/` + id)
            .then(result => {
                if (result.data.Status) {
                    if (result.data.Status) {
                        setmouvement(result.data.Result)
                    } else {
                        alert(result.data.Error)
                    }
                }
            })
    }

    const [showEditModal, setShowEditModal] = useState(false);
    // Ouvre le modal en passant les infos du produit à modifier
    const openEditModal = (produit) => {
        setDataproduit(produit);
        setShowEditModal(true);
    };

    // Gestion de la modification d'un produit
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
          setLoading(true);
          // Création d'un FormData pour gérer les champs et l'image
          const formData = new FormData();
          formData.append('designation', dataproduit.designation);
          formData.append('unite', dataproduit.unite);
          formData.append('seuil', dataproduit.seuil);
          formData.append('stock_bloquant', dataproduit.stock_bloquant);
          formData.append('puisable_en_portion', dataproduit.puisable_en_portion);
          if (dataproduit.puisable_en_portion === 'Oui') {
            formData.append('contenance', dataproduit.contenance);
          }
          // Si vous utilisez un champ pour l'image dans le modal (optionnel)
          if (dataproduit.imageFile) {
            formData.append('image', dataproduit.imageFile);
          }
          // Ajoutez userid si nécessaire
          if (!dataproduit.userid) {
            console.error("Utilisateur non spécifié !");
            setLoading(false);
            return;
          }
          formData.append('userid', dataproduit.userid);
          // Envoi de la requête PUT vers la route de modification
          const response = await fetch(`${StaticIP}api/produit/modifier/${dataproduit.id}`, {
            method: 'PUT',
            body: formData,
          });
          const result = await response.json();
      
          if (result.Status) {
            // Mise à jour de la liste locale des produits avec le produit modifié
            const updatedProduits = produits.map((p) =>
              p.id === dataproduit.id ? result.Result : p
            );
            setproduits(updatedProduits);
            setShowEditModal(false);
            //toast.success("Modification effectuée avec succès !");
          } else {
            // Affichage d'un message d'erreur si besoin
            console.error(result.message);
          }
        } catch (error) {
          console.error("Erreur lors de la modification du produit :", error);
        } finally {
          setLoading(false);
        }
      };

    //FIN MISE A JOUR
    return (
        <LayoutFastfood>
            <BreadCrumb titre="Produits au seuil de stock" />
            <div className="row g-3 mb-3">
                <div class="col-xl-12 col-lg-12">
                    <div class="card">
                        <CardTitle title="Liste" />
                        <div class="card-body">
                            {produits.length === 0 ? (
                                <p>Aucun produit trouvé.</p>
                            ) : (
                                <>
                                    <table id="myDataTable" class="table table-hover align-middle mb-0" style={{ width: '100%' }}>
                                        <thead>
                                            <tr>
                                                <th>Désignation </th>
                                                <th style={{ textAlign:'center' }}>Seuil </th>
                                                <th style={{ textAlign:'center' }}>Stock </th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {produits.map((produit, index) => {
                                                const contenance = parseInt(produit.contenance) || 1; // Évite la division par zéro
                                                const stock = parseInt(produit.stock) || 0;
                                                const unites = Math.floor(stock / contenance);
                                                const portions = stock % contenance;
                                                const affichageStock = `${unites} unités et ${portions} portions`;

                                                return (
                                                    <tr key={produit.id}>
                                                        <td>{produit.designation}</td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            <span className='badge bg-success'>{produit.seuil}</span>
                                                        </td>
                                                        <td style={{ fontSize: '16px', textAlign: 'center' }}>
                                                            {
                                                                produit.puisable_en_portion == "Oui" &&
                                                                <span className='badge bg-danger'>
                                                                    {affichageStock}
                                                                </span>
                                                            }
                                                            {
                                                                produit.stock_bloquant == "Oui" && produit.puisable_en_portion == "Non" &&
                                                                <span className='badge bg-danger'>
                                                                    {stock.toLocaleString()}
                                                                </span>

                                                            }
                                                        </td>
                                                        {/* Nouvelle colonne pour l'affichage des unités et portions */}
                                                        <td>
                                                            <button
                                                                className="btn btn-outline-info btn-sm"
                                                                onClick={() => openEditModal(produit)}
                                                            >
                                                                <i className='icofont-edit'></i>
                                                            </button>
                                                            <button className="btn btn-outline-warning btn-sm"
                                                                title="Détails"
                                                                onClick={() => handleShowproduit(produit.id)}>
                                                                <i className='icofont-eye' style={{ color: "#cfa108" }}></i>
                                                            </button>
                                                            <button className="btn btn-outline-danger btn-sm"
                                                                title="Supprimer"
                                                                onClick={() => {
                                                                    setselectedproduit(produit);
                                                                    setShowModal(true);
                                                                }}>
                                                                <i className='icofont-trash'></i>
                                                            </button>
                                                            <button className="btn btn-info btn-sm"
                                                                title="Mouvements"
                                                                onClick={() => handleShowmouvement(produit.id)}>
                                                                <i className='icofont-eye' style={{ color: "#000" }}></i>
                                                            </button>
                                                        </td>

                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                    
                                </>
                            )}
                            {/* Modal de confirmation */}
                            <Modal show={showModal} onHide={() => setShowModal(false)}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Confirmation</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    Êtes-vous sûr de vouloir supprimer le produit : <strong>{selectedproduit?.designation}</strong> ?
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


                            <Modal show={showModalproduit} tabIndex='-1' scrollable>
                                <Modal.Header>
                                    <Modal.Title style={{ fontSize: '13px', fontWeight: '700', textAlign: 'center' }}>
                                        Détails du produit
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body key={produitdetail.id} scrollable>

                                    <div className="row">
                                        <div className="col-md-12 mb-3">
                                            <label className="form-label">Désignation</label>
                                            <input type="text" class="form-control"
                                                value={produitdetail.designation}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Stock bloquant</label>
                                            <input type="text" class="form-control"
                                                name="prix"
                                                value={produitdetail.stock_bloquant}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Stock en unité</label>
                                            <input type="text" class="form-control"
                                                name="prix"
                                                value={produitdetail.stock}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Stock en franc</label>
                                            <input type="text" class="form-control"
                                                name="prix"
                                                value={produitdetail.stock_franc}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Unité</label>
                                            <input type="text" class="form-control"
                                                name="unite"
                                                value={produitdetail.unite}
                                            />
                                        </div>


                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="danger" onClick={() => setShowModalproduit(false)}>
                                        <i className="icofont-close"></i> Fermer
                                    </Button>
                                </Modal.Footer>
                            </Modal>

                            {/* Lignes ou detail appro */}
                            <Modal show={showModalmouvement} tabIndex='-1' size='lg' scrollable>
                                <Modal.Header>
                                    <Modal.Title style={{ fontSize: '13px', fontWeight: '700', textAlign: 'center' }}>
                                        Mouvements du produit
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body key={mouvement.id} scrollable>

                                    <table id="myDataTable" class="table table-hover align-middle mb-0" style={{ width: '100%' }}>
                                        <thead>
                                            <tr>
                                                <th>Date </th>
                                                <th>Quantité </th>
                                                <th>Mouvement </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                mouvement.length > 0 ?
                                                    mouvement.map((mouvement, index) => (
                                                        <tr key={mouvement.id}>
                                                            <td>{new Date(mouvement.date).toLocaleString()}</td>
                                                            <td>{mouvement.quantite}</td>
                                                            <td>{mouvement.type_operation}</td>
                                                        </tr>
                                                    )) :
                                                    <p>
                                                        Aucune ligne trouvée
                                                    </p>

                                            }

                                        </tbody>
                                    </table>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="danger" onClick={() => setshowModalmouvement(false)}>
                                        <i className="icofont-close"></i> Fermer
                                    </Button>
                                </Modal.Footer>
                            </Modal>

                            {/* Modal pour modifier le produit */}
                            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} scrollable>
                                <Modal.Header closeButton>
                                    <Modal.Title>Modifier le produit</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <form onSubmit={handleEditSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Désignation <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="designation"
                                                value={dataproduit.designation || ''}
                                                onChange={(e) =>
                                                    setDataproduit({
                                                        ...dataproduit,
                                                        designation: e.target.value
                                                    })
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Unité <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <select
                                                className="form-control"
                                                name="unite"
                                                value={dataproduit.unite || ''}
                                                onChange={(e) =>
                                                    setDataproduit({ ...dataproduit, unite: e.target.value })
                                                }
                                                required
                                            >
                                                <option value="">Sélectionner</option>
                                                <option value="Unité">Unité</option>
                                                <option value="Sac">Sac</option>
                                                <option value="Franc">Franc</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Seuil <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="seuil"
                                                value={dataproduit.seuil || ''}
                                                onChange={(e) =>
                                                    setDataproduit({ ...dataproduit, seuil: e.target.value })
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Stock bloquant ? <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <select
                                                className="form-control"
                                                name="stock_bloquant"
                                                value={dataproduit.stock_bloquant || ''}
                                                onChange={(e) =>
                                                    setDataproduit({
                                                        ...dataproduit,
                                                        stock_bloquant: e.target.value
                                                    })
                                                }
                                                required
                                            >
                                                <option value="">Sélectionner</option>
                                                <option value="Non">Non</option>
                                                <option value="Oui">Oui</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Décomposable ? <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <select
                                                className="form-control"
                                                name="puisable_en_portion"
                                                value={dataproduit.puisable_en_portion || ''}
                                                onChange={(e) =>
                                                    setDataproduit({
                                                        ...dataproduit,
                                                        puisable_en_portion: e.target.value
                                                    })
                                                }
                                                required
                                            >
                                                <option value="">Sélectionner</option>
                                                <option value="Non">Non</option>
                                                <option value="Oui">Oui</option>
                                            </select>
                                        </div>
                                        {dataproduit.puisable_en_portion === 'Oui' && (
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Contenance <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="contenance"
                                                    value={dataproduit.contenance || ''}
                                                    onChange={(e) =>
                                                        setDataproduit({
                                                            ...dataproduit,
                                                            contenance: e.target.value
                                                        })
                                                    }
                                                />
                                            </div>
                                        )}
                                        <Button type="submit" variant="primary">
                                            Enregistrer les modifications
                                        </Button>
                                    </form>
                                </Modal.Body>
                            </Modal>
                        </div>

                    </div>
                </div>

            </div>
        </LayoutFastfood>
    )
}

export default ProduitSeuil