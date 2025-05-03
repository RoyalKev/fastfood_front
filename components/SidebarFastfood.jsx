import { AuthContext } from '@/context/authContext'
import React, { useContext } from 'react'
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

const SidebarFastfood = () => {
  const { currentUser } = useContext(AuthContext)
  const router = useRouter();

  // Liste des liens du menu avec une propriété "role" optionnelle
  const menuItems = [
    { name: 'Tableau de bord', href: '/fastfood/Dashboard', icon: 'icofont-home fs-5' },
    { name: 'Catégories', href: '/fastfood/Categorie', icon: 'icofont-cube fs-5', role: ['Admin'] },
    { name: 'Tables', href: '/fastfood/Table', icon: 'icofont-cube fs-5', role: ['Admin'] },
    { name: 'Unités de mesure', href: '/fastfood/Unitemesure', icon: 'icofont-cube fs-5', role: ['Admin'] },
    { name: 'Aliment sources', href: '/fastfood/Produit', icon: 'icofont-cube fs-5', role: ['Admin'] },
    { name: 'Produits au seuil de stock', href: '/fastfood/ProduitSeuil', icon: 'icofont-cube fs-5', role: ['Admin'] },
    { name: 'Produits à vendre', href: '/fastfood/UniteConversion', icon: 'icofont-cube fs-5', role: ['Admin'] },
    { name: 'Ventes', href: '/fastfood/Vente', icon: 'icofont-cube fs-5', role: ['User'] },
    { name: 'Ventes en cours', href: '/fastfood/VenteEnCours', icon: 'icofont-cube fs-5', role: ['User'] },
    { name: 'Ventes validées', href: '/fastfood/VenteValidee', icon: 'icofont-cube fs-5', role: ['User'] },
    { name: 'Tendances', href: '/fastfood/Tendances', icon: 'icofont-cube fs-5', role: ['Admin'] },
    { name: 'Appro aliment sources', href: '/fastfood/Appro', icon: 'icofont-cube fs-5', role: ['Admin'] },
    { name: 'Appro Boissons', href: '/fastfood/ApproBoissons', icon: 'icofont-cube fs-5', role: ['Admin'] },
    { name: 'Inventaire P.Source', href: '/fastfood/Inventaire', icon: 'icofont-cube fs-5', role: ['Admin'] },
    { name: 'Inventaire Boissons', href: '/fastfood/Inventaireboisson', icon: 'icofont-cube fs-5', role: ['Admin'] },
    { name: 'Vente du jour', href: '/fastfood/VenteDuJour', icon: 'icofont-cube fs-5', role: ['Admin'] },
    { name: 'Ma Caisse', href: '/fastfood/VenteDuJourCaissier', icon: 'icofont-cube fs-5', role: ['User'] },
    { name: 'Toutes les ventes', href: '/fastfood/ToutesLesVentes', icon: 'icofont-cube fs-5', role: ['Admin'] },
    { name: 'Utilisateurs', href: '/fastfood/Utilisateur', icon: 'icofont-cube fs-5', role: ['Admin'] },
  ];

  // Filtrer les liens en fonction du rôle de l'utilisateur (afficher tous les éléments sans restriction si "role" n'est pas défini)
  const filteredMenuItems = menuItems.filter(item => {
    if (!item.role) return true;
    return currentUser && item.role.includes(currentUser.role);
  });

  return (
    <div className="sidebar px-4 py-4 py-md-4 me-0">
      <div className="d-flex flex-column h-100">
        <a href="/fastfood/Dashboard" className="mb-0 brand-icon">
          <span className="logo-icon">
            <i className="bi bi-bag-check-fill fs-4"></i>
          </span>
          <span className="logo-text" style={{ marginLeft:'-20px' }}>
            <Image src="/logo_es.png" alt="Logo" width={150} height={42} />
          </span>
        </a>
        <ul className="menu-list flex-grow-1 mt-3">
          {filteredMenuItems.map((item) => {
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

export default SidebarFastfood;
