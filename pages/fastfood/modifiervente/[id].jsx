import LayoutFastfood from '@/components/LayoutFastfood';
import LayoutFastfood2 from '@/components/LayoutFastfood2';
import { StaticIP } from '@/config/staticip';
import { AuthContext } from '@/context/authContext';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button } from "react-bootstrap";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useRouter } from 'next/router';

const ModifierVente = () => {

    const router = useRouter();
    const { id } = router.query; // Récupère l'id passé en paramètre  

    const [ligneventes, setLigneventes] = useState([]);
    const [vente, setVente] = useState([]);
    const [tabledata, setTabledata] = useState([]);
    useEffect(() => {
        if (id) {
            axios.get(`${StaticIP}api/vente/ligne_ventes/${id}`)
                .then(response => {
                    setLigneventes(response.data);
                    //settotalvente(response.data.totalvente);
                }).catch(error => {
                    console.error("Erreur lors de la récupération des ventes :", error);
                })
            axios.get(`${StaticIP}api/vente/vente/${id}`)
            .then(response => {
                setVente(response.data);
                setVenteType(response.data.type_vente)
                setSelectedTable(response.data.table_id)
                setmontantlivraison(response.data.montantlivraison)
                setreduction(response.data.reduction)
                setTabledata(response.data.table)
                console.log(tabledata)
                //settotalvente(response.data.totalvente);
            }).catch(error => {
                console.error("Erreur lors de la récupération de la vente :", error);
            })
        }
    }, [id]);

    // CHARGEMENT DES LIGNES DE VENTE DANS LE PANIER
    const loadVenteDansPanier = () => {
        const lignesTransformees = ligneventes.map((item) => ({
            id: item.produit_id, // ou item.produit.id si tu as inclus le produit
            designation: item.produit?.designation || 'Produit inconnu',
            quantity: item.quantite,
            unite: item.unite,
            prix: item.prix_unitaire,
        }));

        setCart(lignesTransformees);
    };
    useEffect(() => {
        if (ligneventes.length > 0) {
            loadVenteDansPanier();
        }
    }, [ligneventes]);
    //FIN CHARGEMENT DES LIGNES DE VENTE

    const [categories, setcategories] = useState([]);
    const [venteType, setVenteType] = useState('Simple');
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState('');
    const [montantlivraison, setmontantlivraison] = useState(0);
    const [reduction, setreduction] = useState(0);
    useEffect(() => {
        if (venteType === "GOZEM") {
            setmontantlivraison(500);
        } else {
            setmontantlivraison(0);
        }
    }, [venteType]);
    // Récupération des catégories
    const fetchcategories = async () => {
        try {
            const response = await axios.get(`${StaticIP}api/categorie/liste2`);
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
        fetchcategories();
    }, []);

    const [produits, setproduits] = useState([]);
    const fetchproduits = async () => {
        try {
            const response = await axios.get(`${StaticIP}api/uniteconversion/liste2`);
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
        fetchproduits();
    }, []);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // Champ de recherche
    const [cart, setCart] = useState(ligneventes);

    // Filtrer les produits par catégorie et par recherche sur la désignation
    const filteredproduits = produits.filter(
        (produit) =>
            (selectedCategory === null || produit.categorie_id === selectedCategory) &&
            produit.designation.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Ajouter un produit au panier
    const addToCart = (produit) => {
        const existingItem = cart.find(
            (item) => item.id === produit.id && item.ulibelle === produit.ulibelle
        );
        if (existingItem) {
            setCart(
                cart.map((item) =>
                    item.id === produit.id && item.ulibelle === produit.ulibelle
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );
        } else {
            setCart([...cart, { ...produit, quantity: 1 }]);
        }
    };

    // Modifier la quantité dans le panier
    const updateQuantity = (id, unite, delta) => {
        setCart(
            cart
                .map((item) =>
                    item.id === id && item.unite === unite
                        ? { ...item, quantity: item.quantity + delta }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    // Calculer le total
    const calculateTotal = () => {
        const totalPanier = cart.reduce((total, item) => total + item.prix * item.quantity, 0);
        return totalPanier + montantlivraison - reduction;
    };

    const { currentUser } = useContext(AuthContext);
    const [userid, setuserId] = useState(null);
    useEffect(() => {
        if (currentUser) {
            setuserId(currentUser.id);
        }
    }, [currentUser]);

    const [error2, seterror2] = useState([]);
    const handleSubmit = async (e) => {
        if (cart.length === 0) {
            alert("Le panier est vide !");
            return;
        }
        e.preventDefault();
        try {
            const venteData = {
                date: new Date(),
                statut: "En cours",
                montant: calculateTotal(),
                userid: userid,
                lignes: cart.map((item) => ({
                    produit_id: item.id,
                    prix_unitaire: item.prix,
                    quantite: item.quantity,
                    unite: item.unite,
                    montligne: item.prix * item.quantity,
                    userid: userid,
                })),
            };
            const response = await axios.put(`${StaticIP}api/vente/modifier/${id}`, 
                { venteData, venteType, selectedTable, montantlivraison, reduction });
            if (response.status === 201) {
                toast.success('Vente modifiée avec succès !');
                setCart([]);
                seterror2([]);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.erreurs) {
                // Affiche chaque erreur dans un toast séparé (ou une seule concaténée)
                error.response.data.erreurs.forEach((err) => {
                    toast.error(err);
                });
            } else {
                // Erreur inconnue
                toast.error("Une erreur est survenue !");
            }
        }

    };

    const [showModal, setShowModal] = useState(false);
    const [venteDetails, setVenteDetails] = useState(null);

    const fetchDerniereVente = async () => {
        try {
            const response = await axios.get(`${StaticIP}api/vente/derniere_vente/${userid}`);
            setVenteDetails(response.data);
            setShowModal(true);
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

        const printWindow = window.open('', '_blank');

        if (!printWindow) {
            console.error("Impossible d'ouvrir une nouvelle fenêtre pour l'impression !");
            return;
        }

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
                width: 80mm;
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
          ${printableArea.innerHTML}
        </body>
      </html>
    `);

        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    };

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const response = await axios.get(`${StaticIP}api/table/liste`);
                setTables(response.data.Result);
            } catch (err) {
                console.error("Erreur lors de la récupération des tables", err);
            }
        };
        fetchTables();
    }, []);

    return (
        <LayoutFastfood2>
            <div className="row" style={{ marginTop: '-35px' }}>
                {/* Catégories */}
                <div className="col-md-2">
                    <nav className='sticky-sidebar'>
                        <button className='btn btn-secondary w-100 mb-1'
                            onClick={() => setSelectedCategory(null)}
                            style={{ cursor: "pointer" }}>
                            TOUTES
                        </button>
                        {categories.map((category) => (
                            <button className='btn btn-secondary w-100 mb-1' key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                style={{ cursor: "pointer", textAlign: 'left' }}>
                                {category.libelle}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Produits */}
                <div className="col-md-7">
                    <nav className='sticky-sidebar'>
                        {/* Champ de recherche */}
                        <div className="mb-3">
                            <input
                                type="text"
                                placeholder="Recherche par désignation..."
                                className="form-control"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div className="row">
                            {filteredproduits.map((produit) => (
                                <div className="col-md-3 mb-1" key={`${produit.id}-${produit.designation}`} style={{ backgroundColor: 'fdfdfd' }}
                                    onClick={() => addToCart(produit)}>
                                    <div className="card">
                                        <div className="card-body">
                                            <h6 className="card-title" style={{ fontSize: '11px', fontWeight: '700' }}>
                                                {produit.designation}
                                            </h6>
                                            <p className="card-text">
                                                <span className='badge bg-primary'>{produit.unite}</span> - {produit.prix} F
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </nav>
                </div>

                {/* Panier */}
                <div className="col-md-3">
                    <div className='card sticky-sidebar-panier' style={{ backgroundColor: '#f1f1f1' }}>
                        <nav className='sticky-sidebar'>
                            <form onSubmit={handleSubmit}>

                                <div className='card-body'>
                                    {cart.length > 0 ? (
                                        <ul className="list-group" style={{ marginTop: '-15px' }}>
                                            {cart.map((item) => (
                                                <li style={{ fontSize: '12px', margin: '0', width: '113%', marginLeft: '-15px' }}
                                                    className="list-group-item d-flex justify-content-between align-items-center"
                                                    key={`${item.id}-${item.unite}`}
                                                >
                                                    <div>
                                                        <strong>{item.designation}</strong>
                                                        <br />
                                                        Qté : <font color="red"><b>{item.quantity}</b></font> - {item.unite}
                                                    </div>
                                                    <div>
                                                        <button type='button'
                                                            className="btn btn-sm btn-success me-2"
                                                            onClick={() => updateQuantity(item.id, item.unite, 1)}
                                                        >
                                                            +
                                                        </button>
                                                        <button type='button'
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => updateQuantity(item.id, item.unite, -1)}
                                                        >
                                                            -
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span>Votre panier ne contient aucun produit.</span>
                                    )}
                                </div>
                                <div className='card-footer'>
                                    {cart.length > 0 &&
                                        <>
                                            <div className="mb-3">
                                                <h5 style={{ fontSize: '13px', fontWeight: '700' }}>Type de vente :</h5>
                                                {['Simple', 'Emporté', 'GOZEM', 'VIP', 'Table'].map((type) => (
                                                    <label key={type} className="me-3">
                                                        <input
                                                            type="radio"
                                                            name="venteType"
                                                            value={type}
                                                            checked={venteType === type}
                                                            onChange={() => setVenteType(type)}
                                                        /> {type}
                                                    </label>
                                                ))}
                                            </div>
                                            {venteType === 'Table' && (
                                                <div className="mb-3">
                                                    <label> <b>Référence de la table :</b></label>
                                                    <select
                                                        className="form-control"
                                                        value={selectedTable}
                                                        onChange={(e) => setSelectedTable(e.target.value)}
                                                    >
                                                        <option value={vente.table_id}> {tabledata.reference} - {tabledata.emplacement}</option>
                                                        {tables.map((table) => (
                                                            <option key={table.id} value={table.id}>{table.reference}-{table.emplacement}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                            <div className="mb-3">
                                                <label>Réduction :</label>
                                                <input className="form-control" value={reduction} onChange={(e) => setreduction(e.target.value)}/>
                                            </div>
                                            <h5 className="mt-3" style={{ color: '#c92047', fontWeight: '600', textAlign: 'right' }}>
                                                Total : {calculateTotal()} F
                                            </h5>
                                            <button className="btn btn-warning w-100 mt-2">
                                                <i className="icofont-plus-circle"></i> Créer la commande
                                            </button>
                                        </>
                                    }
                                </div>
                            </form>
                        </nav>
                    </div>

                    <br />
                    <div className='row' hidden>
                        <div className='col-lg-4 col-md-12 col-xs-12'>
                            <div className='card'>
                                <button className="btn btn-info" onClick={fetchDerniereVente}>
                                    <i className="icofont-list"></i> Facture
                                </button>
                            </div>
                        </div>
                        <div className='col-lg-4 col-md-12 col-xs-12'>
                            <div className='card'>
                                <a className="btn btn-primary" href='/fastfood/VenteDuJourCaissier'>
                                    <i className="icofont-home"></i> J.Caisse
                                </a>
                            </div>
                        </div>
                        <div className='col-lg-4 col-md-12 col-xs-12'>
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
                <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Facture vente</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {venteDetails ? (
                            <div id="printable-area">
                                <div className="text-center mb-4">
                                    <h3>MALUMBI - Fast Food</h3>
                                    <p>N° : {venteDetails.vente.numero}</p>
                                    <p>Date : {new Date(venteDetails.vente.date).toLocaleString()}</p>
                                    <hr />
                                </div>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Article</th>
                                            <th>Qté</th>
                                            <th>PU</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {venteDetails.lignes.map((ligne) => (
                                            <tr key={ligne.id}>
                                                <td> {ligne.produit?.designation || "Produit #" + ligne.produit_id} - [{ligne.unite}]</td>
                                                <td>{ligne.quantite}</td>
                                                <td>{ligne.prix_unitaire.toLocaleString()} F</td>
                                                <td>{ligne.montligne.toLocaleString()} F</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td>Total</td>
                                            <td><b>{(venteDetails.vente.montant).toLocaleString()}</b></td>
                                        </tr>
                                    </tfoot>
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
                        <Button variant="info" onClick={printModalContent}>
                            Imprimer
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </LayoutFastfood2>
    );
};

export default ModifierVente;
