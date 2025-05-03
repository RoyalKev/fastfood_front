import BreadCrumb from '@/components/BreadCrumb';
import VenteBoissonJour from '@/components/Caissier/VenteBoissonJour';
import VentePlatJour from '@/components/Caissier/VentePlatJour';
import LayoutFastfood from '@/components/LayoutFastfood';
import { AuthContext } from '@/context/authContext';
import React, { useContext, useEffect } from 'react'

const VenteDuJourCaissier = () => {
  return (
    <LayoutFastfood>
            <BreadCrumb titre="ventes du jour" />
            <div className="row g-3 mb-3">
            <div class="col-xl-6 col-lg-6">
                    <div className="card">
                        <div class="card-header">
                            <h6>Ventes du jour : Plat </h6>
                        </div>
                        <div class="card-body">
                            <VentePlatJour />
                        </div>

                    </div>
                </div>
                <div class="col-xl-6 col-lg-6">
                    <div className="card">
                        <div class="card-header">
                            <h6>Ventes du jour : Boisson  </h6>
                        </div>
                        <div class="card-body">
                            <VenteBoissonJour />
                        </div>

                    </div>
                </div>
            </div>
        </LayoutFastfood>
  )
}

export default VenteDuJourCaissier