import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { StaticIP } from "@/config/staticip";
import { AuthContext } from "@/context/authContext";
import LayoutFastfood from "@/components/LayoutFastfood";
import BreadCrumb from "@/components/BreadCrumb";
import { Modal, Button, Table } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QRCode from 'qrcode';


const VenteValidee = () => {

    const router = useRouter();

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

    //je crée cette fonction pour le rafraichissement de la liste apres validation ou annulation
      const fetchVentes = async () => {
        if (!userid) return;
        try {
            const response = await axios.get(`${StaticIP}api/vente/vente_validee/${userid}?page=${currentPage}&limit=${limit}`);
            setVentes(response.data.ventes);
            settotalvente(response.data.totalvente);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.currentPage);
        } catch (error) {
            console.error("Erreur lors de la récupération des ventes :", error);
        }
        };


      useEffect(() => {
        if (userid) {
          axios.get(`${StaticIP}api/vente/vente_validee/${userid}?page=${currentPage}&limit=${limit}`)
          .then(response => { 
            setVentes(response.data.ventes);
            settotalvente(response.data.totalvente);
            setTotalPages(response.data.totalPages); 
            setCurrentPage(response.data.currentPage);
        }).catch(error => {
            console.error("Erreur lors de la récupération des ventes :", error);
        })
    }
}, [userid, currentPage]);


    
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
    const response = await axios.post(`${StaticIP}api/vente/valider/${venteIdToCancel}`);
    console.log("Vente validée :", response.data.vente);
    setShowModalvalider(false);
    toast.success('Vente validée avec succès !');
    // Rafraîchir avec current values
    fetchVentes();
  } catch (error) {
    console.error("Erreur de validation :", error);
  }
};




    const handleViewModif = (id) => {
        router.push(`/fastfood/modifiervente/${id}`); // Redirige vers la page ModifierVente avec l'ID
      };

    
      const imprimerRecu = (vente) => {
        const win = window.open('', '_blank', 'width=300,height=600');
        const contenu = `
          <html>
            <head>
              <style>
                body {
                  font-family: monospace;
                  padding: 10px;
                  font-size: 12px;
                }
                .center {
                  text-align: center;
                }
                .bold {
                  font-weight: bold;
                }
                hr {
                  border: none;
                  border-top: 1px dashed #000;
                  margin: 5px 0;
                }
                .ligne {
                  display: flex;
                  justify-content: space-between;
                }
              </style>
            </head>
            <body>
              <div class="center bold">MALUMBI RESTAURANT BAR</div>
              <div class="center bold">Tél : 065 75 63 07</div>
              <hr />
              <div class="ligne"><span>Date:</span><span>${new Date(vente.date).toLocaleString()}</span></div>
              <div class="ligne"><span>Vente:</span><span>#${vente.numero}</span></div>
              <div class="ligne"><span>Type:</span><span>${vente.type_vente}</span></div>
              ${vente.table ? `<div class="ligne"><span>Table:</span><span>${vente.table.reference}-${vente.table.emplacement}</span></div>` : ''}
              <hr />
              <div class="bold">DÉTAILS</div>
              ${vente.lignevente.map(ligne => `
                <div class="ligne">
                  <span>${ligne.produit?.designation} x${ligne.quantite}</span>
                  <span>${ligne.montligne.toLocaleString()} F</span>
                </div>
              `).join('')}
              <hr />
              ${vente.montantlivraison > 0 ? `
                <div class="ligne">
                  <span>Autres frais:</span>
                  <span>${vente.montantlivraison.toLocaleString()} F</span>
                </div>
              ` : ''}
              <div class="ligne"><span>Réduction:</span><span>${vente.reduction.toLocaleString()} F CFA</span></div>
              <div class="ligne bold"><span>Total:</span><span>${vente.montant.toLocaleString()} F CFA</span></div>
              <hr />
              <div class="center">Merci pour votre achat !</div>
            </body>
          </html>
        `;
        win.document.write(contenu); 
        win.document.close();
        win.focus();
        win.print();
        win.close();
      };

    return (
        <LayoutFastfood>
            <BreadCrumb titre="ventes validées" />
            <div className="row g-3 mb-3">
                <div class="col-xl-12 col-lg-12">
                    <div className="card">
                        <div class="card-header">
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Link href="/fastfood/Vente" className="btn btn-success">
                                    <i className='icofont-plus'></i> Nouvelle vente
                                </Link>
                            </div>
                        </div>
                        <div class="card-body">
                            <table className="table table-responsive border-collapse border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border p-2">N°</th>
                                        <th className="border p-2">Type vente</th>
                                        <th className="border p-2">Date</th>
                                        <th className="border p-2">Table</th>
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
                                                <td style={{textAlign:'center'}}>{vente.type_vente}</td>
                                                <td className="border p-2">{new Date(vente.date).toLocaleDateString()}</td>
                                                <td  className="border p-2"> <font color="red">{vente.table ? `${vente.table.reference} - ${vente.table.emplacement}` : ''}</font></td>
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
                                                            className="btn btn-outline-success btn-sm"
                                                            onClick={() => {
                                                                setVenteIdToCancel(vente.id);
                                                                setShowModalvalider(true);
                                                            }}
                                                        >
                                                            <i className="icofont-check"></i>
                                                        </button>
                                                        </>
                                                    }
                                                    {
                                                        vente.statut == "Validé" &&
                                                        <button
                                                        title="Imprimer reçu"
                                                        className="btn btn-secondary btn-sm ms-1"
                                                        onClick={() => imprimerRecu(vente)}
                                                        >
                                                        🖨️
                                                        </button>
                                                    }
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center p-4">Aucune vente enregistrée</td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td style={{textAlign:'right'}}><b>Total</b></td>
                                        <td style={{textAlign:'right'}}><b>{totalvente.toLocaleString()}</b></td>
                                        <td></td>
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

                {/* Modal de confirmation annulation */}
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
                    <Modal.Body>Voulez-vous vraiment annuler cette vente ?</Modal.Body>
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

export default VenteValidee