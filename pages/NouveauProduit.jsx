import Layoutvendeur from '@/components/Layoutvendeur'
import React from 'react'

const NouveauProduit = () => {
  return (
    <Layoutvendeur>
					<div class="dashboard-tlbar d-block mb-2">
						<div class="row">
							<div class="colxl-12 col-lg-12 col-md-12">
								<h1 class="mb-1 fs-3 fw-medium">Produits</h1>
								<nav aria-label="breadcrumb">
									<ol class="breadcrumb">
										<li class="breadcrumb-item text-muted">Nouvel enregistrement --- </li>
										<li class="breadcrumb-item"><a href="/NouveauProduit" class="text-primary">Voir la liste des produits</a></li>
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
                        <div class="row align-items-start justify-content-start g-3">
                        
                            <div class="col-xl-12 col-lg-12 col-md-12 col-12">
                                <div class="formField">
                                    <label class="label">Catégorie <sup><font color="red">*</font></sup></label>
                                    <select class="form-control select">
                                        <option value="">Select Company</option>
                                        <option value="1">Netflix Tech</option>
                                        <option value="2">Doodle Infratech</option>
                                        <option value="3">Microsoft</option>
                                        <option value="4">Medico Healthy</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-xl-12 col-lg-12 col-md-12 col-12">
                                <div class="formField">
                                    <label class="label">Nom du produit <sup><font color="red">*</font></sup></label>
                                    <input type="text" class="form-control" placeholder="Saisir le nom du produit"/>
                                </div>
                            </div>
                            <div class="col-xl-12 col-lg-12 col-md-12 col-12">
                                <div class="formField">
                                    <label class="label">Prix <sup><font color="red">*</font></sup></label>
                                    <input type="text" class="form-control" placeholder="Saisir le prix du produit"/>
                                </div>
                            </div>
                            <div class="col-xl-12 col-lg-12 col-md-12 col-12">
                                <div class="formField">
                                    <label class="label">Description <sup><font color="red">*</font></sup></label>
                                    <textarea class="form-control"></textarea>
                                </div>
                            </div>

                            <div class="col-xl-12 col-lg-12 col-md-12 col-12">
                                <div class="form-group">
                                <label class="label">Image <sup><font color="red">*</font></sup></label>
                                    <div class="rounded-3 border d-flex align-items-center gap-3 px-3 py-4">
                                        <div class="upload-btn-wrapper small">
                                            <button class="btn btn-md btn-light-seegreen fw-medium">Browse Image</button>
                                            <input type="file" name="myfile"/>
                                        </div>
                                        <div class="fs-md">Maximum file size: 100 MB.</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="col-xl-12 col-lg-12 col-md-12 col-12">
                                <div class="alert alert-primary mb-0" role="alert">You need to select company before adding job listing. If you didn't add company profile yet click button below.</div>
                            </div>
                            
                            <div class="col-xl-12 col-lg-12 col-md-12 col-12">
                                <a href="employer-add-company.html" class="btn btn-primary btn-md"><i class="fa-solid fa-circle-plus me-2"></i>Add Company</a>
                            </div>
                            
                        </div>
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
    </div>
    </Layoutvendeur>
  )
}

export default NouveauProduit