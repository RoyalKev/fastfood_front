import Layoutvendeur from '@/components/Layoutvendeur'
import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '@/context/authContext';

const NouveauBoutique = () => {
    const router = useRouter();
    const {currentUser} = useContext(AuthContext)
    const [userid, setuserId] = useState(null)
    const [loading, setLoading] = useState(false);
    const [logo_Boutique, setLogo] = useState(null);

    const [databoutique, setDataboutique] = useState({
        profil_Boutique: '',
        statut_Boutique: '',
        nomBoutique: '',
        description_Boutique: '',
        userid: null,
      })

     // Utilisez useEffect pour définir l'ID utilisateur une seule fois
     useEffect(() => {
        if (currentUser) {
            setuserId(currentUser.id);
            setDataboutique((prev) => ({ ...prev, userid: currentUser.id }));
        }
    }, [currentUser]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('userid', databoutique.userid);
        formData.append('profil_Boutique', databoutique.profil_Boutique);
        formData.append('statut_Boutique', databoutique.statut_Boutique);
        formData.append('nomBoutique', databoutique.nomBoutique);
        formData.append('description_Boutique', databoutique.description_Boutique);
        if (logo_Boutique) formData.append('logo_Boutique', logo_Boutique);
        /*for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }*/
            //if (logo_Boutique) formData.append('logo_Boutique', logo_Boutique);

            setLoading(true);
            try {
                const response = await axios.post('http://localhost:5000/api/boutique/nouveau', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                console.log('la réggg :', response)
                if (response.data.Status) {
                    toast.success('Boutique créée avec succès !');
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
                if (err.response && err.response.data) {
                  // Si l'erreur est liée à un type de fichier non supporté
                  toast.error(err.response.data.message || 'Erreur lors de la création de la boutique');
                } else {
                  toast.error('Une erreur est survenue');
                }
              }
        
    };

  return (
    <>
    
    <Layoutvendeur>
					<div class="dashboard-tlbar d-block mb-2">
						<div class="row">
							<div class="colxl-12 col-lg-12 col-md-12">
								<h1 class="mb-1 fs-3 fw-medium">Boutiques</h1>
								<nav aria-label="breadcrumb">
									<ol class="breadcrumb">
										<li class="breadcrumb-item text-muted">Nouvel enregistrement --- </li>
										<li class="breadcrumb-item"><a href="/NouveauProduit" class="text-primary">Voir toutes mes boutiques</a></li>
									</ol>
								</nav>
							</div>
						</div>
					</div>
                    
    <div class="dashboard-widg-bar d-block">
        <div class="row align-items-start g-4">
            
            <div class="col-xl-9 col-lg-8 col-md-12 col-12">
                <div class="card rounded-3 mb-4">
                    <div class="card-header">
                        <h4>Création</h4>
                    </div>
                    <div class="card-body">
                    <form onSubmit={handleSubmit}>
                        <div class="row align-items-start justify-content-start g-3">
                        {currentUser &&
                            <div class="col-xl-12 col-lg-12 col-md-12 col-12">
                                <div class="formField">
                                    <label class="label">USER ID <sup><font color="red">*</font></sup></label>
                                    <input type="text" name="userid" class="form-control" value={currentUser.id} required/>
                                </div>
                            </div>
                            }
                            <div class="col-xl-12 col-lg-12 col-md-12 col-12">
                                <div class="formField">
                                    <label class="label">Type de boutique <sup><font color="red">*</font></sup></label>
                                    <select class="form-control select" name="profil_Boutique" 
                                    onChange={(e) =>
                                        setDataboutique({ ...databoutique, profil_Boutique: e.target.value })
                                    }
                                    >
                                        <option value="">Sélectionner un profil</option>
                                        <option value="Entreprise">Entreprise</option>
                                        <option value="Particulier">Particulier</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-xl-12 col-lg-12 col-md-12 col-12">
                                <div class="formField">
                                    <label class="label">Statut de l'entreprise <sup><font color="red">*</font></sup></label>
                                    <select class="form-control select" name="statut_Boutique" 
                                    onChange={(e) =>
                                        setDataboutique({ ...databoutique, statut_Boutique: e.target.value })
                                    }
                                    >
                                        <option value="">Sélectionner un statut</option>
                                        <option value="ETS">ETS</option>
                                        <option value="SARL">SARL</option>
                                        <option value="SARL U">SARL U</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-xl-12 col-lg-12 col-md-12 col-12">
                                <div class="formField">
                                    <label class="label">Nom de la boutique <sup><font color="red">*</font></sup></label>
                                    <input type="text" name="nomBoutique" class="form-control" 
                                    onChange={(e) =>
                                        setDataboutique({ ...databoutique, nomBoutique: e.target.value })
                                    }
                                    placeholder="Saisir le nom de votre boutique" />
                                </div>
                            </div>
                            <div class="col-xl-12 col-lg-12 col-md-12 col-12">
                                <div class="formField">
                                    <div class="col-xl-12 col-lg-12 col-md-12 col-12">
                                        <div class="formField">
                                            <label class="label">Description <sup><font color="red">*</font></sup></label>
                                            <textarea class="form-control" name="description_Boutique" 
                                            onChange={(e) =>
                                                setDataboutique({ ...databoutique, description_Boutique: e.target.value })
                                            }
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xl-12 col-lg-12 col-md-12 col-12">
                                <div class="form-group">
                                <label class="label">Image <sup><font color="red">*</font></sup></label>
                                    <div class="rounded-3 border d-flex align-items-center gap-3 px-3 py-4">
                                        <div class="upload-btn-wrapper small">
                                            <button class="btn btn-md btn-light-seegreen fw-medium">Parcourir</button>
                                            <input type="file" name="logo_Boutique" onChange={(e) => setLogo(e.target.files[0])}/>
                                        </div>
                                        <div class="fs-md">Maximum file size: 100 MB.</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="col-xl-12 col-lg-12 col-md-12 col-12">
                                <div class="alert alert-primary mb-0" role="alert">You need to select company before adding job listing. If you didn't add company profile yet click button below.</div>
                            </div>
                            
                            <div class="col-xl-12 col-lg-12 col-md-12 col-12">
                            <button type="submit" className="btn btn-primary btn-submit" disabled={loading}>
                            {loading ? 'Envoi en cours...' : 'Enregistrer boutique'}</button>
                            </div>
                            
                        </div>
                        </form>
                        
                    </div>
                </div>
                
            </div>

            <div class="col-xl-3 col-lg-4 col-md-12 col-sm-12">
								<div class="submit-job-status">
									
									<div class="company-thumb-wrap">
										<div class="thumb"><figure><img src="assets/img/com-2.png" class="img-fluid" alt="Image"/></figure></div>
									</div>
									
									<div class="submit-job-info">
										<div class="submit-job-type"><span class="jobType">Full Time</span></div>
										<h4 class="job-title">Your Job Title Here</h4>
										<p class="sub-job-location">In Los Angels</p>
									</div>
									
									<div class="submit-job-list-status">
										<ul>
											<li class="complete"><i class="ico bi bi-patch-check-fill"></i>Company Details</li>
											<li class="complete"><i class="ico bi bi-patch-check-fill"></i>Basic Job Info</li>
											<li><i class="ico bi bi-patch-check-fill"></i>Job Location</li>
											<li><i class="ico bi bi-patch-check-fill"></i>Salary Details</li>
											<li><i class="ico bi bi-patch-check-fill"></i>Photo Gallery</li>
										</ul>
									</div>
								</div>
							</div>
                            
        </div>
        <ToastContainer />
        {loading && (
						<div className="overlay">
							<div className="loader"></div>
						</div>
					)}
    </div>
    </Layoutvendeur>
    </>
  )
}

export default NouveauBoutique