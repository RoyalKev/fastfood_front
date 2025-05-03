import BreadCrumb from '@/components/BreadCrumb'
import LayoutFastfood from '@/components/LayoutFastfood'
import VenteBoissonJour from '@/components/Admin/VenteBoissonJour'
import VentePlatJour from '@/components/Admin/VentePlatJour'
import VentesJour from '@/components/Admin/VentesJour'
import React from 'react'

const VenteDuJour = () => {
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

export default VenteDuJour