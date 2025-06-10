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

const Appro = () => {
    const { currentUser } = useContext(AuthContext);
    const [userid, setUserId] = useState(null);
    const [showModalProduit, setShowModalProduit] = useState(false);
    const [produits, setProduits] = useState([]);
    const [appro, setappros] = useState([]);
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
            const response = await axios.get(`${StaticIP}api/produit/liste2`);
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
    const fetchappro = async (page = 1) => {
        try {
            const response = await axios.get(`${StaticIP}api/appro/liste?page=${page}&limit=5`);
            if (response.data.Status) {
                setappros(response.data.Result);
                setTotalPages(response.data.Pagination.totalPages);
                setCurrentPage(response.data.Pagination.currentPage);
            } else {
                toast.error("Erreur lors de la récupération des appros");
            }
        } catch (err) {
            toast.error("Une erreur est survenue lors de la récupération des appros");
            console.error(err);
        }
    };

    useEffect(() => {
        fetchappro(currentPage);
    }, [currentPage]);

    const goToPage = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    //fin
    const addProduit = (produit) => {
        setSelectedProduits([...selectedProduits, { ...produit, quantite: 1, montant_total: 0, unite: "Unité" }]);
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
        const approData = { userid, date: new Date(), montant: selectedProduits.reduce((acc, p) => acc + p.montant_total, 0) };
        try {
            const response = await axios.post(`${StaticIP}api/appro/nouveau`, {
                approData,
                lignes: selectedProduits.map(({ id, ...rest }) => ({ ...rest, produit_id: id, appro_id: undefined, userid }))
            });
            if (response.data.success) {
                toast.success("Approvisionnement enregistré avec succès");
                setSelectedProduits([]);
                fetchappro(); // Recharge la liste après enregistrements
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Erreur lors de l'enregistrement");
            console.error(error);
        }
    };

    const [showModalappro, setShowModalappro] = useState(false);
    const [approdetail, setapprodetail] = useState([]);
    const handleShowappro = (id) => {
        setShowModalappro(true)
        axios.get(`${StaticIP}api/appro/lignes/` + id)
            .then(result => {
                if (result.data.Status) {
                    if (result.data.Status) {
                        setapprodetail(result.data.Result)
                    } else {
                        alert(result.data.Error)
                    }
                }
            })
    }

    const handleCancelAppro = async (approId) => {
        if (!window.confirm("Voulez-vous vraiment annuler cet approvisionnement ?")) {
            return;
        }
        try {
            const response = await axios.put(`${StaticIP}api/appro/annuler/${approId}`);
            if (response.data.success) {
                toast.success("Approvisionnement annulé avec succès !");
                fetchappro(); // Recharge la liste après annulation
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Erreur lors de l'annulation de l'approvisionnement");
            console.error(error);
        }
    };
    

    return (
        <LayoutFastfood>
            <BreadCrumb titre="approvisionnements aliments sources" />
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
                                            <th>Prix d'achat</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedProduits.map((produit, index) => (
                                            <tr key={index}>
                                                <td>{produit.designation}</td>
                                                <td><input className='form-control' type="number" value={produit.quantite} onChange={(e) => handleChange(index, "quantite", parseFloat(e.target.value))} /></td>
                                                
                                                <td><input className='form-control' type="number" value={produit.montant_total} onChange={(e) => handleChange(index, "montant_total", parseFloat(e.target.value))} /></td>
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

                {/* LISTE DES APPROS */}

                <div class="col-xl-5 col-lg-5">
                    <div class="card">
                        <CardTitle title="Liste des approvisionnements alim.sources" />
                        <div class="card-body">
                            {appro.length === 0 ? (
                                <p>Aucun appro trouvé.</p>
                            ) : (
                                <>
                                    <table id="myDataTable" class="table table-hover align-middle mb-0" style={{ width: '100%' }}>
                                        <thead>
                                            <tr>
                                                <th>N°</th>
                                                <th>Date</th>
                                                <th>Montant</th>
                                                <th>Statut</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {appro.map((appro, index) => (
                                                <tr key={appro.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{new Date(appro.date).toLocaleString()} </td>
                                                    <td>{(parseInt(appro.montant) || 0).toLocaleString()} F</td>
                                                    <td>
                                                        { 
                                                            appro.statut == "Validé" ? 
                                                            <span className='badge bg-success'>{appro.statut}</span> :
                                                            <span className='badge bg-danger'>{appro.statut}</span>
                                                        }
                                                        
                                                    </td>
                                                    <td>
                                                        {
                                                            appro.statut=='Validé' &&
                                                            <button className="btn btn-danger btn-sm"
                                                                title="Annuler"
                                                                onClick={() => handleCancelAppro(appro.id)}>
                                                                <i className='icofont-close' style={{color:"#fff"}}></i>
                                                            </button>

                                                        }
                                                        <button className="btn btn-info btn-sm"
                                                            title="Détails"
                                                            onClick={() => handleShowappro(appro.id)}>
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
                {/* FIN LISTE APPRO */}


                <ToastContainer />
                <Modal show={showModalProduit} onHide={() => setShowModalProduit(false)} scrollable>
                    <Modal.Header closeButton>
                        <Form.Control type="text" placeholder="Rechercher un produit..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value.toLowerCase())} />
                    </Modal.Header>
                    <Modal.Body>
                        
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
                                        <td>{produit.designation}</td>
                                        <td><Button onClick={() => addProduit(produit)}>Ajouter</Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => setShowModalProduit(false)}>Fermer</Button>
                    </Modal.Footer>
                </Modal>

                {/* Lignes ou detail appro */}
                <Modal show={showModalappro} tabIndex='-1' size='lg' scrollable>
                    <Modal.Header>
                        <Modal.Title style={{ fontSize: '13px', fontWeight: '700', textAlign: 'center' }}>
                            Lignes appro
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body key={approdetail.id} scrollable>

                        
                        {approdetail.map((approdetail, index) => (
                            <div className="row" key={approdetail.id}>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Désignation</label>
                                <input type="text" class="form-control"
                                    value={approdetail.designation} readOnly
                                />
                            </div>
                            <div className="col-md-2 mb-3">
                                <label className="form-label">Qté appro</label>
                                <input type="text" class="form-control"
                                    value={approdetail.quantite} readOnly
                                />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Qté entrée en stock</label>
                                <input type="text" class="form-control"
                                    value={approdetail.qteligne} readOnly
                                />
                            </div>
                            <div className="col-md-2 mb-3">
                                <label className="form-label">Unité</label>
                                <input type="text" class="form-control"
                                    name="unite"
                                    value={approdetail.unite} readOnly
                                />
                            </div>
                            <div className="col-md-2 mb-3">
                                <label className="form-label">Total</label>
                                <input type="text" class="form-control"
                                    name="prix"
                                    value={approdetail.montligne} readOnly
                                />
                            </div>
                        </div>
                        ))}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => setShowModalappro(false)}>
                            <i className="icofont-close"></i> Fermer
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </LayoutFastfood>
    );
};

export default Appro;
