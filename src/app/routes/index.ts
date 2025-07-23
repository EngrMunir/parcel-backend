import express from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { userRoutes } from '../modules/User/user.route';
import { AdminDashboardRoutes } from '../modules/Dashboard/dashboard.route';
import { ParcelRoutes } from '../modules/Parcel/parcel.route';

const router = express.Router();

const moduleRoutes =[
    {
        path:'/users',
        route: userRoutes
    },
    {
        path:'/auth',
        route:AuthRoutes
    },
    {
        path:'/parcels',
        route:ParcelRoutes
    },
    {
        path:"/dashboard", 
        route: AdminDashboardRoutes
    }
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;