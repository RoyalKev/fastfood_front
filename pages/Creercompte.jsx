import Layout from '@/components/LayoutRh'
import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '@/context/authContext';

const Creercompte = () => {
  const [formData, setFormData] = useState({ nom: '', email: '', password: '', role: 'Vendeur' });
  const router = useRouter();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([]);
  const {register} = useContext(AuthContext)
  const handleSubmit = async (e) => {
    e.preventDefault();
	setLoading(true);
	await new Promise((resolve) => setTimeout(resolve, 2000));
	//await axios.post('http://localhost:5000/api/auth/register', formData);
    try {
	const response = await register(formData)
      toast.success('Inscription réussie !');
      setTimeout(() => {
		setLoading(false);
        router.push(`/Dashboard?name=${formData.nom}&profil=${formData.role}`);
      }, 2000);
    } catch (err) {
		/*console.log("Erreur lors de l'inscription :", err.response);
		 // Vérifiez si la structure `errors` existe
		 const errorMsg = err.response?.data?.errors?.[0]?.msg || 
		 err.response?.data?.message || 
		 'Erreur d’inscription';
		// Affichez un message d'erreur
		toast.error(errorMsg);
		setLoading(false);*/
		console.error("Erreur lors de la connexion :", err.response);
		const errorMsg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.Error || 'Erreur de connexion';
		toast.error(errorMsg);
		setLoading(false);
    }
  };
  return (
    <Layout>
    <section className="bg-lighten">
				<div className="container">

					<div className="row justify-content-center align-items-center m-auto">
						<div className="col-xl-6 col-lg-7 col-md-10">
							
							<div className="auth-body">
								
								<div className="authHead">
									<div className="logoIcon">LOGO</div>
									<div className="title"><h4>Créer un compte</h4></div>
								</div>
								
      							<form onSubmit={handleSubmit}>
								<div className="loginForm">
									
									<div className="nameWrap">
										<div className="row gx-4">
											
											<div className="col-12">
												<div className="form-group">
													<label>Nom</label>
													<input type="text" name="nom"
														className="form-control" 
														placeholder="Votre nom de famille"
														onChange={handleChange}
														required/>
												</div>
											</div>

										
										</div>
									</div>
									
									<div className="form-group">
										<label>Email</label>
										<input type="text" className="form-control" 
											name="email" placeholder="Votre adresse email"
											onChange={handleChange}
											required/>
									</div>
									
									<div className="form-group mb-3">
										<label>Mot de passe</label>
										<input type="password" name="password" 
										className="form-control" placeholder="Saisissez votre mot de passe"
										onChange={handleChange}
										required/>
									</div>

									<div className="form-group mb-3" hidden>
										<label>Role</label>
										<input type="text" className="form-control" 
											name="role" value={formData.role}
											onChange={handleChange}
											required/>
									</div>
									
									<div className="form-group mb-0">
										<button type="submit" className="btn btn-primary btn-submit" disabled={loading}>
										{loading ? 'Envoi en cours...' : 'Soumettre'}</button>
									</div>

								</div>
								</form>
								<ToastContainer />
							</div>
							<div className="extraCaps">Avez-vous déjà un compte ? <a href="/Login" className="text-primary fw-medium">Connexion</a></div>	
						</div>
					</div>
					{loading && (
						<div className="overlay">
							<div className="loader"></div>
						</div>
					)}
				</div>
			</section>
            </Layout>
  )
}

export default Creercompte