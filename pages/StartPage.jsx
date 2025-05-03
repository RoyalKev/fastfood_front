import { AuthContext } from '@/context/authContext'
import React, { useContext, useState } from 'react'
import { useRouter } from 'next/router';
import Link from 'next/link';

import '@/styles/css/ebazar.style.min.css';
import '@/styles/css/custom.css';
import Image from 'next/image';
const StartPage = () => {
    const [loading, setLoading] = useState(false);
    const { currentUser, logout } = useContext(AuthContext)
    const router = useRouter();
    const handleLogout = async (e) => {
        e.preventDefault()
        try {
            await logout()
            router.push('/Login');
        } catch (error) {
            alert('Impossiv', error);
        }
    }
    return (
        <div className="body d-flex py-lg-3 py-md-2">
            <div className="container-xl">
                <div className="col-12 mt-5">
                    <div className="card mb-3" style={{ backgroundColor: '#05625b' }}>
                        <div className="card-body text-center p-5">
                            <Image src="/meeting.png" alt="Logo" width={400} height={238} />
                            <div className="mt-4 mb-2">
                                <span className="text-muted">Organia</span>
                            </div>
                            <button type="button" className="btn btn-white border lift mt-1 btn-lg p-3 m-1" hidden>
                                <a href='/Dashboard'>
                                    <i className='icofont-funky-man fs-5'></i> Gestion des Ressources Humaines (RH)
                                </a>
                            </button>
                            <button type="button" className="btn btn-white border lift mt-1 btn-lg p-3 m-1"
                                style={{ backgroundColor: '#fff' }}>
                                <Link href='/meeting/Dashboard'>
                                    <i className='icofont-meeting-add fs-5'></i> Organia : Gestion des Réunions, Taches, Courriers, RDV...
                                </Link>
                            </button>

                            {currentUser &&
                                <button type="button" className="btn btn-danger border lift btn-lg p-3 m-1 ">
                                    <a onClick={handleLogout} style={{ cursor: 'pointer' }}>
                                        <i className='icofont-logout fs-5'></i> Déconnexion
                                    </a>
                                </button>
                            }
                        </div>
                    </div>
                </div>
            </div>
            {loading && (
                <div className="overlay">
                    <div className="loader"></div>
                </div>
            )}
        </div>
    )
}

export default StartPage