import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Dashboardvendeur from '@/components/Dashboardvendeur';
import Copyright from '@/components/Copyright';
import { AuthContext } from '@/context/authContext';
import Layout from '@/components/LayoutRh';

export default function Dashboard() {
  const router = useRouter();
  const { name, profil } = router.query;
  const [userRole, setUserRole] = useState('');

  const {currentUser } = useContext(AuthContext)
  
  /*useEffect(() => {
    if (!currentUser) {
      router.push('/Login'); // Redirige si l'utilisateur n'est pas connecté
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return <p>Chargement...</p>;
  }*/

  /*useEffect(() => {
    if (name) {
      alert(`Bienvenue, ${name} !`);
    }
    console.log(currentUser)
  }, [name]);*/

  /*useEffect(() => {
    console.log("Current user in Dashboard:", currentUser);
  }, [currentUser]);*/
  return(
    <Layout>
		<div class="row g-3 mb-3 row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-2 row-cols-xl-4">
                        <div class="col" hidden>
                            <div class="alert-success alert mb-0">
                                <div class="d-flex align-items-center">
                                    <div class="avatar rounded no-thumbnail bg-success text-light"><i class="fa fa-dollar fa-lg"></i></div>
                                    <div class="flex-fill ms-3 text-truncate">
                                        <div class="h6 mb-0">Revenue</div>
                                        <span class="small">$18,925</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col" hidden>
                            <div class="alert-danger alert mb-0">
                                <div class="d-flex align-items-center">
                                    <div class="avatar rounded no-thumbnail bg-danger text-light"><i class="fa fa-credit-card fa-lg"></i></div>
                                    <div class="flex-fill ms-3 text-truncate">
                                        <div class="h6 mb-0">Expense</div>
                                        <span class="small">$11,024</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col" hidden>
                            <div class="alert-warning alert mb-0">
                                <div class="d-flex align-items-center">
                                    <div class="avatar rounded no-thumbnail bg-warning text-light"><i class="fa fa-smile-o fa-lg"></i></div>
                                    <div class="flex-fill ms-3 text-truncate">
                                        <div class="h6 mb-0">Happy Clients</div>
                                        <span class="small">8,925</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col" hidden>
                            <div class="alert-info alert mb-0">
                                <div class="d-flex align-items-center">
                                    <div class="avatar rounded no-thumbnail bg-info text-light"><i class="fa fa-shopping-bag" aria-hidden="true"></i></div>
                                    <div class="flex-fill ms-3 text-truncate">
                                        <div class="h6 mb-0">New StoreOpen</div>
                                        <span class="small">8,925</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
    </Layout>
  );
}