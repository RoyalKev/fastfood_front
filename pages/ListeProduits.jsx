import Layoutvendeur from '@/components/Layoutvendeur'
import React from 'react'

const ListeProduits = () => {
  return (
    <Layoutvendeur>
        
					<div className="dashboard-tlbar d-block mb-4">
						<div className="row">
							<div className="colxl-12 col-lg-12 col-md-12">
								<h1 className="mb-1 fs-3 fw-medium">Produits</h1>
								<nav aria-label="breadcrumb">
									<ol className="breadcrumb">
										<li className="breadcrumb-item text-muted"><a href="#">Employer</a></li>
										<li className="breadcrumb-item text-muted"><a href="#">Dashboard</a></li>
										<li className="breadcrumb-item"><a href="#" className="text-primary">Liste des produits</a></li>
									</ol>
								</nav>
							</div>
						</div>
					</div>
					
					<div className="dashboard-widg-bar d-block">

						<div className="row align-items-start mb-4">
							<div className="col-xl-12 col-lg-12 col-md-12 col-12">
								<div className="dashboard-search-wrap">
									
									<div className="showingOption">
											
										<div className="search-field d-flex align-items-center justify-content-start gap-2">
											<div className="dashboardshorting">
												<select className="form-control shorting">
												  <option value="all" selected>Toutes les catégories</option>
												  <option value="opening">Catégorie 1</option>
												  <option value="paused">Catégorie 2</option>
												  <option value="closed">Catégorie 3</option>
												  <option value="pen">Catégorie 4</option>
												</select>
											</div>
											<div className="frm-search">
												<div className="form-group formField icons right mb-0">
													<input type="text" className="form-control" placeholder="Entrez le nom du produit"/>
													<i className="icon bi bi-search"></i>
												</div>
											</div>
										</div>
										
										<div className="dashboardshorting">
											<select className="form-control shorting">
											  <option value="ry">Récents</option>
											  <option value="nw">Récents</option>
											  <option value="ol">Anciens</option>
											  <option value="ft" selected>Produit phare</option>
											</select>
										</div>
										<div class="">
                                            <a href="/NouveauProduit" class="btn btn-primary btn-md">
                                                <i class="fa-solid fa-circle-plus me-2"></i>
                                                Nouveau produit</a>
                                        </div>
									</div>
                                    
								</div>
							</div>
						</div>

						<div className="row align-items-start">
							<div className="col-xl-12 col-lg-12 col-md-12 col-12">
								
								<div className="table-responsive dashboard-table-wrap">
							
									<table className="table m-0">
									
										<thead>
											<tr>
												<th scope="col">Nom</th>
												<th scope="col">Prix</th>
												<th scope="col">Details</th>
												<th scope="col">Action</th>
											</tr>
										</thead>
										
										<tbody>
										
											<tr>
												<td>
													<div className="applicants-info-wrap">
														<div className="applicants-info">
															<div className="user-thumb"><figure><img src="assets/img/team-1.jpg" className="img-fluid circle" alt="Img"/></figure></div>
															<div className="user-info">
																<h5 className="title">
																	Produit 1
																</h5>
																<div className="appliedfor">Catégorie: <a href="#" className="joblink">Informatique</a></div>
															</div>
														</div>
													</div>
												</td>
                                                <td>
													<div className="applicants">
														<div className="jbx-status"><span className="label close">5 000 fcfa</span></div>
													</div>
												</td>
												<td>
													<div className="applicants">
														<div className="jbx-status"><span className="label opening">Produit Approuvé</span></div>
														<div className="applied-date"><span className="date">Publié le 18 décembre 2024</span></div>
													</div>
												</td>
												
												<td className="action">
													<div className="action-group">
														<div className="first-child">
															<a href="#" className="download-resume" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Download Resume"><i className="bi bi-cloud-download-fill"></i></a>
														</div>
														<div className="last-item">
															<a href="#" className="text-muted" data-bs-toggle="dropdown" aria-expanded="false"><i className="fa-solid fa-ellipsis-vertical"></i></a>
															<div className="dropdown-menu border py-0">
																<a className="dropdown-item" href="#">Modifier</a>
																<a className="dropdown-item" href="#">Supprimer</a>
															</div>
														</div>
													</div>
												</td>
											</tr>
											
											<tr>
												<td>
													<div className="applicants-info-wrap">
														<div className="applicants-info">
															<div className="user-thumb"><figure><img src="assets/img/team-2.jpg" className="img-fluid circle" alt="Img"/></figure></div>
															<div className="user-info">
																<h5 className="title">
																	Produit 2
																</h5>
																<div className="appliedfor">Catégorie: <a href="#" className="joblink">Maintenance</a></div>
															</div>
														</div>
													</div>
												</td>
                                                <td>
													<div className="applicants">
														<div className="jbx-status"><span className="label close">5000 fcfa</span></div>
													</div>
												</td>
												<td>
													<div className="applicants">
														<div className="jbx-status"><span className="label close">Produit non approuvé</span></div>
														<div className="applied-date"><span className="date">Publié le 10 Décembre 2024</span></div>
													</div>
												</td>
												
												<td className="action">
													<div className="action-group">
														<div className="first-child">
															<a href="#" className="download-resume" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Download Resume"><i className="bi bi-cloud-download-fill"></i></a>
														</div>
														<div className="last-item">
															<a href="#" className="text-muted" data-bs-toggle="dropdown" aria-expanded="false"><i className="fa-solid fa-ellipsis-vertical"></i></a>
															<div className="dropdown-menu border py-0">
																<a className="dropdown-item" href="#">Modifier</a>
																<a className="dropdown-item" href="#">Supprimer</a>
															</div>
														</div>
													</div>
												</td>
											</tr>
											
											
											
										</tbody>
										
									</table>
									
								</div>
									
							</div>
						</div>

					</div>
					
    </Layoutvendeur>
    
  )
}

export default ListeProduits