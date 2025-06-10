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
import Link from 'next/link';

const UniteConversion = () => {

    const router = useRouter();

    //Pour la liste des produits
    const [categories, setcategories] = useState([]);
    const [produits, setproduits] = useState([]);
    const [boissons, setboissons] = useState([]);
    const [unitemesures, setunitemesures] = useState([]);
    const [error, setError] = useState(null);
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [image, setImage] = useState(null);
    //const [catid, setcatid] = useState('')

    /*const handleChange = async (e) => {
        try {
            const response = await axios.get(`${StaticIP}api/categorie/produitcat/` + e.target.value);
            if (response.data.Status) {
                setcategories(response.data.Result);
                setDataproduit((prev) => ({ ...prev, categorie_id: e.target.value }));
            } else {
                setError("Erreur lors de la récupération des produits");
            }
        } catch (err) {
            setError("Une erreur est survenue lors de la récupération des produits");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };*/

    const fetchcategories = async (e) => {
        setLoading(true);
        try {
            const response = await axios.get(`${StaticIP}api/categorie/liste2`);
            if (response.data.Status) {
                setcategories(response.data.Result);
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
        fetchcategories(categories);
    }, []);

    //flitrer les produits

    const [searchTerm, setSearchTerm] = useState("");
    const filteredProduits = produits.filter((produit) =>
        produit.designation.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Récupération des produits avec pagination
    const fetchproduits = async (page = 1, search = searchTerm) => {
    setLoading(true);
    try {
        const response = await axios.get(`${StaticIP}api/uniteconversion/liste`, {
            params: {
                page,
                limit: 10,
                search
            }
        });

        if (response.data.Status) {
            setproduits(response.data.Result);
            setTotalPages(response.data.Pagination.totalPages);
            setCurrentPage(response.data.Pagination.currentPage);
        } else {
            setError("Erreur lors de la récupération des produits");
        }
    } catch (err) {
        setError("Une erreur est survenue lors de la récupération des produits");
        console.error(err);
    } finally {
        setLoading(false);
    }
};


    useEffect(() => {
    fetchproduits(1, searchTerm);
}, [searchTerm]);

   const goToPage = (page) => {
    if (page > 0 && page <= totalPages) {
        fetchproduits(page, searchTerm); // <-- très important
    }
};

    // Récupération des boissons
    const fetchboissons = async (e) => {
        setLoading(true);
        try {
            const response = await axios.get(`${StaticIP}api/uniteconversion/listeboissons`);
            if (response.data.Status) {
                setboissons(response.data.Result);
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
        fetchboissons(boissons);
    }, []);
    //FIN LISTE

    // Récupération des unités de mesures
    const fetchunitemesures = async (e) => {
        setLoading(true);
        try {
            const response = await axios.get(`${StaticIP}api/unitemesure/liste`);
            if (response.data.Status) {
                setunitemesures(response.data.Result);
            } else {
                setError("Erreur lors de la récupération des unités de mesure");
            }
        } catch (err) {
            setError("Une erreur est survenue lors de la récupération des unités de mesure");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchunitemesures(unitemesures);
    }, []);
    //FIN LISTE

    //POUR LA SUPPRESSION
    const [showModal, setShowModal] = useState(false);
    const [selectedproduit, setselectedproduit] = useState(null);
    const handleDelete = async () => {
        if (!selectedproduit) return;
        try {
            const response = await axios.delete(`${StaticIP}api/uniteconversion/supprimer/${selectedproduit.id}`);
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

    const [dataproduit, setDataproduit] = useState({
        categorie_id: '',
        categorie: '',
        bouteilleMereid: '',
        designation: '',
        prix: '',
        prix_revient: '',
        unite: '',
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('userid', dataproduit.userid);
        formData.append('categorie_id', dataproduit.categorie_id);
        formData.append('categorie', dataproduit.categorie);
        formData.append('bouteilleMereid', dataproduit.bouteilleMereid);
        formData.append('designation', dataproduit.designation);
        formData.append('prix', dataproduit.prix);
        formData.append('prix_revient', dataproduit.prix_revient);
        formData.append('unite', dataproduit.unite);
        formData.append('contenance', dataproduit.contenance);
        /*for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }*/


        setLoading(true);
        try {
            const response = await axios.post(`${StaticIP}api/uniteconversion/nouveau`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log('la réggg :', response.data)
            if (response.data.Status) {
                toast.success('Produit créée avec succès !');
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
    //POUR LA RECUPERATION DUNE produit
    const [deletedId, setDeletedId] = useState("")
    const [showModalproduit, setShowModalproduit] = useState(false);
    const [produitdetail, setproduitdetail] = useState([]);
    const handleShowproduit = (id) => {
        setShowModalproduit(true)
        axios.get(`${StaticIP}api/uniteconversion/detail/` + id)
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

    const handleViewCompo = (id) => {
        router.push(`/fastfood/composition/${id}`); // Redirige vers la page Composition avec l'ID
    };

    const [showModalmouvement, setshowModalmouvement] = useState(false);
    const [mouvement, setmouvement] = useState([]);
    const handleShowmouvement = (id) => {
        setshowModalmouvement(true)
        axios.get(`${StaticIP}api/uniteconversion/mouvement/` + id)
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

    

    //FIN MISE A JOUR
    return (
        <LayoutFastfood>
            <BreadCrumb titre="Produits à vendre (Boissons / Plats)" />
            <div className="row g-3 mb-3">
                <div className="col-xl-12 col-lg-12">
                    <div className="sticky-lg-top">
                        <div className="card mb-3">
                            <CardTitle title="Nouveau" />
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3 align-items-center">
                                        <div className="col-md-2">
                                            <label className="form-label">Type<font color="red">*</font></label>
                                            <select class="form-control"
                                                name="categorie"
                                                onChange={(e) => setDataproduit({ ...dataproduit, categorie: e.target.value })}
                                            >
                                                <option value=""> Sélectionner</option>
                                                <option value="Plat"> Plat</option>
                                                <option value="Boisson"> Boisson</option>
                                            </select>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Désignation</label>
                                            <input class="form-control" name="designation" placeholder="Saisir la désignation"
                                                onChange={(e) => setDataproduit({ ...dataproduit, designation: e.target.value })} />
                                        </div>
                                        <div className="col-md-2">
                                            <label className="form-label">Catégories</label>
                                            <select class="form-control"
                                                name="categorie_id"
                                                onChange={(e) => setDataproduit({ ...dataproduit, categorie_id: e.target.value })}
                                            >
                                                <option value=""> Sélectionner</option>
                                                {categories.map((categorie, index) => (
                                                    <option value={categorie.id} key={categorie.id}> {categorie.libelle}</option>
                                                ))}

                                            </select>
                                        </div>

                                        <div className="col-md-2">
                                            <label className="form-label">Prix de vente<font color="red">*</font></label>
                                            <input class="form-control" name="prix" placeholder="Saisir le prix unit."
                                                onChange={(e) => setDataproduit({ ...dataproduit, prix: e.target.value })} />
                                        </div>
                                        <div className="col-md-2">
                                            <label className="form-label">Prix de revient<font color="red">*</font></label>
                                            <input class="form-control" name="prix_revient" placeholder="Saisir le prix de revient."
                                                onChange={(e) => setDataproduit({ ...dataproduit, prix_revient: e.target.value })} />
                                        </div>
                                        <div className="col-md-2">
                                            <label className="form-label">Unité<font color="red">*</font></label>
                                            <select class="form-control"
                                                name="unite"
                                                onChange={(e) => setDataproduit({ ...dataproduit, unite: e.target.value })}
                                            >
                                                <option value=""> Sélectionner</option>
                                                <option value="Plat"> Plat</option>
                                                <option value="Bouteille"> Bouteille</option>
                                                <option value="Verre"> Verre</option>
                                                <option value="Unité"> Unité</option>
                                            </select>
                                        </div>
                                        {
                                            dataproduit.categorie == "Boisson" && dataproduit.unite == "Verre" &&
                                            <>
                                                <div className="col-md-3">
                                                    <label className="form-label">Comme enfant de</label>
                                                    <select class="form-control"
                                                        name="bouteilleMereid"
                                                        onChange={(e) => setDataproduit({ ...dataproduit, bouteilleMereid: e.target.value })}
                                                    >
                                                        <option value=""> Sélectionner</option>
                                                        {boissons.map((boisson, index) => (
                                                            <option value={boisson.id} key={boisson.id}> {boisson.designation}</option>
                                                        ))}

                                                    </select>
                                                </div>

                                            </>
                                        }
                                        {
                                            dataproduit.categorie == "Boisson" && dataproduit.unite == "Bouteille" &&
                                            <div className="col-md-2">
                                                <label className="form-label">Nbre de verre contenu  <font color="red">*</font></label>
                                                <input class="form-control" name="contenance" placeholder="Ex : 5"
                                                    onChange={(e) => setDataproduit({ ...dataproduit, contenance: e.target.value })} />
                                            </div>
                                        }

                                        
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
                        <div class="card-header">
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <input
                                    type="text"
                                    className="form-control mb-3"
                                    placeholder="Rechercher par désignation..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ width: '30%' }}
                                />
                            </div>
                        </div>
                        <CardTitle title="Liste" />
                        <div class="card-body">
                            {produits.length === 0 ? (
                                <p>Aucun produit trouvé.</p>
                            ) : (
                                <>
                                    <table id="myDataTable" class="table table-hover align-middle mb-0" style={{ width: '100%' }}>
                                        <thead>
                                            <tr>
                                                <th>Type </th>
                                                <th>Désignation </th>
                                                <th>Prix détail</th>
                                                <th>Prix de revient</th>
                                                <th>Unité </th>
                                                <th>Stock disponible </th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredProduits.map((produit, index) => (
                                                <tr key={produit.id}>
                                                    <td>
                                                        {produit.type}
                                                    </td>
                                                    <td>{produit.designation}</td>
                                                    <td>{produit.prix}</td>
                                                    <td>{produit.prix_revient}</td>
                                                    <td>
                                                        <span className='badge bg-info'>{produit.unite}</span></td>
                                                    <td style={{fontSize:'15px'}}>
                                                        {
                                                            produit.type=="Boisson" &&
                                                            <span className='badge bg-success'>{produit.stock}</span>
                                                            
                                                        }
                                                    </td>
                                                    <td>
                                                            
                                                            <Link href={`/fastfood/ModifierUniteconversion/${produit.id}`}
                                                                className="btn btn-outline-info btn-sm"> <i className='icofont-edit'></i>
                                                            </Link>
                                                        <button className="btn btn-outline-warning btn-sm"
                                                            title="Détails"
                                                            onClick={() => handleShowproduit(produit.id)}>
                                                            <i className='icofont-eye' style={{ color: "#cfa108" }}></i>
                                                        </button>
                                                        <button className="btn btn-outline-danger btn-sm" hidden
                                                            title="Supprimer"
                                                            onClick={() => {
                                                                setselectedproduit(produit);
                                                                setShowModal(true);
                                                            }}>
                                                            <i className='icofont-trash'></i>
                                                        </button>
                                                        {
                                                            produit.type == "Plat" &&
                                                            <>
                                                                <button type="button" className="btn btn-outline-info btn-sm" title="Composition"
                                                                    onClick={() => handleViewCompo(produit.id)}>
                                                                    <i className="icofont-files-stack"></i>
                                                                </button>
                                                            </>
                                                        }
                                                        {
                                                            produit.type == "Boisson" &&
                                                            <>

                                                                <button className="btn btn-primary btn-sm"
                                                                    title="Mouvements"
                                                                    onClick={() => handleShowmouvement(produit.id)}>
                                                                    <i className='icofont-eye' style={{ color: "#000" }}></i>
                                                                </button>
                                                            </>
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
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Désignation</label>
                                            <input type="text" class="form-control"
                                                value={produitdetail.designation}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Unité</label>
                                            <input type="text" class="form-control"
                                                name="unite"
                                                value={produitdetail.unite}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Prix</label>
                                            <input type="text" class="form-control"
                                                name="prix"
                                                value={produitdetail.prix}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Stock</label>
                                            <input type="text" class="form-control"
                                                value={produitdetail.stock}
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
                                                )):
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
                        </div>

                    </div>
                </div>

            </div>
        </LayoutFastfood>
    )
}

export default UniteConversion