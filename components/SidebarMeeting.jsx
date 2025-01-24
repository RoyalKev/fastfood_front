import { AuthContext } from '@/context/authContext'
import React, { useContext } from 'react'
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

const SidebarMeeting = () => {
    const { currentUser } = useContext(AuthContext)
    const router = useRouter();

    // Liste des liens du menu
    const menuItems = [
        { name: 'Tableau de bord', href: '/meeting/Dashboard', icon: 'icofont-home fs-5' },
        { name: 'Directions', href: '/meeting/Direction', icon: 'icofont-cube fs-5' },
        { name: 'Salles de réunion', href: '/meeting/Salle', icon: 'icofont-cube fs-5' },
        { name: 'Réunions', href: '/meeting/Reunion', icon: 'icofont-cube fs-5' },
        { name: 'Tâches', href: '/meeting/Tache', icon: 'icofont-cube fs-5' },
        { name: 'Rendez-vous', href: '/meeting/Rdv', icon: 'icofont-cube fs-5' },
        { name: 'Courriers', href: '/meeting/Courrier', icon: 'icofont-envelope-open fs-5' },
        { name: 'Utilisateurs', href: '/Utilisateur', icon: 'icofont-funky-man fs-5' },
    ];

    return (
        <div className="sidebar px-4 py-4 py-md-4 me-0">
            <div className="d-flex flex-column h-100">
                <a href="/StartPage" className="mb-0 brand-icon">
                    <span className="logo-icon">
                        <i className="bi bi-bag-check-fill fs-4"></i>
                    </span>
                    <span className="logo-text" style={{ marginLeft:'-15px' }}>
                    <Image src="/logo.png" alt="Logo" width={210} height={70} />
                    </span>
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

export default SidebarMeeting