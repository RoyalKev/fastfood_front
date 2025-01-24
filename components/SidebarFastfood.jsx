import { AuthContext } from '@/context/authContext'
import React, { useContext } from 'react'
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

const SidebarFastfood = () => {
    const { currentUser } = useContext(AuthContext)
    const router = useRouter();

    // Liste des liens du menu
    const menuItems = [
        { name: 'Tableau de bord', href: '/fastfood/Dashboard', icon: 'icofont-home fs-5' },
        { name: 'Catégories', href: '/fastfood/Categorie', icon: 'icofont-cube fs-5' },
        { name: 'Unités de mesure', href: '/fastfood/Unitemesure', icon: 'icofont-cube fs-5' },
        { name: 'Produits', href: '/fastfood/Produit', icon: 'icofont-cube fs-5' },
        { name: 'Produits convertis', href: '/fastfood/UniteConversion', icon: 'icofont-cube fs-5' },
        { name: 'Ventes', href: '/fastfood/Vente', icon: 'icofont-cube fs-5' },
    ];

    return (
        <div className="sidebar px-4 py-4 py-md-4 me-0">
            <div className="d-flex flex-column h-100">
                <a href="/fastfood/Dashboard" className="mb-0 brand-icon">
                    <span className="logo-icon">
                        <i className="bi bi-bag-check-fill fs-4"></i>
                    </span>
                    <span className="logo-text" style={{ marginLeft:'-15px' }}>
                    <Image src="/logo_es.png" alt="Logo" width={210} height={62} />
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

export default SidebarFastfood