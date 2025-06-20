import express from "express";
import organizationAffiliationsController from "../controllers/organizationAffiliationsController.js";
import degreeProgramsController from "../controllers/degreeProgramController.js";
import alumniProfilesController from "../controllers/alumniProfilesController.js";
import workExperiencesController from "../controllers/workExperiencesController.js";
import photosController from "../controllers/photosController.js";
import contactsController from "../controllers/contactsController.js";

const usersExtensionRoutes = (aUpload) => {
  const router = express.Router();

  router.get("/:id/degree-programs", degreeProgramsController.getDegreeProgramsByUserId);
  router.get("/:userId/profile", alumniProfilesController.getAlumniProfilesById);
  router.get("/:userId/profile/latest", alumniProfilesController.getAlumniProfileById);
  router.get("/:userId/work-experiences", workExperiencesController.getWorkExperiencesByUserId);
  router.get("/:alumId/organizations", organizationAffiliationsController.getAffiliatedOrganizations);
  router.post("/:alumId/organizations", organizationAffiliationsController.affiliateAlumnusToOrganization);
  router.put("/:alumId/organizations/:orgId", organizationAffiliationsController.updateAffiliationData);
  router.delete("/:alumId/organizations/:orgId", organizationAffiliationsController.deleteAffiliatedOrganization);
  router.post("/:userId/avatar", aUpload.single("avatar"), photosController.uploadOrReplaceAvatar);
  router.delete("/:id/avatar", photosController.deleteAvatar);
  router.post("/:userId/degree-proof", aUpload.single("degree_proof"), photosController.uploadOrReplaceDegreeProof);
  router.delete("/:id/degree-proof", photosController.deleteDegreeProof);
  router.get("/:id/contacts", contactsController.getContactsByUserId);

  return router;
};

export default usersExtensionRoutes;