import { AuthContext } from '@/context/authContext'
import React, { useContext } from 'react'
import { useRouter } from 'next/router';
import Link from 'next/link';

const Topbar = () => {
    const {currentUser, logout} = useContext(AuthContext)
    const router = useRouter();
    const handleLogout = async (e) =>{
        e.preventDefault()
        try {
          await logout()
          router.push('/Login');
        }catch (error) {
              alert('Impossiv', error);
            }
      }
  return (
    <>
        <div className="header header-light head-fixed">
				<div className="container-fluid">
					<nav id="navigation" className="navigation navigation-landscape">
						<div className="nav-header">
							<a className="nav-brand" href="#">
								NOTRE LOGO
							</a>
							
						</div>
						
						<div className="nav-menus-wrapper">
							<ul className="nav-menu">
								
								<li className="mob-addproject"><a className="add" href="post-job.html">Post Your Job</a></li>
								
							</ul>

							<ul className="nav-menu nav-menu-social align-to-right">
                            <li>
									<div className="btn-group account-drop drk">
										<a href="#" className="nav-link btn-order-by-filt border-0 pe-3" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
											<div className="d-inline-flex w-10 h-10 circle overflow-hidden"><img src="assets/img/com-3.png" class="img-fluid" alt=""/></div>
											<span className="fw-medium d-inline-flex ms-2">
                                                Bienvenue,
                                            <i class="fa-solid fa-sort-down ms-1"></i></span>
										</a>
										
									</div>
								</li>
                                { currentUser &&
                                    <li className="list-buttons">
                                        
                                            <a onClick={handleLogout} style={{ cursor: 'pointer' }}>
                                                Déconnexion
                                            </a>
                                    </li>
                                }
								
							</ul>
						</div>
					</nav>
				</div>
			</div>
    </>
  )
}

export default Topbar