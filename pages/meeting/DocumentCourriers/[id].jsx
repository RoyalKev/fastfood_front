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
import Link from 'next/link';

const DocumentCourriers = () => {
    const router = useRouter();
    const { id } = router.query; // Récupère l'id passé en paramètre
    const { currentUser } = useContext(AuthContext)
    const [userid, setuserId] = useState(null)
    const [loading, setLoading] = useState(false);
    const [doc, setDoc] = useState([]);

    // Récupération des documents du courrier
    const fetchdoc = async () => {
        
        setLoading(true);
        //setError(null); // Réinitialisation de l'erreur avant une nouvelle requête

        try {
            const response = await axios.get(`${StaticIP}api/documentcourrier/liste?id=${id}`);
            if (response.data.Status) {
                // Vérifier que Result est un tableau, sinon utiliser un tableau vide
                setDoc(Array.isArray(response.data.Result) ? response.data.Result : []);
            } else {
                setError("Erreur lors de la récupération des documents.");
            }
        } catch (err) {
            setError("Une erreur est survenue lors de la récupération des documents.");
            console.error("Erreur lors de la requête :", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchdoc();
        setdataDocument((prev) => ({ ...prev, courrier_id: id }));
    }, [id]);


    const [fichier, setFichier] = useState(null);

    const [dataDocument, setdataDocument] = useState({
        observations: '',
        courrier_id: id,
        userid: null,
    })

    // Utilisez useEffect pour définir l'ID utilisateur une seule fois

    //const [courrier_id, setCourrierid] = useState(null);

    useEffect(() => {
        if (currentUser) {
            setuserId(currentUser.id);
            setdataDocument((prev) => ({ ...prev, userid: currentUser.id }));
        }
    }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('courrier_id', dataDocument.courrier_id);
        formData.append('userid', dataDocument.userid);
        formData.append('observations', dataDocument.observations);
        if (fichier) formData.append('fichier', fichier);
        /*for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }*/
        //if (logo_Boutique) formData.append('logo_Boutique', logo_Boutique);

        setLoading(true);
        try {
            const response = await axios.post(`${StaticIP}api/documentcourrier/nouveau`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            console.log('la réggg :', response.data)
            if (response.data.Status) {
                toast.success('Document ajouté avec succès !');
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
                toast.error(err.response.data.message || 'Erreur lors de l\'ajout du document');
            } else {
                console.log(err)
                toast.error('Une erreur est survenue');
            }
        }
    };

    const [showModal, setShowModal] = useState(false);
    const [selectedDocument, setselectedDocument] = useState(null);
    const handleDelete = async () => {
        if (!selectedDocument) return;
        try {
            const response = await axios.delete(`${StaticIP}api/documentcourrier/supprimer/${selectedDocument.id}`);
            if (response.data.Status) {
                setDoc(doc.filter((docu) => docu.id !== selectedDocument.id));
                setShowModal(false);
                toast.success("Document supprimé avec succès !");
            } else {
                alert("Erreur : " + response.data.message);
            }
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
            alert("Une erreur est survenue lors de la suppression.");
        }
    };
    //FIN SUPPRESSION
  return (
    <LayoutMeeting>
            <BreadCrumb titre="Documents du courrier" />
            <div className="row g-3 mb-3">
                <div className="col-xl-4 col-lg-4">
                    <div className="sticky-lg-top">
                        <div className="card mb-3">
                            <CardTitle title="Nouveau" />
                            <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3 align-items-center">
                                    <div className="col-md-12">
                                        <label className="form-label">Uplaoder le document</label>
                                        
                                        <input type="file" class="form-control"
                                            name="fichier"
                                            onChange={(e) => setFichier(e.target.files[0])}/>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="form-label">Nom du fichier</label>
                                        <textarea class="form-control"
                                            name="observations"
                                            onChange={(e) => setdataDocument({ ...dataDocument, observations: e.target.value })}>
                                        </textarea>
                                            
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
                                        {doc.length === 0 ? (
                                                <p>Aucun document trouvé.</p>
                                            ) : (
                                                <>
                                            <table id="myDataTable" class="table table-hover align-middle mb-0" style={{ width:'100%'}}>
                                                <thead>
                                                    <tr>
                                                        <th>N°</th>
                                                        <th>Fichier</th>
                                                        <th>Nom du fichier</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {doc.map((doc, index) => (
                                                    <tr key={doc.id}>
                                                        <td>{index +1}</td>
                                                        <td>
                                                        <a href={`/public/Courriers/${doc.fichier}`} target="_blank" >
                                                                {doc.fichier}
                                                            </a>
                                                        </td>
                                                        <td>{doc.observations}</td>
                                                        <td>
                                                            <button className="btn btn-outline-danger btn-sm"
                                                                title="Supprimer"
                                                                onClick={() => {
                                                                    setselectedDocument(doc);
                                                                    setShowModal(true);
                                                                }}>
                                                                <i className='icofont-trash'></i>
                                                            </button>
                                                            
                                                        </td>
                                                    </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            
                                        </>
                                            )}
                                             {/* Modal de confirmation */}
                                      <Modal show={showModal} onHide={() => setShowModal(false)}>
                                                <Modal.Header closeButton>
                                                    <Modal.Title>Confirmation</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    Êtes-vous sûr de vouloir supprimer ce document ?
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
                                </div>

                    </div>
                </div>
                
            </div>
            {loading && (
						<div className="overlay">
							<div className="loader"></div>
						</div>
					)}
        </LayoutMeeting>
  )
}

export default DocumentCourriers