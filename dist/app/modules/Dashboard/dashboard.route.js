"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminDashboardRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const dashboard_controller_1 = require("./dashboard.controller");
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)("ADMIN"), dashboard_controller_1.DashboardController.getDashboard);
exports.AdminDashboardRoutes = router;
