import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '@/context/authContext';
import Link from 'next/link';


const HeaderPageVente = () => {
    const { currentUser, logout } = useContext(AuthContext)
    const router = useRouter();
    const handleLogout = async (e) => {
        e.preventDefault()
        try {
            await logout()
            router.push('/Login');
        } catch (error) {
            alert('Impossiv', error);
        }
    }

    return (
        <div className="header">
            <nav className="navbar py-4">
                <div className="container-xxl">
                    <div className="h-right d-flex align-items-center mr-5 mr-lg-0 order-1">

                        <div className="dropdown notifications">
                            <Link className="nav-link dropdown-toggle pulse" href="#" role="button"
                                data-bs-toggle="dropdown">
                                <i className="icofont-alarm fs-5" style={{ color: "#fff" }}></i>
                                <span className="pulse-ring"></span>
                            </Link>

                        </div>
                        <div className="dropdown user-profile ml-2 ml-sm-3 d-flex align-items-center zindex-popover">
                            <div className="u-info me-2">
                                <p className="mb-0 text-end line-height-sm ">
                                    <span className="font-weight-bold" style={{ color: "#fff" }}>
                                        {currentUser && currentUser.nom}
                                    </span></p>
                                <small style={{ color: "#ffe489" }}>{currentUser && currentUser.role}</small>
                            </div>

                            <div className="dropdown-menu rounded-lg shadow border-0 dropdown-animation dropdown-menu-end p-0 m-0">
                                <div className="card border-0 w280">
                                    <div className="card-body pb-0">
                                        <div className="d-flex py-1">
                                            <img className="avatar rounded-circle" src="assets/images/profile_av.svg" alt="profile" />
                                            <div className="flex-fill ms-3">
                                                <p className="mb-0"><span className="font-weight-bold" style={{ color: "#fff" }}>{currentUser && currentUser.nom}</span></p>
                                                <small className="" style={{ color: "#fff" }}>{currentUser && currentUser.email}</small>
                                            </div>
                                        </div>

                                        <div><hr className="dropdown-divider border-dark" /></div>
                                    </div>
                                    <div className="list-group m-2 ">
                                        <Link href="#" className="list-group-item list-group-item-action border-0 "><i className="icofont-ui-user fs-5 me-3"></i>Profile Page</Link>
                                        <Link href="#" className="list-group-item list-group-item-action border-0 "><i className="icofont-file-text fs-5 me-3"></i>Order Invoices</Link>
                                        {currentUser &&
                                            <Link href="#" onClick={handleLogout} style={{ cursor: 'pointer' }} className="list-group-item list-group-item-action border-0 ">
                                                <i className="icofont-logout fs-5 me-3"></i>
                                                Déconnexion
                                            </Link>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="setting ms-1">
                            {currentUser &&
                                <button type="button" className="btn btn-danger border lift m-1 ">
                                    <Link href="#" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                                        <i className='icofont-logout fs-5'></i>
                                    </Link>
                                </button>
                            }
                        </div>
                    </div>
                    <button className="navbar-toggler p-0 border-0 menu-toggle order-3" type="button" data-bs-toggle="collapse" data-bs-target="#mainHeader">
                        <span className="fa fa-bars"></span>
                    </button>

                    <div className="container">
                        <div className='row'>
                            <div className='col-lg-3 col-md-3 col-xs-12'>
                                <div className='card'>
                                    <Link className="btn btn-info" href='/fastfood/Dashboard'>
                                        <i className="icofont-home"></i> Accueil
                                    </Link>
                                </div>
                            </div>
                            <div className='col-lg-3 col-md-3 col-xs-12'>
                                <div className='card'>
                                    <Link className="btn btn-outline-danger" href='/fastfood/VenteDuJourCaissier'>
                                    <i className="icofont-file-document"></i> Journal caisse 
                                    </Link>
                                </div>
                            </div>
                            <div className='col-lg-3 col-md-3 col-xs-12'>
                                <div className='card'>
                                    <Link className="btn btn-success" href='/fastfood/VenteValidee'>
                                    <i className="icofont-shopping-cart"></i> Toutes les commandes
                                    </Link>
                                </div>
                            </div>
                            <div className='col-lg-3 col-md-3 col-xs-12'>
                                <div className='card'>
                                    <Link className="btn btn-warning" href='/fastfood/VenteEnCours'>
                                    <i className="icofont-shopping-cart"></i> Commandes en cours 
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </nav>
        </div>

    )
}

export default HeaderPageVente