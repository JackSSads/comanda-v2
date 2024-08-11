import { Routes, Route, Navigate } from "react-router-dom";

import { PrivateRoute } from "./PrivateRoute";

import {
    Admin,
    Login,
    ListingChecks,
    Bartender,
    Cousine,
    Waiter,
    ListingProduts,
    CloseCheck,
    ClosedChecks,
    ManageUser,
    CreateProdut,
    EditProduct,
    ShowEditProducts,
} from "../pages";

export const AppRoutes = () => {

    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route path={`/garcom/comandas`} element={
                <PrivateRoute>
                    <ListingChecks />
                </PrivateRoute>
            } />

            <Route path={`/cozinha/producao`} element={
                <PrivateRoute>
                    <Cousine />
                </PrivateRoute>
            } />

            <Route path={`/barmen/producao`} element={
                <PrivateRoute>
                    <Bartender />
                </PrivateRoute>
            } />

            <Route path={`/garcom/comanda/:id`} element={
                <PrivateRoute>
                    <Waiter />
                </PrivateRoute>
            } />
            <Route path={`/garcom/comanda/:id/add-product`} element={
                <PrivateRoute>
                    <ListingProduts />
                </PrivateRoute>
            } />
            <Route path={`/garcom/comanda/:id/fechar-comanda`} element={
                <PrivateRoute>
                    <CloseCheck />
                </PrivateRoute>
            } />

            <Route path={`/admin`} element={
                <PrivateRoute>
                    <Admin />
                </PrivateRoute>
            } />
            <Route path={`/usuarios`} element={
                <PrivateRoute>
                    <ManageUser />
                </PrivateRoute>
            } />
            <Route path={`/comandasFinalizadas`} element={
                <PrivateRoute>
                    <ClosedChecks />
                </PrivateRoute>
            } />

            <Route path={`/produtos`} element={
                <PrivateRoute>
                    <ShowEditProducts />
                </PrivateRoute>
            } />

            <Route path="*" element={<Navigate to={"/login"} />} />
        </Routes>
    );
};