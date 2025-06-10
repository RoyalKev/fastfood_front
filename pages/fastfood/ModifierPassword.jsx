import BreadCrumb from '@/components/BreadCrumb';
import CardTitle from '@/components/CardTitle';
import Input from '@/components/Input';
import Layout from '@/components/LayoutRh'
import { AuthContext } from '@/context/authContext';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button } from "react-bootstrap";
import LayoutMeeting from '@/components/LayoutMeeting';
import { StaticIP } from '@/config/staticip';
import LayoutFastfood from '@/components/LayoutFastfood';
import Link from 'next/link';

const ModifierPassword = () => {

    const router = useRouter();

    //Pour la liste des utilisateurs
    const [error, setError] = useState(null);
    //FIN LISTE

    

    const { currentUser } = useContext(AuthContext)
    const [userid, setuserId] = useState(null)
    const [loading, setLoading] = useState(false);

    const [dataUtilisateur, setDataUtilisateur] = useState({
        password: '',
        confirmpassword: 123456,
    })

    // Utilisez useEffect pour définir l'ID utilisateur une seule fois
    useEffect(() => {
        if (currentUser) {
            setuserId(currentUser.id);
        }
    }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('password', dataUtilisateur.password);
        formData.append('confirmpassword', dataUtilisateur.confirmpassword);
        setLoading(true);
        try {
            const response = await axios.put(`${StaticIP}api/auth/updatepassword/${userid}`, formData);
            console.log('la réggg :', response.data)
            if (response.data.Status) {
                toast.success('Mot de passe modifié avec succès !');
                setTimeout(() => {
                    setLoading(false);
                    window.location.reload(); // Rechargement de la page
                    //router.push('/NouveauBoutique');
                }, 2000);
            } else {
                toast.error(response.data.Error);
                setLoading(false);
            }
        } catch (err) {
            setLoading(false);
            console.log(err)
            if (err.response && err.response.data) {
                // Si l'erreur est liée à un type de fichier non supporté
                toast.error(err.response.data.message || 'Erreur lors de la modif du mot de passe');
            } else {
                console.log(err)
                toast.error('Une erreur est survenue');
            }
        }
    };

    return (
        <LayoutFastfood>
            <BreadCrumb titre="mise à jour de mot de passe" />
            <div className="row g-3 mb-3">
                <div className="col-xl-4 col-lg-4">
                    <div className="sticky-lg-top">
                        <div className="card mb-3">
                            <CardTitle title="Nouveau" />
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3 align-items-center">
                                        <div className="col-md-12">
                                            <label className="form-label">Nouveau mot de passe</label>
                                            <input type="text" class="form-control"
                                                name="password" min={6}
                                                onChange={(e) => setDataUtilisateur({ ...dataUtilisateur, password: e.target.value })}
                                                placeholder="Saisir le nouveau mot de passe"
                                            />
                                        </div>
                                        <div className="col-md-12">
                                            <label className="form-label">Confirmer mot de passe</label>
                                            <input type="text" class="form-control"
                                                name="confirmpassword" min={6}
                                                onChange={(e) => setDataUtilisateur({ ...dataUtilisateur, confirmpassword: e.target.value })}
                                                placeholder="Confirmer mot de passe"
                                            />
                                        </div>
                                        <div className="col-md-12">
                                            <button type="submit" className="btn btn-success btn-sm mt-2" disabled={loading}>
                                                <i className='icofont-save'></i> {loading ? 'Enregistrement en cours...' : 'Mettre à jour'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <ToastContainer />
                </div>
            </div>
            {loading && (
                <div className="overlay">
                    <div className="loader"></div>
                </div>
            )}
        </LayoutFastfood>
    )
}

export default ModifierPassword