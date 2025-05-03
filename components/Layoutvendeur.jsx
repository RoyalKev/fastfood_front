import {React, useState, useEffect }  from 'react'
import Header from './Header'
import Topbar from './Topbar'
import Sidebarvendeur from './SidebarRh';
import Loader from './Loader';
import { useRouter } from 'next/router';
import Copyright from './Copyright';
//import { Link, Outlet, useNavigate, useLocation } from "react-router-dom"

const Layoutvendeur = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    useEffect(() => {
        // Affiche le loader au début du changement de route
        const handleStart = () => setLoading(true);
        // Cache le loader à la fin du changement de route
        const handleComplete = () => setLoading(false);
    
        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);
    
        // Nettoyage des écouteurs d'événements
        return () => {
          router.events.off('routeChangeStart', handleStart);
          router.events.off('routeChangeComplete', handleComplete);
          router.events.off('routeChangeError', handleComplete);
        };
      }, [router]);
    return (
    
    <>
        {loading && <Loader />}
        <div id="main-wrapper">
            <Topbar/>
                <div className="clearfix"></div>
                <div class="dashboard-wrap" style={{ backgroundColor: '#e3f4f3'}}>
                    <a className="mobNavigation btn btn-primary" data-bs-toggle="collapse" href="#MobNav" role="button" aria-expanded="false" aria-controls="MobNav">
                        <i className="fas fa-bars me-2"></i>Dashboard Navigation
                    </a>
                    <Sidebarvendeur/>
                    <div className="dashboard-content" style={{ backgroundColor: '#e3f4f3'}}>
                    {children}
                    <br/>
                    <Copyright/>
                    </div>
                </div>
        </div>
    </>
)}

export default Layoutvendeur