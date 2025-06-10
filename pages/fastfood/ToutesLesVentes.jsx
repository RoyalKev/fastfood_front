import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { StaticIP } from "@/config/staticip";
import { AuthContext } from "@/context/authContext";
import LayoutFastfood from "@/components/LayoutFastfood";
import BreadCrumb from "@/components/BreadCrumb";
import { Modal, Button, Table } from "react-bootstrap";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToutesLesVentes = () => {
    const [ventes, setVentes] = useState([]);
    const [totalvente, settotalvente] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 5; // Nombre de ventes par page

    const { currentUser } = useContext(AuthContext)
    const [userid, setuserId] = useState(null)
    useEffect(() => {
        if (currentUser) {
            setuserId(currentUser.id);
        }
    }, [currentUser]);

    const fetchVentes = async (page) => {
        try {
            const response = await axios.get(`${StaticIP}api/vente/toutes-les-ventes?page=${page}&limit=${limit}`)
            setVentes(response.data.ventes);
            settotalvente(response.data.totalvente);
            setTotalPages(response.data.totalPages); 
            setCurrentPage(response.data.currentPage);
        } catch (error) {
            console.error("Erreur lors de la récupération des ventes :", error);
        }
    };

    useEffect(() => {
        fetchVentes(currentPage);
    }, [currentPage]);

    const goToPage = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const [venteIdToCancel, setVenteIdToCancel] = useState(null);
    const [showModal, setShowModal] = useState(false); //POUR ANNULATION DE VENTE
    const [showModalvalider, setShowModalvalider] = useState(false); //POUR VALIDATION DE VENTE

    const handleCancelVente = async () => {
        try {
            await axios.post(`${StaticIP}api/vente/annuler/${venteIdToCancel}`);
            setShowModal(false);
            toast.success('Vente annulée avec succès !');
            fetchVentes(); // Rafraîchir la liste après annulation
        } catch (error) {
            console.error("Erreur d'annulation :", error);
        }
    };
    const handleValidateVente = async () => {
        try {
            await axios.post(`${StaticIP}api/vente/valider/${venteIdToCancel}`);
            setShowModalvalider(false);
            toast.success('Vente validée avec succès !');
            fetchVentes(); // Rafraîchir la liste après validation
        } catch (error) {
            console.error("Erreur de validation :", error);
        }
    };


    return (
        <LayoutFastfood>
            <BreadCrumb titre="Toutes les ventes" />
            <div className="row g-3 mb-3">
                <div class="col-xl-12 col-lg-12">
                    <div className="card">
                        <div class="card-header">
                            <h6>Toutes les ventes </h6>
                        </div>
                        <div class="card-body">
                            <table className="table table-responsive border-collapse border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border p-2">N°</th>
                                        <th className="border p-2">Caissier</th>
                                        <th className="border p-2">Type vente</th>
                                        <th className="border p-2">Table</th>
                                        <th className="border p-2">Date</th>
                                        <th className="border p-2">Montant</th>
                                        <th className="border p-2">Détails</th>
                                        <th className="border p-2">Statut</th>
                                        <th className="border p-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ventes.length > 0 ? (
                                        ventes.map((vente) => (
                                            <tr key={vente.id} className="border-b">
                                                <td>{vente.numero}</td>
                                                <td style={{textAlign:'center'}}>{vente.user ? `${vente.user.nom}` : ''}</td>
                                                <td style={{textAlign:'center'}}>{vente.type_vente}</td>
                                                <td style={{textAlign:'center'}}>{vente.table ? `${vente.table.reference} - ${vente.table.emplacement}` : ''}</td>
                                                <td className="border p-2">{new Date(vente.date).toLocaleDateString()}</td>
                                                <td className="border p-2" style={{textAlign:'right'}}>{vente.montant.toLocaleString()}</td>
                                                <td className="border p-2">
                                                    <ul>
                                                        {vente.lignevente.map((ligne) => (
                                                            <li key={ligne.id} className="text-sm text-gray-600">
                                                                {ligne.produit?.designation} - {ligne.quantite} {ligne.unite} ({ligne.montligne.toLocaleString()} F)
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    {
                                                        vente.statut == "Validé" ?
                                                            <span className='badge bg-success'>{vente.statut}</span> :
                                                            <span className='badge bg-danger'>{vente.statut}</span>
                                                    }

                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    {
                                                        vente.statut == "Validé" &&
                                                        <button
                                                            title="Annuler"
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => {
                                                                setVenteIdToCancel(vente.id);
                                                                setShowModal(true);
                                                            }}
                                                        >
                                                            <i className="icofont-close"></i>
                                                        </button>
                                                    }
                                                    {
                                                        vente.statut == "En cours" && 
                                                        <>
                                                        <button type="button" className="btn btn-outline-primary btn-sm" title="Ouvrir/ Modifier commande"
                                                            onClick={() => handleViewModif(vente.id)}>
                                                                <i className="icofont-cart-alt"></i>
                                                        </button>
                                                        <button
                                                            title="Valider"
                                                            className="btn btn-success btn-sm"
                                                            onClick={() => {
                                                                setVenteIdToCancel(vente.id);
                                                                setShowModalvalider(true);
                                                            }}
                                                        >
                                                            <i className="icofont-close"></i>
                                                        </button>
                                                        </>
                                                    }
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center p-4">Aucune vente enregistrée</td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr>


                                        <td style={{textAlign:'right'}}>Total</td>
                                        <td style={{textAlign:'right'}}>{totalvente.toLocaleString()}</td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                            {/* Pagination */}
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
                        </div>

                    </div>
                    <ToastContainer />
                </div>

                {/* Modal de confirmation */}
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Voulez-vous vraiment annuler cette vente ?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Annuler
                        </Button>
                        <Button variant="danger" onClick={handleCancelVente}>
                            Confirmer
                        </Button>
                    </Modal.Footer>
                </Modal>
                {/** Modal confirmation validation */}
                <Modal show={showModalvalider} onHide={() => setShowModalvalider(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Voulez-vous vraiment valider cette vente ?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModalvalider(false)}>
                            Annuler
                        </Button>
                        <Button variant="success" onClick={handleValidateVente}>
                            Confirmer
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>

        </LayoutFastfood>
    )
}

export default ToutesLesVentes