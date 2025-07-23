import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { assignAgentZodSchema, createParcelZodSchema, updateStatusZodSchema } from './parcel.validation ';
import { ParcelController } from './parcel.controller';

const router = express.Router();
// checked
router.post(
    "/",
    auth("CUSTOMER"),
    validateRequest(createParcelZodSchema),
    ParcelController.createParcel
);
// checked
router.get(
  "/customer",
  auth("CUSTOMER"),
  ParcelController.getParcelsByCustomer
);

// checked
router.patch(
  "/:id/assign",
  auth("ADMIN"),
  validateRequest(assignAgentZodSchema),
  ParcelController.assignAgent
);

// checked
router.get(
  "/agent/:id",
  auth("AGENT"),
  ParcelController.getParcelsByAgent
);
// checked
router.patch(
  "/:id/status",
  auth("AGENT"),
  validateRequest(updateStatusZodSchema),
  ParcelController.updateStatus
);

router.get(
  "/tracking/:parcelId",
  auth("CUSTOMER"),
  ParcelController.getTrackingInfo
);

router.get(
  '/',
  auth("ADMIN"),
  ParcelController.getAllParcels
);

export const ParcelRoutes = router;