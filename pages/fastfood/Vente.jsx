import LayoutFastfood from '@/components/LayoutFastfood';
import LayoutFastfood2 from '@/components/LayoutFastfood2';
import { StaticIP } from '@/config/staticip';
import { AuthContext } from '@/context/authContext';
import axios from 'axios';
import { ZCOOL_KuaiLe } from 'next/font/google';
import React, { useContext, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button } from "react-bootstrap";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const Vente = () => {

  const [categories, setcategories] = useState([]);
  // Récupération des categories
  const fetchcategories = async (e) => {
    try {
      const response = await axios.get(`${StaticIP}api/categorie/liste`);
      if (response.data.Status) {
        setcategories(response.data.Result);
      } else {
        alert("Erreur lors de la récupération des catégories");
      }
    } catch (err) {
      alert("Une erreur est survenue lors de la récupération des catégories");
      console.error(err);
    }
  };
  useEffect(() => {
    fetchcategories(categories);
  }, []);

  const [produits, setproduits] = useState([]);
  const fetchproduits = async (e) => {
    try {
      const response = await axios.get(`${StaticIP}api/uniteconversion/liste`);
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


  console.log(produits)

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState([]);

  // Filtrer les produits par catégorie
  const filteredproduits = produits.filter(
    (produits) => selectedCategory === null || produits.categorie_id === selectedCategory
  );

  // Ajouter un produit au panier
  const addToCart = (produits) => {
    const existingItem = cart.find(
      (item) => item.id === produits.id && item.ulibelle === produits.ulibelle
    );
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === produits.id && item.ulibelle === produits.ulibelle
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...produits, quantity: 1 }]);
    }
  };

  // Modifier la quantité dans le panier
  const updateQuantity = (id, ulibelle, delta) => {
    setCart(
      cart
        .map((item) =>
          item.id === id && item.ulibelle === ulibelle
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Calculer le total
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.prix * item.quantity, 0);
  };

  const { currentUser } = useContext(AuthContext)
  const [userid, setuserId] = useState(null)
  useEffect(() => {
    if (currentUser) {
      setuserId(currentUser.id);
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    if (cart.length === 0) {
      alert("Le panier est vide !");
      return;
    }
    e.preventDefault();
    try {
      // Préparer les données à envoyer
      const venteData = {
        date: new Date(),
        statut: "En cours",
        montant: calculateTotal(),
        userid: userid, // Remplacez par l'ID utilisateur actuel
        lignes: cart.map((item) => ({
          produit_id: item.id, // qui l'id du produit converti
          prix_unitaire: item.prix,
          quantite: item.quantity,
          unite: item.ulibelle,
          montligne: item.prix * item.quantity,
          userid: 1, // Remplacez par l'ID utilisateur actuel
        })),
      };

      // Envoyer les données au serveur avec Axios
      const response = await axios.post(`${StaticIP}api/vente/nouveau`, venteData);

      if (response.status === 201) {
        toast.success('Vente enregistrée avec succès !');
        setCart([]); // Vider le panier après la validation
      } else {
        throw new Error("Erreur lors de l'enregistrement de la vente !");
      }
    } catch (error) {
      console.error(error);
      alert("Une erreur s'est produite lors de l'enregistrement.");
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [venteDetails, setVenteDetails] = useState(null);

  // Fonction pour récupérer la dernière vente et ses lignes
  const fetchDerniereVente = async () => {
    try {
      const response = await axios.get(`${StaticIP}api/vente/derniere_vente/${userid}`);
      setVenteDetails(response.data);
      setShowModal(true); // Afficher le modal après récupération des données
    } catch (error) {
      console.error("Erreur lors de la récupération des détails de la vente :", error);
      alert("Impossible de récupérer les détails de la vente.");
    }
  };

  const printModalContent = () => {
    const printableArea = document.getElementById('printable-area');
  
    if (!printableArea) {
      console.error("L'élément 'printable-area' est introuvable !");
      return;
    }
  
    // Crée une nouvelle fenêtre pour l'impression
    const printWindow = window.open('', '_blank');
  
    if (!printWindow) {
      console.error("Impossible d'ouvrir une nouvelle fenêtre pour l'impression !");
      return;
    }
  
    // Construire le contenu HTML pour l'impression
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Impression</title>
          <style>
            @media print {
              body {
                font-family: Arial, sans-serif;
                font-size: 12px;
                text-align: center;
              }
              #printable-area {
                width: 80mm; /* Largeur typique des tickets */
                margin: 0 auto;
                text-align: center;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 5px;
                text-align: center;
              }
              th {
                background-color: #f2f2f2;
              }
            }
          </style>
        </head>
        <body>
          ${printableArea.innerHTML} <!-- Insérer le contenu à imprimer -->
        </body>
      </html>
    `);
  
    // Lancer l'impression
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  
    // Optionnel : fermer automatiquement la fenêtre après impression
    printWindow.close();
  };
  


  return (
    <LayoutFastfood2>
      <div className="">
        <div className="row">
          {/* Catégories */}
          <div className="col-md-2">
            <h4 style={{ color: '#fff' }}>Catégories</h4>
            <ul className="list-group">
              <li
                className={`list-group-item ${selectedCategory === null ? "active" : ""}`}
                onClick={() => setSelectedCategory(null)}
                style={{ cursor: "pointer" }}
              >
                Toutes
              </li>
              {categories.map((category) => (
                <li
                  key={category.id}
                  className={`list-group-item ${selectedCategory === category.id ? "active" : ""
                    }`}
                  onClick={() => setSelectedCategory(category.id)}
                  style={{ cursor: "pointer" }}
                >
                  {category.libelle}
                </li>
              ))}
            </ul>
          </div>

          {/* Produits */}
          <div className="col-md-7">
            <div className='card'>
              <div className='card-header'>
                <h4 style={{ color: '#000' }}>Articles</h4>
              </div>
              <div className='card-body'>
                <div className="row">
                  {filteredproduits.map((produits) => (
                    <div className="col-md-3 mb-1" key={`${produits.id}-${produits.designation}`}>
                      <div className="card">
                        <div className="card-body">
                          <h6 className="card-title">{produits.designation}</h6>
                          <p className="card-text">
                            <span className='badge bg-primary'>{produits.ulibelle}</span> - {produits.prix} F
                          </p>
                          <center>
                            <button
                              className="btn btn-success"
                              onClick={() => addToCart(produits)}
                            >
                              <i className="icofont-ui-add"></i> Ajouter
                            </button>
                          </center>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Panier */}

          <div className="col-md-3">

            <div className='card'>
              <form onSubmit={handleSubmit}>
                <div className='card-header'>
                  <h4 style={{ color: '#000' }}>Commande</h4>
                </div>
                <div className='card-body'>
                  {
                    cart.length > 0 ?
                      <ul className="list-group">
                        {cart.map((item) => (
                          <li
                            className="list-group-item d-flex justify-content-between align-items-center"
                            key={`${item.id}-${item.ulibelle}`}
                          >
                            <div>
                              <strong>{item.designation}</strong> ({item.ulibelle})
                              <br />
                              Quantité : {item.quantity}
                            </div>
                            <div>
                              <button type='button'
                                className="btn btn-sm btn-success me-2"
                                onClick={() => updateQuantity(item.id, item.ulibelle, 1)}
                              >
                                +
                              </button>
                              <button type='button'
                                className="btn btn-sm btn-danger"
                                onClick={() => updateQuantity(item.id, item.ulibelle, -1)}
                              >
                                -
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul> :

                      <span>
                        Votre panier ne contient aucun produit.
                      </span>

                  }

                </div>
                <div className='card-footer'>
                  {
                    cart.length > 0 ?
                      <>
                        <h5 className="mt-3" style={{ color: '#c92047', fontWeight: '600', textAlign: 'right' }}>Total : {calculateTotal()} F</h5>
                        <button className="btn btn-warning w-100 mt-2">
                          <i className="icofont-check-circled"></i> Valider la commande
                        </button>
                      </>
                      :
                      <>
                        <button className="btn btn-warning w-100 mt-2" disabled>
                          <i className="icofont-check-circled"></i> Valider la commande
                        </button>

                      </>
                  }
                </div>
              </form>
            </div>
            <br />
            <div className='row'>
              <div className='col-md-4'>
                <div className='card'>
                <button className="btn btn-info" onClick={fetchDerniereVente}>
                  <i className="icofont-list"></i> Facture
                </button>
              </div>
              </div>
              <div className='col-md-4'>
              <div className='card'>
              <a className="btn btn-primary" href='/fastfood/Dashboard'>
                <i className="icofont-home"></i> J.Caisse
              </a>
            </div>
              </div>
              <div className='col-md-4'>
              <div className='card'>
              <a className="btn btn-dark" href='/fastfood/Dashboard'>
                <i className="icofont-home"></i> Accueil
              </a>
            </div>
              </div>
            </div>
            
          </div>
        </div>
        <ToastContainer />
        <div id='modal-content'>
          {/* Bouton pour ouvrir le modal */}


          {/* Modal pour afficher les détails de la vente */}
          <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Détails de la Vente</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {venteDetails ? (
                <div id="printable-area">
                  {/* En-tête pour impression */}
                  <div className="text-center mb-4">
                    <h3>MALUMBI - Fast Food</h3>
                    <p>N° : {venteDetails.vente.numero}</p>
                    <p>Date : {new Date(venteDetails.vente.date).toLocaleString()}</p>
                    <p>Montant Total : {venteDetails.vente.montant} F</p>
                    <hr />
                  </div>
                  {/* Table des lignes de vente */}
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Article</th>
                        <th>Qté</th>
                        <th>Unité</th>
                        <th>PU</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {venteDetails.lignes.map((ligne) => (
                        <tr key={ligne.id}>
                          <td>{ligne.designation || "Produit #" + ligne.produit_id}</td>
                          <td>{ligne.quantite}</td>
                          <td>{ligne.unite}</td>
                          <td>{ligne.prix_unitaire} F</td>
                          <td>{ligne.montligne} F</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>Chargement des détails de la vente...</p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={() => setShowModal(false)}>
                Fermer
              </Button>
              <Button
                variant="info"
                onClick={printModalContent} // Impression
              >
                Imprimer
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </LayoutFastfood2 >
  );
};

export default Vente;
