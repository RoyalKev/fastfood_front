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

const Utilisateur = () => {

    const router = useRouter();

    //Pour la liste des utilisateurs
    const [utilisateurs, setutilisateurs] = useState([]);
    const [directions, setdirections] = useState([]);
    const [error, setError] = useState(null);
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Récupération des utilisateurs avec pagination
    const fetchutilisateurs = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get(`${StaticIP}api/auth/liste`);
            if (response.data.Status) {
                setutilisateurs(response.data.Result);
                setTotalPages(response.data.Pagination.totalPages);
                setCurrentPage(response.data.Pagination.currentPage);
            } else {
                setError("Erreur lors de la récupération des utilisateurs");
            }
        } catch (err) {
            setError("Une erreur est survenue lors de la récupération des utilisateurs");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchutilisateurs(currentPage);
    }, [currentPage]);

    const goToPage = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    // Récupération des directions
    const fetchdirections = async (e) => {
        setLoading(true);
        try {
            const response = await axios.get(`${StaticIP}api/direction/liste`);
            if (response.data.Status) {
                setdirections(response.data.Result);
            } else {
                setError("Erreur lors de la récupération des directions");
            }
        } catch (err) {
            setError("Une erreur est survenue lors de la récupération des directions");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchdirections(directions);
    }, []);
    //FIN LISTE

    //POUR LA SUPPRESSION
    const [showModal, setShowModal] = useState(false);
    const [selectedUtilisateur, setselectedUtilisateur] = useState(null);
    const handleDelete = async () => {
        if (!selectedUtilisateur) return;
        try {
            const response = await axios.delete(`${StaticIP}api/auth/supprimer/${selectedUtilisateur.id}`);
            if (response.data.Status) {
                setutilisateurs(utilisateurs.filter((user) => user.id !== selectedUtilisateur.id));
                setShowModal(false);
                toast.success("Utilisateur supprimé avec succès !");
            } else {
                toast.error("Erreur : " + response.data.message);
            }
        } catch (err) {
            setShowModal(false);
            console.error("Erreur lors de la suppression :", err.response.data.message);
            toast.error("Suppression impossible, cet utilisateur est lié à certaines données");
        }
    };
    //FIN SUPPRESSION

    const { currentUser } = useContext(AuthContext)
    const [userid, setuserId] = useState(null)
    const [loading, setLoading] = useState(false);

    const [dataUtilisateur, setDataUtilisateur] = useState({
        nom: '',
        email: '',
        role: '',
        password: 123456,
        userid: null,
    })

    // Utilisez useEffect pour définir l'ID utilisateur une seule fois
    useEffect(() => {
        if (currentUser) {
            setuserId(currentUser.id);
            setDataUtilisateur((prev) => ({ ...prev, userid: currentUser.id }));
        }
    }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('userid', dataUtilisateur.userid);
        formData.append('password', dataUtilisateur.password);
        formData.append('nom', dataUtilisateur.nom);
        formData.append('email', dataUtilisateur.email);
        formData.append('role', dataUtilisateur.role);
        /*for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }*/
        //if (logo_Boutique) formData.append('logo_Boutique', logo_Boutique);

        setLoading(true);
        try {
            const response = await axios.post(`${StaticIP}api/auth/nouveau`, formData);
            console.log('la réggg :', response.data)
            if (response.data.Status) {
                toast.success('Utilisateur crée avec succès !');
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
                toast.error(err.response.data.message || 'Erreur lors de la création de l\'utilisateur');
            } else {
                console.log(err)
                toast.error('Une erreur est survenue');
            }
        }
    };

    //MODIFICATION DU utilisateur
    const [showModalModifier, setShowModalModifier] = useState(false);
    const openEditModal = (user) => {
        setselectedUtilisateur({ ...user });
        setDataUtilisateur({ ...user });
        console.log(selectedUtilisateur)
        setShowModalModifier(true);
    };
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('userid', dataUtilisateur.userid);
        formData.append('nom', dataUtilisateur.nom);
        formData.append('email', dataUtilisateur.email);
        formData.append('role', dataUtilisateur.role);
        setLoading(true);
        try {
            const response = await axios.put(`${StaticIP}api/auth/modifier/${dataUtilisateur.id}`, formData);
            console.log('la réggg :', response.data)
            if (response.data.Status) {
                toast.success('Utilisateur modifié avec succès !');
                setTimeout(() => {
                    setLoading(false);
                    window.location.reload(); // Rechargement de la page
                    //router.push('/NouveauBoutique');
                }, 2000);
                setDataUtilisateur([])
            } else {
                toast.error(response.data.Error);
                setLoading(false);
            }
        } catch (err) {
            setLoading(false);
            console.log(err)
            if (err.response && err.response.data) {
                // Si l'erreur est liée à un type de fichier non supporté
                toast.error(err.response.data.message || 'Erreur lors de la modification de L\'utilisateur');
            } else {
                console.log(err)
                toast.error('Une erreur est survenue');
            }
        }
    };
    //FIN MODIFICATION DU utilisateur

    return (
        <LayoutFastfood>
            <BreadCrumb titre="utilisateurs" />
            <div className="row g-3 mb-3">
                <div className="col-xl-4 col-lg-4">
                    <div className="sticky-lg-top">
                        <div className="card mb-3">
                            <CardTitle title="Nouveau" />
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3 align-items-center">
                                        <div className="col-md-12">
                                            <label className="form-label">Nom & Prénoms</label>
                                            <input type="text" class="form-control"
                                                name="nom"
                                                onChange={(e) => setDataUtilisateur({ ...dataUtilisateur, nom: e.target.value })}
                                                placeholder="Saisir le nom de la direction"
                                            />
                                        </div>
                                        <div className="col-md-12">
                                            <label className="form-label">Email</label>
                                            <input type="text" class="form-control"
                                                name="email"
                                                onChange={(e) => setDataUtilisateur({ ...dataUtilisateur, email: e.target.value })}
                                                placeholder="Saisir le nom de la direction"
                                            />
                                        </div>
                                        <div className="col-md-12">
                                            <label className="form-label">Roles <font color="red">*</font></label>
                                            <select class="form-control"
                                                name="role"
                                                onChange={(e) => setDataUtilisateur({ ...dataUtilisateur, role: e.target.value })}
                                            >
                                                <option value=""> Sélectionner</option>
                                                <option value="User"> User</option>
                                                <option value="Admin"> Admin</option>

                                            </select>
                                        </div>
                                        <div className="col-md-12">
                                            <button type="submit" className="btn btn-success btn-sm mt-2" disabled={loading}>
                                                <i className='icofont-save'></i> {loading ? 'Enregistrement en cours...' : 'Enregistrer'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <ToastContainer />
                </div>

                <div class="col-xl-8 col-lg-8">
                    <div class="card">
                        <CardTitle title="Liste" />
                        <div class="card-body">
                            {utilisateurs.length === 0 ? (
                                <p>Aucun utilisateur trouvé.</p>
                            ) : (
                                <>
                                    <table id="myDataTable" class="table table-hover align-middle mb-0" style={{ width: '100%' }}>
                                        <thead>
                                            <tr>
                                                <th>N°</th>
                                                <th>Nom </th>
                                                <th>Email </th>
                                                <th>Role </th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {utilisateurs.map((user, index) => (
                                                <tr key={user.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{user.nom}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.role}</td>
                                                    <td>
                                                        <Link href="#" className="btn btn-outline-info btn-sm"
                                                            onClick={() => openEditModal(user)}>
                                                            <i className='icofont-edit'></i>
                                                        </Link>
                                                        <button className="btn btn-outline-danger btn-sm"
                                                            title="Supprimer"
                                                            onClick={() => {
                                                                setselectedUtilisateur(user);
                                                                setShowModal(true);
                                                            }}>
                                                            <i className='icofont-trash'></i>
                                                        </button>

                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div style={{ marginTop: "20px", textAlign: "center" }}>
                                        <button
                                            onClick={() => goToPage(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            style={{ marginRight: "10px" }}
                                            className="btn btn-warning btn-sm"
                                        >
                                            <span aria-hidden="true">&laquo;</span> Précédent
                                        </button>
                                        <span>Page {currentPage} sur {totalPages}</span>
                                        <button
                                            onClick={() => goToPage(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            style={{ marginLeft: "10px" }}
                                            className="btn btn-warning btn-sm"
                                        >
                                            Suivant <span aria-hidden="true">&raquo;</span>
                                        </button>
                                    </div>
                                </>
                            )}
                            {/* Modal de confirmation */}
                            <Modal show={showModal} onHide={() => setShowModal(false)}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Confirmation</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    Êtes-vous sûr de vouloir supprimer l'utilisateur : <strong>{selectedUtilisateur?.nom}</strong> ?
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                                        Annuler
                                    </Button>
                                    <Button variant="danger" onClick={handleDelete}>
                                        Confirmer
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                            {/* Modal de modification */}
                            <Modal show={showModalModifier} onHide={() => setShowModalModifier(false)} scrollable>
                                <form class="form-wizard" id="regForm" onSubmit={handleSubmit}>
                                    <Modal.Header closeButton>
                                       Modification de l' utilisateur : {selectedUtilisateur?.nom}
                                    </Modal.Header>

                                    <Modal.Body>
                                        <div className='row'>
                                            <div className='col-md-12'>
                                                <div class="card">
                                                    <div class="card-header pb-0">
                                                        <p class="desc mb-0 mt-1"><span></span><code></code><span>
                                                            Les champs avec <font color="red">*</font> obligatoires.</span></p>
                                                    </div>
                                                    <div class="card-body custom-input">

                                                        <div class="tab active" style={{ display: 'block' }}>
                                                            <div class="row g-3">
                                                                <div class="col-12">
                                                                    <label for="nom">Nom</label>
                                                                    <input class="form-control" id="nom" name="nom" type="text"
                                                                        value={dataUtilisateur.nom}
                                                                        onChange={(e) =>
                                                                            setDataUtilisateur({ ...dataUtilisateur, nom: e.target.value })
                                                                        } />
                                                                </div>
                                                                <div class="col-12">
                                                                    <label class="form-label" for="contacts">Email </label>
                                                                    <input class="form-control" id="contacts"
                                                                        type="email" name='email' placeholder="Ex : mercanto@gmail.com"
                                                                        value={dataUtilisateur.email}
                                                                        onChange={(e) =>
                                                                            setDataUtilisateur({ ...dataUtilisateur, email: e.target.value })
                                                                        } />

                                                                </div>
                                                                <div class="col-12">
                                                                    <label class="col-sm-12 form-label" for="adresse">Rôle </label>
                                                                    <select class="form-control"
                                                                        name="role"
                                                                        onChange={(e) => setDataUtilisateur({ ...dataUtilisateur, role: e.target.value })}
                                                                    >
                                                                        <option value={dataUtilisateur.role}> {dataUtilisateur.role}</option>
                                                                        <option value="User"> User</option>
                                                                        <option value="Admin"> Admin</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="danger" onClick={() => setShowModalModifier(false)}>
                                            Annuler
                                        </Button>
                                        <Button variant="success" onClick={handleEditSubmit} disabled={loading}>
                                            <i className='icofont-save'></i> {loading ? 'Modification en cours...' : 'Modifier'}
                                        </Button>
                                    </Modal.Footer>
                                </form>
                            </Modal>
                        </div>

                    </div>
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

export default Utilisateur