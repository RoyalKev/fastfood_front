import BreadCrumb from '@/components/BreadCrumb';
import CardTitle from '@/components/CardTitle';
import Layout from '@/components/LayoutRh';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/context/authContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button, Form, Table } from "react-bootstrap";
import { StaticIP } from '@/config/staticip';
import LayoutFastfood from '@/components/LayoutFastfood';

const Inventaireboisson = () => {
    const [loading, setLoading] = useState(false);
    const { currentUser } = useContext(AuthContext);
    const [userid, setUserId] = useState(null);
    const [showModalProduit, setShowModalProduit] = useState(false);
    const [produits, setProduits] = useState([]);
    const [inventaire, setinventaires] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduits, setSelectedProduits] = useState([]);


    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        if (currentUser) {
            setUserId(currentUser.id);
        }
        fetchProduits();
    }, [currentUser]);

    const fetchProduits = async () => {
        try {
            const response = await axios.get(`${StaticIP}api/uniteconversion/listeboissons2`);
            if (response.data.Status) {
                setProduits(response.data.Result);
            } else {
                toast.error("Erreur lors de la récupération des produits");
            }
        } catch (err) {
            toast.error("Une erreur est survenue lors de la récupération des produits");
            console.error(err);
        }
    };
    const fetchinventaire = async (page = 1) => {
        try {
            const response = await axios.get(`${StaticIP}api/inventaireboisson/liste?page=${page}&limit=5`);
            if (response.data.Status) {
                setinventaires(response.data.Result);
                setTotalPages(response.data.Pagination.totalPages);
                setCurrentPage(response.data.Pagination.currentPage);
            } else {
                toast.error("Erreur lors de la récupération des inventaires");
            }
        } catch (err) {
            toast.error("Une erreur est survenue lors de la récupération des inventaires");
            console.error(err);
        }
    };

    useEffect(() => {
        fetchinventaire(currentPage);
    }, [currentPage]);

    const goToPage = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    //fin

    const addProduit = (produit) => {
        setSelectedProduits([...selectedProduits, { ...produit, quantite: 1}]);
        setShowModalProduit(false);
    };

    const handleChange = (index, field, value) => {
        const updatedProduits = selectedProduits.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        setSelectedProduits(updatedProduits);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedProduits.length === 0) {
            toast.error("Ajoutez au moins un produit");
            return;
        }
        const inventaireData = { userid, date: new Date()};
        try {
            const response = await axios.post(`${StaticIP}api/inventaireboisson/nouveau`, {
                inventaireData,
                lignes: selectedProduits.map(({ id, ...rest }) => ({ ...rest, produit_id: id, inventaire_id: undefined, userid }))
            });
            if (response.data.success) {
                toast.success("Inventaire enregistré avec succès");
                setSelectedProduits([]);
                fetchinventaire(); // Recharge la liste après enregistrements
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Erreur lors de l'enregistrement");
            console.error(error);
        }
    };

    const [showModalinventaire, setShowModalinventaire] = useState(false);
    const [inventairedetail, setinventairedetail] = useState([]);
    const handleShowinventaire = (id) => {
        setShowModalinventaire(true)
        axios.get(`${StaticIP}api/inventaireboisson/lignes/` + id)
            .then(result => {
                if (result.data.Status) {
                    if (result.data.Status) {
                        setinventairedetail(result.data.Result)
                    } else {
                        alert(result.data.Error)
                    }
                }
            })
    }

    const handleCancelinventaire = async (inventaireId) => {
        if (!window.confirm("Voulez-vous vraiment annuler cet Inventaire ?")) {
            return;
        }
        try {
            const response = await axios.put(`${StaticIP}api/inventaireboisson/annuler/${inventaireId}`);
            if (response.data.success) {
                toast.success("Inventaire annulé avec succès !");
                fetchinventaire(); // Recharge la liste après annulation
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Erreur lors de l'annulation de l'Inventaire");
            console.error(error);
        }
    };
    

    return (
        <LayoutFastfood>
            <BreadCrumb titre="inventaires boissons" />
            <div className="row g-3 mb-3">
                <div class="col-xl-7 col-lg-7">
                    <div className="card">
                        <CardTitle title="Nouveau" />
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <Button onClick={() => setShowModalProduit(true)} variant='secondary'><i className='icofont-plus'></i> Ajouter un produit</Button>
                                <Table striped bordered hover className="mt-3">
                                    <thead>
                                        <tr>
                                            <th>Produit</th>
                                            <th>Qté</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedProduits.map((produit, index) => (
                                            <tr key={index}>
                                                <td>{produit.designation}</td>
                                                <td><input className='form-control' type="number" value={produit.quantite} onChange={(e) => handleChange(index, "quantite", parseFloat(e.target.value))} /></td>
                                                <td><Button variant="danger" onClick={() => setSelectedProduits(selectedProduits.filter((_, i) => i !== index))}><i className='icofont-trash'></i></Button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                <Button type="submit" variant="success"><i className='icofont-save'></i> Enregistrer</Button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* LISTE DES inventaireS */}

                <div class="col-xl-5 col-lg-5">
                    <div class="card">
                        <CardTitle title="Liste des inventaires boissons" />
                        <div class="card-body">
                            {inventaire.length === 0 ? (
                                <p>Aucun inventaire trouvé.</p>
                            ) : (
                                <>
                                    <table id="myDataTable" class="table table-hover align-middle mb-0" style={{ width: '100%' }}>
                                        <thead>
                                            <tr>
                                                <th>N°</th>
                                                <th>Date</th>
                                                <th>Statut</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {inventaire.map((inventaire, index) => (
                                                <tr key={inventaire.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{new Date(inventaire.date).toLocaleString()} </td>
                                                    <td>
                                                        { 
                                                            inventaire.statut == "Validé" ? 
                                                            <span className='badge bg-success'>{inventaire.statut}</span> :
                                                            <span className='badge bg-danger'>{inventaire.statut}</span>
                                                        }
                                                        
                                                    </td>
                                                    <td>
                                                        {
                                                            inventaire.statut=='Validé' &&
                                                            <button className="btn btn-danger btn-sm"
                                                                title="Annuler"
                                                                onClick={() => handleCancelinventaire(inventaire.id)}>
                                                                <i className='icofont-close' style={{color:"#fff"}}></i>
                                                            </button>

                                                        }
                                                        <button className="btn btn-info btn-sm"
                                                            title="Détails"
                                                            onClick={() => handleShowinventaire(inventaire.id)}>
                                                            <i className='icofont-eye' style={{color:"#000"}}></i>
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

                        </div>

                    </div>
                </div>
                {/* FIN LISTE inventaire */}


                <ToastContainer />
                <Modal show={showModalProduit} onHide={() => setShowModalProduit(false)} scrollable>
                    <Modal.Header closeButton>
                        <Modal.Title>Sélectionner un produit</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Control type="text" placeholder="Rechercher un produit..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value.toLowerCase())} />
                        <Table striped bordered hover className="mt-3">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Désignation</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {produits.filter(p => p.designation.toLowerCase().includes(searchTerm)).map((produit) => (
                                    <tr key={produit.id}>
                                        <td>{produit.id}</td>
                                        <td>{produit.designation} <span className='badge bg-success'>{produit.unite}</span></td>
                                        <td>
                                            <Button onClick={() => addProduit(produit)} 
                                            variant='primary'
                                            style={{padding:'3px', fontSize:'12px'}}>
                                                <i className='icofont-plus'></i>Ajouter
                                            </Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => setShowModalProduit(false)}>Fermer</Button>
                    </Modal.Footer>
                </Modal>

                {/* Lignes ou detail inventaire */}
                <Modal show={showModalinventaire} tabIndex='-1' scrollable>
                    <Modal.Header>
                        <Modal.Title style={{ fontSize: '13px', fontWeight: '700', textAlign: 'center' }}>
                            Lignes inventaire
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body key={inventairedetail.id} scrollable>

                        
                        {inventairedetail.map((inventairedetail, index) => (
                            <div className="row" key={inventairedetail.id}>
                            <div className="col-md-8 mb-3">
                                <label className="form-label">Désignation</label>
                                <input type="text" class="form-control"
                                    value={inventairedetail.designation} readOnly
                                />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Qté inventaire</label>
                                <input type="text" class="form-control"
                                    value={inventairedetail.quantite} readOnly
                                />
                            </div>
                        </div>
                        ))}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => setShowModalinventaire(false)}>
                            <i className="icofont-close"></i> Fermer
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </LayoutFastfood>
    );
};

export default Inventaireboisson;
