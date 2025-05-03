import Layout from '@/components/LayoutRh'
import { AuthContext } from '@/context/authContext';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';

const Login = () => {
	const [formData, setFormData] = useState({ email: '', password: '' });
	const router = useRouter();
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState([]);
	const { login } = useContext(AuthContext)
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
		  await new Promise((resolve) => setTimeout(resolve, 2000)); // Simule une latence réseau
		  const response = await login(formData);
		  if (response.data.Status) {
			toast.success('Connexion réussie !');
			setTimeout(() => {
			  setLoading(false);
			  router.push('/fastfood/Dashboard');
			}, 1000);
		  } else {
			toast.error(response.data.Error);
			setLoading(false); // Désactiver le chargement si une erreur applicative survient
		  }
		} catch (error) {
		  console.error('Erreur lors de la connexion :', error.message);
		  if (error.response) {
			console.error('Détails de la réponse du serveur :', error.response.data);
		  } else if (error.request) {
			console.error('Pas de réponse du serveur :', error.request);
		  } else {
			console.error('Erreur inconnue :', error.message);
		  }
		  setLoading(false);
		  toast.error('Une erreur est survenue. Veuillez réessayer.');
		}
	  };
	return (
			<div id="ebazar-layout" class="theme-blue" style={{ backgroundColor: '#203668'}}>
				<div class="main p-2 py-3 p-xl-5 ">
					<div class="body d-flex p-0 p-xl-5">
						<div class="container-xxl">

							<div class="row g-0">
								<div class="col-lg-7 d-none d-lg-flex justify-content-center align-items-center rounded-lg auth-h100">
									<div style={{ maxWidth: '25rem'}}>
										<div class="text-center mb-5">
											<i class="bi bi-bag-check-fill  text-primary" style={{ fontSize:'90px' }}></i>
										</div>
										<div class="mb-5">
											<h2 class="color-900 text-center" style={{ color:"#fff", fontSize:'30px' }}>Module <br/>Restaurant /Fast Food</h2>
											<span style={{ color:"#fff" }}>Simplifiez et gérez facilement votre stock, vos ventes etc.</span>
										</div>
										<div style={{ marginLeft:"-45px", marginTop:'-35px' }}>
										<Image src="/meeting2.png" alt="Logo" width={400} height={438} />
										</div>
									</div>
								</div>

								<div class="col-lg-5 d-flex justify-content-center align-items-center
								 border-0 rounded-lg auth-h100">
									<div class="w-100 p-3 p-md-5 card border-0 shadow-sm" style={{ maxWidth: '32rem', backgroundColor: '#fff'}}>
										<form class=" g-1 p-3 p-md-4" onSubmit={handleSubmit}>
											<div class="col-12 text-center mb-3">
											<Image src="/logo_es.png" alt="Logo" width={210} height={62} /><br/><br/>
												<span style={{color:'#e33f44'}}><b>Authentification utilisateur</b></span>
											</div>
											<div class="col-12">
												<div class="mb-2">
													<label class="form-label">Email</label>
													<input type="text" class="form-control form-control-lg" 
													name="email" onChange={handleChange}
													placeholder="Votre nom d'utilisateur" />
												</div>
											</div>
											<div class="col-12">
												<div class="mb-2">
													<div class="form-label">
														<span class="d-flex justify-content-between align-items-center">
															Mot de passe
															<a class="text-secondary" href="#">Mot de passe oublié?</a>
														</span>
													</div>
													<input type="password" class="form-control form-control-lg" 
													name="password" onChange={handleChange}
													placeholder="***************" />
												</div>
											</div>
											<div class="col-12">
												<div class="form-check">
													<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
													<label class="form-check-label" for="flexCheckDefault">
														Remember me
													</label>
												</div>
											</div>
											<div class="col-12 text-center mt-4">
												<button type="submit" className="btn btn-lg btn-block btn-success lift text-uppercase"
												 disabled={loading} style={{ width:'100%'}}>
												{loading ? 'Connexion en cours...' : 'Se connecter'}</button>
											</div>
										</form>
										<ToastContainer />
									</div>
								</div>
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

export default Login