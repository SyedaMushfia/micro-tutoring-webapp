import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Homepage from "./pages/Homepage";
import SignUpPage from "./pages/signupPages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import TutorDashboard from "./pages/dashboardPages/TutorDashboard";
import ChatPage from "./pages/ChatPage";
import StudentDashboard from "./pages/dashboardPages/StudentDashboard";


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
      { path: "login", element: <LoginPage /> },
      { path: "tutorDashboard", element: <TutorDashboard />},
      { path: "studentDashboard", element: <StudentDashboard />},
      { path: "chatroom", element: <ChatPage />}
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
