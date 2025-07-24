"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const parcel_validation_1 = require("./parcel.validation ");
const parcel_controller_1 = require("./parcel.controller");
const router = express_1.default.Router();
// checked
router.post("/", (0, auth_1.default)("CUSTOMER"), (0, validateRequest_1.default)(parcel_validation_1.createParcelZodSchema), parcel_controller_1.ParcelController.createParcel);
// checked
router.get("/customer", (0, auth_1.default)("CUSTOMER"), parcel_controller_1.ParcelController.getParcelsByCustomer);
// checked
router.patch("/:id/assign", (0, auth_1.default)("ADMIN"), (0, validateRequest_1.default)(parcel_validation_1.assignAgentZodSchema), parcel_controller_1.ParcelController.assignAgent);
// checked
router.get("/agent/:id", (0, auth_1.default)("AGENT"), parcel_controller_1.ParcelController.getParcelsByAgent);
// checked
router.patch("/:id/status", (0, auth_1.default)("AGENT"), (0, validateRequest_1.default)(parcel_validation_1.updateStatusZodSchema), parcel_controller_1.ParcelController.updateStatus);
router.get("/tracking/:parcelId", (0, auth_1.default)("CUSTOMER"), parcel_controller_1.ParcelController.getTrackingInfo);
router.get('/', (0, auth_1.default)("ADMIN"), parcel_controller_1.ParcelController.getAllParcels);
router.get("/agent/optimized-route", (0, auth_1.default)("AGENT"), parcel_controller_1.ParcelController.getOptimizedRoute);
exports.ParcelRoutes = router;
