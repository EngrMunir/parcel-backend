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
exports.userService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
            role: true,
        },
    });
    return user;
});
const getAllUsers = (role) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = {};
    if (role) {
        filter.role = role;
    }
    const users = yield prisma_1.default.user.findMany({
        where: filter,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });
    return users;
});
exports.userService = {
    getUserById,
    getAllUsers
};
