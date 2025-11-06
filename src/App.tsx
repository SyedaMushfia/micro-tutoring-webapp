import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Homepage from "./pages/Homepage";
import SignUpPage from "./pages/signupPages/SignUpPage";


const Layout = () => (
  <>
    <Outlet />
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Homepage /> },
      { path: "signup", element: <SignUpPage /> },
    ],
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
