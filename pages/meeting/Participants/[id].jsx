import LayoutMeeting from '@/components/LayoutMeeting';
import { AuthContext } from '@/context/authContext';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { CardTitle } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button } from "react-bootstrap";
import { StaticIP } from '@/config/staticip';

const Participants = () => {
  const router = useRouter();
  const { id } = router.query; // Récupère l'id passé en paramètre
  const [utilisateurs, setutilisateurs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]); // IDs des utilisateurs sélectionnés
  // Récupération des utilisateurs avec pagination
  const fetchutilisateurs = async (page = 1) => {
    try {
        const response = await axios.get(`${StaticIP}api/auth/liste`);
        if (response.data.Status) {
            setutilisateurs(response.data.Result);
        } else {
            setError("Erreur lors de la récupération des utilisateurs");
        }
    } catch (err) {
        setError("Une erreur est survenue lors de la récupération des utilisateurs");
        console.error(err);
    } 
};
 useEffect(() => {
        fetchutilisateurs(utilisateurs);
    }, []);
//FIN LISTE

// Gérer les cases à cocher
const handleCheckboxChange = (userId) => {
  setSelectedUsers((prev) =>
    prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
  );
};
const { currentUser } = useContext(AuthContext)
const [userid, setuserId] = useState(null)
// Enregistrer les participants
const handleSave = async () => {
  if (selectedUsers.length === 0) return;

  setLoading(true);
  try {
    const response = await fetch(`${StaticIP}api/participant/nouveau`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reunion_id: id,
        participants: selectedUsers,
      }),
    });
    console.log(response)
    if (response.ok) {
      toast.success("Participants enregistrés avec succès !");
      //alert('Participants enregistrés avec succès.');
      setSelectedUsers([]); // Réinitialiser les cases cochées
      setTimeout(() => {
        setLoading(false);
        window.location.reload(); // Rechargement de la page
        //router.push('/NouveauBoutique');
    }, 2000);
    } else {
      toast.error('Erreur lors de l’enregistrement des participants.');
    }
  } catch (error) {
    console.error('Erreur réseau:', error);
  }
  setLoading(false);
};

const [showModal, setShowModal] = useState(false);
    const [selectedParticipant, setselectedParticipant] = useState(null);
    const handleDelete = async () => {
        if (!selectedParticipant) return;
        try {
            const response = await axios.delete(`${StaticIP}api/participant/supprimer/${selectedParticipant.participantId}`);
            if (response.data.Status) {
                setparticipants(participants.filter((part) => part.participantId !== selectedParticipant.participantId));
                setShowModal(false);
                toast.success("Participant supprimé avec succès !");
            } else {
                alert("Erreur : " + response.data.message);
            }
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
            alert("Une erreur est survenue lors de la suppression.");
        }
    };
    //FIN SUPPRESSION
    const [participants, setparticipants] = useState([]);
    const fetchparticipants = async (e) => {
      setLoading(true);
      try {
          const response = await axios.get(`${StaticIP}api/participant/liste?id=${id}`);
          if (response.data.Status) {
              setparticipants(response.data.Result);
          } else {
              setError("Erreur lors de la récupération des participants");
          }
      } catch (err) {
          setError("Une erreur est survenue lors de la récupération des participants");
          console.error(err);
      } finally {
          setLoading(false);
      }
  };
  useEffect(() => {
      fetchparticipants(participants);
  }, [id]);

  //RECUPERATION DES UTILISATEURS DDUNE DIRECTION DONNEE

  const [users, setusers] = useState([]);
  const handleChange = async (e) => {
      try {
          const response = await axios.get(`${StaticIP}api/direction/users/` + e.target.value);
          if (response.data.Status) {
            setusers(response.data.Result);
            setutilisateurs(response.data.Result);
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
  const [directions, setdirections] = useState([])
  const fetchdirections = async (page = 1) => {
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
    } 
};
 useEffect(() => {
        fetchdirections(directions);
    }, []);

  return (
    <LayoutMeeting>
    <div className="row g-3 mb-3">
      <div class="col-xl-6 col-lg-6">
                    <p>
                    <select className='form-control' onChange={handleChange} mb-2>
                        <option>Sélectionner une direction pour filtrer la liste</option>
                        <option value='0'>Toutes les directions</option>
                        {
                            directions.map(dir => {
                                return <option key={dir.id} value={dir.id}>{dir.nom_direction}</option>
                            })
                        }
                    </select>
                    </p>
                    <div class="card">
                    <CardTitle title="Sélectionner les participants" />
                        <div class="card-body">
                                        {utilisateurs.length === 0 ? (
                                                <p>Aucun utilisateur trouvé.</p>
                                            ) : (
                                                <>
                                            <table id="myDataTable" class="table table-hover align-middle mb-0" style={{ width:'100%'}}>
                                                <thead>
                                                    <tr>
                                                        <th>N°</th>
                                                        <th>Nom </th>
                                                        <th>Email </th>
                                                        <th style={{ textAlign:'right' }}>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {utilisateurs.map((user, index) => (
                                                    <tr key={user.id}>
                                                        <td>{index +1}</td>
                                                        <td>{user.nom}</td>
                                                        <td>{user.email}</td>
                                                        <td style={{ textAlign:'right' }}>
                                                        <input style={{ height:'25px',padding:'10px' }}
                                                              type="checkbox"
                                                              value={user.id}
                                                              checked={selectedUsers.includes(user.id)}
                                                              onChange={() => handleCheckboxChange(user.id)}
                                                            /> 
                                                        </td>
                                                    </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot>
                                                  <tr>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td>
                                                    <button
                                                        onClick={handleSave} className="btn btn-success btn-sm mt-2"
                                                        disabled={selectedUsers.length === 0 || loading} // Désactiver si aucune sélection
                                                      > <i className='icofont-save'></i> &nbsp;
                                                        {loading ? 'Enregistrement en cours...' : 'Ajouter participant(s)'}
                                                      </button>
                                                    </td>
                                                    
                                                  </tr>
                                                </tfoot>
                                            </table>
                                            
                                        </>
                                            )}
                                </div>

                    </div>
                </div>
                <div class="col-xl-6 col-lg-6">
                    <div class="card">
                    <CardTitle title="Liste des participants" />
                        <div class="card-body">
                                        {participants.length === 0 ? (
                                                <p>Aucun participant trouvé.</p>
                                            ) : (
                                                <>
                                            <table id="myDataTable" class="table table-hover align-middle mb-0" style={{ width:'100%'}}>
                                                <thead>
                                                    <tr>
                                                        <th>N°</th>
                                                        <th>Nom </th>
                                                        <th>Email </th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {participants.map((participant, index) => (
                                                    <tr key={participant.id}>
                                                        <td>{index +1}</td>
                                                        <td>{participant.nom}</td>
                                                        <td>{participant.email}</td>
                                                        <td>
                                                        <button className="btn btn-outline-danger btn-sm"
                                                                title="Retirer"
                                                                onClick={() => {
                                                                    setselectedParticipant(participant);
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
                                                    Êtes-vous sûr de vouloir retirer le participant : <strong>{selectedParticipant?.nom}</strong> ?
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
                <ToastContainer />
    </div>
    </LayoutMeeting>
  );
};

export default Participants;