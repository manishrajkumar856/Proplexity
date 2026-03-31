import { createBrowserRouter } from "react-router";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Protected from "../features/auth/components/Protected";
import Dashbord from "../features/chat/pages/Dashbord";

export const router = createBrowserRouter([
    {path: '/login', element: <Login />},
    {path: '/register', element: <Register />},
    {path: '/', element: <Protected > <Dashbord /> </Protected>}
])