import { AuthContext } from '@/context/authContext';
import Link from 'next/link'
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react'
import '@/styles/css/ebazar.style.min.css';
import '@/styles/css/custom.css';

const MenuPage = () => {
    const { currentUser, logout } = useContext(AuthContext)
    const router = useRouter();
    const [userid, setuserId] = useState(null)
    const handleLogout = async (e) => {
        e.preventDefault()
        try {
                await logout()
                router.push('/Login');
            } catch (error) {
                alert('Impossiv', error);
            }
        }
    useEffect(() => {
        if (currentUser) {
                setuserId(currentUser.id);
        }
    }, [currentUser]);
    
  return (
    <div id="ebazar-layout" className="theme-blue" style={{ backgroundColor:'#034261' }}>
        <div className="main" style={{border:'2px solid #fff'}}>
        <div className="body d-flex py-3">
        <div className="container-xxl">
        <div className="container" style={{marginTop:'90px'}}>
            {
                currentUser && currentUser.role =="Admin" ?
                <>
                <div className='row' style={{marginTop:'10px'}}>
                    <div className='col-lg-4 col-md-4 col-xs-12 mt-3'>
                        <div className='card'>
                            <Link className="btn btn-dark" href='/fastfood/Dashboard'>
                                <i className="icofont-home"></i> Tableau de bord  vue d'ensemble
                            </Link>
                        </div>
                    </div>
                    <div className='col-lg-4 col-md-4 col-xs-12 mt-3'>
                        <div className='card'>
                            <Link className="btn btn-dark" href='/fastfood/Categorie'>
                                <i className="icofont-home"></i> Gestion des Catégories
                            </Link>
                        </div>
                    </div>
                    <div className='col-lg-4 col-md-4 col-xs-12 mt-3'>
                        <div className='card'>
                            <Link className="btn btn-dark" href='/fastfood/Table'>
                                <i className="icofont-home"></i> Gestion des Tables
                            </Link>
                        </div>
                    </div>
                    
                </div>

                    <div className='row' style={{marginTop:'10px'}}>
                        <div className='col-lg-4 col-md-4 col-xs-12 mt-3'>
                        <div className='card'>
                            <Link className="btn btn-dark" href='/fastfood/Produit'>
                                <i className="icofont-home"></i> Créer/Liste des Aliments sources
                            </Link>
                        </div>
                    </div>
                    <div className='col-lg-4 col-md-4 col-xs-12 mt-3'>
                        <div className='card'>
                            <Link className="btn btn-dark" href='/fastfood/UniteConversion'>
                                <i className="icofont-home"></i> Produits à vendre (Boissons / Plats)
                            </Link>
                        </div>
                    </div>
                    <div className='col-lg-4 col-md-4 col-xs-12mt-3'>
                        <div className='card'>
                            <Link className="btn btn-dark" href='/fastfood/Appro'>
                                <i className="icofont-home"></i> Appro. aliment sources
                            </Link>
                        </div>
                    </div>
                    
                    </div>

                    <div className='row' style={{marginTop:'10px'}}>
                        <div className='col-lg-4 col-md-4 col-xs-12 mt-3'>
                        <div className='card'>
                            <Link className="btn btn-dark" href='/fastfood/ApproBoissons'>
                                <i className="icofont-home"></i> Approvision. Boissons
                            </Link>
                        </div>
                    </div>
                    <div className='col-lg-4 col-md-4 col-xs-12 mt-3'>
                        <div className='card'>
                            <Link className="btn btn-dark" href='/fastfood/Inventaire'>
                                <i className="icofont-home"></i> Inventaire aliments sources
                            </Link>
                        </div>
                    </div>
                    <div className='col-lg-4 col-md-4 col-xs-12 mt-3'>
                        <div className='card'>
                            <Link className="btn btn-dark" href='/fastfood/Inventaireboisson'>
                                <i className="icofont-home"></i> Inventaire boissons
                            </Link>
                        </div>
                    </div>
                    

                    </div>

                        <hr/>
                        <div className='row' style={{marginTop:'10px'}}>
                            <div className='col-lg-4 col-md-4 col-xs-12 mt-3'>
                        <div className='card'>
                            <Link className="btn btn-dark" href='/fastfood/Utilisateur'>
                                <i className="icofont-users"></i> Comptes utilisateurs
                            </Link>
                        </div>
                    </div>

                    <div className='col-lg-4 col-md-4 col-xs-12 mt-3'>
                        <div className='card'>
                            <Link className="btn btn-dark" href='/fastfood/ModifierPassword'>
                                <i className="icofont-lock"></i> Modifier mot de passe
                            </Link>
                        </div>
                    </div>
                    <div className='col-lg-4 col-md-4 col-xs-12 mt-3'>
                        <div className='card'>
                            <Link className="btn btn-dark" href='/fastfood/ProduitSeuil'>
                                <i className="icofont-info-circle"></i> Produits au seuil de stock
                            </Link>
                        </div>
                    </div>
                    <div className='col-lg-4 col-md-4 col-xs-12 mt-3'>
                        <div className='card'>
                            <Link className="btn btn-dark" href='/fastfood/Tendances'>
                                <i className="icofont-sale-discount"></i> Tendances pour prévisions
                            </Link>
                        </div>
                    </div>
                    <div className='col-lg-4 col-md-4 col-xs-12 mt-3'>
                        <div className='card'>
                            <Link className="btn btn-dark" href='/fastfood/VenteDuJour'>
                                <i className="icofont-sale-discount"></i> Récap. des Ventes du jour
                            </Link>
                        </div>
                    </div>
                    <div className='col-lg-4 col-md-4 col-xs-12 mt-3'>
                        <div className='card'>
                            <Link className="btn btn-dark" href='/fastfood/ToutesLesVentes'>
                                <i className="icofont-home"></i> Toutes les commandes
                            </Link>
                        </div>
                    </div>
                    </div>
                </>
                :
                <div className='row' style={{marginTop:'10px'}}>
                                    
                                    <div className='col-lg-4 col-md-4 col-xs-12 mt-3'>
                                        <div className='card'>
                                            <Link className="btn btn-dark" href='/fastfood/Vente'>
                                            <i className="icofont-file-document"></i> Nouvelle commande
                                            </Link>
                                        </div>
                                    </div>
                                    <div className='col-lg-4 col-md-4 col-xs-12 mt-3'>
                                        <div className='card'>
                                            <Link className="btn btn-dark" href='/fastfood/VenteDuJourCaissier'>
                                            <i className="icofont-file-document"></i> Journal caisse 
                                            </Link>
                                        </div>
                                    </div>
                                    <div className='col-lg-4 col-md-4 col-xs-12 mt-3'>
                                        <div className='card'>
                                            <Link className="btn btn-dark" href='/fastfood/VenteValidee'>
                                            <i className="icofont-shopping-cart"></i> Toutes les commandes 
                                            </Link>
                                        </div>
                                    </div>
                                    <div className='col-lg-4 col-md-4 col-xs-12 mt-3'>
                                        <div className='card'>
                                            <Link className="btn btn-dark" href='/fastfood/VenteEnCours'>
                                            <i className="icofont-shopping-cart"></i> Commandes en cours 
                                            </Link>
                                        </div>
                                    </div>
                                    <div className='col-lg-4 col-md-4 col-xs-12 mt-3'>
                                        <div className='card'>
                                            <Link className="btn btn-dark" href='/fastfood/ModifierPassword'>
                                                <i className="icofont-lock"></i> Modifier mot de passe
                                            </Link>
                                        </div>
                                    </div>
                                </div>

            }
                                
        </div>
        </div></div>
        </div></div>
  )
}

export default MenuPage