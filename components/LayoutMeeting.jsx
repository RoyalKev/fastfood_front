import React from 'react'
import Script from 'next/script';

import '@/styles/css/ebazar.style.min.css';
import '@/styles/css/custom.css';
//import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './Header';
import SidebarMeeting from './SidebarMeeting';

const LayoutMeeting = ({ children }) => (
    <>
        <div id="ebazar-layout" className="theme-blue" style={{ backgroundColor:'#426554' }}>
            <SidebarMeeting />
            <div className="main px-lg-4 px-md-4">
                <Header />
                <div className="body d-flex py-3">
                    <div className="container-xxl">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    </>
);

export default LayoutMeeting