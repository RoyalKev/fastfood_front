import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '@/context/authContext';


const HeaderUser = () => {
    const {currentUser, logout} = useContext(AuthContext)
    const router = useRouter();

  return ( 
        <div className="order-0 col-lg-4 col-md-4 col-sm-12 col-12 mb-3 mb-md-0 ">
            <div className="input-group flex-nowrap input-group-lg">
                <input type="search" className="form-control" placeholder="Rechercher" aria-label="search" aria-describedby="addon-wrapping"/>
                <button type="button" className="input-group-text" id="addon-wrapping"><i className="icofont-search"></i></button>
            </div>
        </div>
  )
}

export default HeaderUser