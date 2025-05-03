import React, { useContext } from 'react'
import Script from 'next/script';

import '@/styles/css/ebazar.style.min.css';
import '@/styles/css/custom.css';
//import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './Header';
import SidebarFastfood from './SidebarFastfood';
import { AuthContext } from '@/context/authContext';
import HeaderPageVente from './HeaderPageVente';

const LayoutFastfood2 = ({ children }) => (
    
    <>
        <div id="ebazar-layout" className="theme-blue" style={{ backgroundColor:'#034261' }}>
            <div className="main" style={{border:'2px solid #fff'}}>
                <HeaderPageVente />
                <div className="body d-flex py-3">
                    <div className="container-xxl">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    </>
);

export default LayoutFastfood2