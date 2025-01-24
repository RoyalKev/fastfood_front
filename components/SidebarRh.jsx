import { AuthContext } from '@/context/authContext'
import React, { useContext } from 'react'
import { useRouter } from 'next/router';
import Link from 'next/link';

const Sidebar = () => {
    const { currentUser } = useContext(AuthContext)
    const router = useRouter();

    // Liste des liens du menu
    const menuItems = [
        { name: 'Tableau de bord', href: '/Dashboard', icon: 'icofont-home fs-5' },
        { name: 'Banques', href: '/rh/Banque', icon: 'icofont-funky-man fs-5' },
        { name: 'Départements', href: '/rh/Departement', icon: 'icofont-funky-man fs-5' },
        { name: 'Niveaux', href: '/rh/Niveaux', icon: 'icofont-funky-man fs-5' },
        { name: 'Catégories', href: '/rh/CategorieEmploye', icon: 'icofont-funky-man fs-5' },
        { name: 'Grille salariale', href: '/rh/GrilleSalariale', icon: 'icofont-funky-man fs-5' },
        { name: 'Postes', href: '/rh/Poste', icon: 'icofont-funky-man fs-5' },
        { name: 'Employes', href: '/rh/Employe', icon: 'icofont-funky-man fs-5' },
        { name: 'Contrats', href: '/rh/Contrat', icon: 'icofont-funky-man fs-5' },
    ];



    return (
        <div className="sidebar px-4 py-4 py-md-4 me-0">
            <div className="d-flex flex-column h-100">
                <a href="/StartPage" className="mb-0 brand-icon">
                    <span className="logo-icon">
                        <i className="bi bi-bag-check-fill fs-4"></i>
                    </span>
                    <span className="logo-text">ERP KBE</span>
                </a>
                <ul className="menu-list flex-grow-1 mt-3">
                    {menuItems.map((item) => {
                        // Déterminez si l'élément est actif
                        const isActive = router.pathname === item.href;
                        return (
                            <li key={item.href} className={isActive ? 'active' : ''}>
                                <Link href={item.href} className={isActive ? 'm-link active' : 'm-link'}>
                                    <i className={item.icon}></i> {item.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

            </div>
        </div>
    )
}

export default Sidebar