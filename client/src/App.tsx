import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Homepage from "./pages/Homepage";
import SignUpPage from "./pages/signupPages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import TutorDashboard from "./pages/dashboardPages/TutorDashboard";
import ChatPage from "./pages/ChatPage";
import StudentDashboard from "./pages/dashboardPages/StudentDashboard";
import DashboardHome from "./components/studentDashboardComponents/StudentDbHome";
import StudentWallet from "./components/studentDashboardComponents/StudentWallet";
import StudentHistory from "./components/studentDashboardComponents/StudentHistory";
import StudentFavorites from "./components/studentDashboardComponents/StudentFavorites";
import StudentDbHome from "./components/studentDashboardComponents/StudentDbHome";
import TutorDbHome from "./components/tutorDashboardComponents/TutorDbHome";
import TutorEarnings from "./components/tutorDashboardComponents/TutorEarnings";
import TutorHistory from "./components/tutorDashboardComponents/TutorHistory";
import TutorReviews from "./components/tutorDashboardComponents/TutorReviews";


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
      {
        path: "tutorDashboard",
        element: <TutorDashboard />,
        children: [
          { index: true, element: <TutorDbHome /> },
          { path: "earnings", element: <TutorEarnings /> },
          { path: "tutor-history", element: <TutorHistory /> },
          { path: "reviews", element: <TutorReviews /> },
        ]
      },
      {
        path: "studentDashboard",
        element: <StudentDashboard />,
        children: [
          { index: true, element: <StudentDbHome /> },
          { path: "wallet", element: <StudentWallet /> },
          { path: "student-history", element: <StudentHistory /> },
          { path: "favorites", element: <StudentFavorites /> },
        ]
      },
      { path: "chatroom/:sessionId", element: <ChatPage />}
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
