"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const parcel_service_1 = require("./parcel.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
// checked
const createParcel = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const result = yield parcel_service_1.ParcelService.createParcel(userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Parcel booked successfully",
        data: result,
    });
}));
// checked
const getParcelsByCustomer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const result = yield parcel_service_1.ParcelService.getParcelsByCustomer(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Parcels retrieved successfully",
        data: result,
    });
}));
// checked
const getParcelsByAgent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const agentId = req.params.id;
    const result = yield parcel_service_1.ParcelService.getParcelsByAgent(agentId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Parcels assigned to agent retrieved successfully",
        data: result,
    });
}));
// checked
const assignAgent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parcelId = req.params.id;
    const { agentId } = req.body;
    const result = yield parcel_service_1.ParcelService.assignAgentToParcel(parcelId, agentId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Agent assigned successfully",
        data: result,
    });
}));
// checked
const updateStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const parcelId = req.params.id;
    const agentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const result = yield parcel_service_1.ParcelService.updateParcelStatus(parcelId, agentId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Parcel status updated successfully",
        data: result,
    });
}));
// checked
const getTrackingInfo = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const parcelId = req.params.parcelId;
    const customerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const result = yield parcel_service_1.ParcelService.getParcelTrackingInfo(parcelId, customerId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Parcel tracking info retrieved",
        data: result,
    });
}));
const getAllParcels = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield parcel_service_1.ParcelService.getAllParcels();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All parcels retrieved successfully",
        data: result,
    });
}));
exports.ParcelController = {
    createParcel,
    getParcelsByCustomer,
    assignAgent,
    getParcelsByAgent,
    updateStatus,
    getTrackingInfo,
    getAllParcels
};
