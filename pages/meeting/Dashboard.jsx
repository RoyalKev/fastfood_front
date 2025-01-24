import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Copyright from '@/components/Copyright';
import { AuthContext } from '@/context/authContext';
import LayoutMeeting from '@/components/LayoutMeeting';
import StatistiquesAdmin from '@/components/StatistiquesAdmin';
import HomeStatistiquesAdmin from '@/components/HomeStatistiquesAdmin';

export default function Dashboard() {
  const router = useRouter();
  const { name, profil } = router.query;
  const [userRole, setUserRole] = useState('');

  const { currentUser } = useContext(AuthContext)

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
  return (
    <LayoutMeeting>
      <div class="row g-3 mb-3 row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-2 row-cols-xl-4">
        <div class="col">
          <div class="alert-success alert mb-0">
            <div class="d-flex align-items-center">
              <div class="avatar rounded no-thumbnail bg-success text-light">
                <i className="icofont-meetme"></i></div>
              <div class="flex-fill ms-3 text-truncate">
                <div class="h6 mb-0">Réunions créées</div>
                <span class="small">212</span>
              </div>
            </div>
          </div>
        </div>

        <div class="col">
          <div class="alert-danger alert mb-0">
            <div class="d-flex align-items-center">
              <div class="avatar rounded no-thumbnail bg-danger text-light">
              <i className="icofont-files-stack"></i></div>
              <div class="flex-fill ms-3 text-truncate">
                <div class="h6 mb-0">Tâches créées</div>
                <span class="small">110</span>
              </div>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="alert-warning alert mb-0">
            <div class="d-flex align-items-center">
              <div class="avatar rounded no-thumbnail bg-warning text-light">
              <i className="icofont-envelope"></i></div>
              <div class="flex-fill ms-3 text-truncate">
                <div class="h6 mb-0">Couriers crées</div>
                <span class="small">58</span>
              </div>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="alert-info alert mb-0">
            <div class="d-flex align-items-center">
              <div class="avatar rounded no-thumbnail bg-info text-light">
              <i className="icofont-meeting-add"></i></div>
              <div class="flex-fill ms-3 text-truncate">
                <div class="h6 mb-0">Rendez-vous crées</div>
                <span class="small">43</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h6>Stats de traitement mensuelle des tâches</h6>
            </div>
            <div class="card-body">
                <HomeStatistiquesAdmin/>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div className='row'>
            <div className='col-md-12 mb-2'>
              <div class="card">
                <div class="card-header">
                  <h6>Tâches</h6>
                </div>
                <div class="card-body">

                </div>
              </div>
            </div>
            <div className='col-md-12 mb-2'>
              <div class="card">
                <div class="card-header">
                  <h6>Couriers</h6>
                </div>
                <div class="card-body">

                </div>
              </div>
            </div>
            <div className='col-md-12 mb-2'>
              <div class="card">
                <div class="card-header">
                  <h6>Rendez-vous</h6>
                </div>
                <div class="card-body">

                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

    </LayoutMeeting>
  );
}