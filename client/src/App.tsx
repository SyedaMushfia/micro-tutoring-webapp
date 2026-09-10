import { Suspense, lazy } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

const Homepage = lazy(() => import("./pages/Homepage"));
const SignUpPage = lazy(() => import("./pages/signupPages/SignUpPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const TutorDashboard = lazy(() => import("./pages/dashboardPages/TutorDashboard"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const StudentDashboard = lazy(() => import("./pages/dashboardPages/StudentDashboard"));
const StudentWallet = lazy(() => import("./components/studentDashboardComponents/StudentWallet"));
const StudentHistory = lazy(() => import("./components/studentDashboardComponents/StudentHistory"));
const StudentFavorites = lazy(() => import("./components/studentDashboardComponents/StudentFavorites"));
const StudentDbHome = lazy(() => import("./components/studentDashboardComponents/StudentDbHome"));
const TutorDbHome = lazy(() => import("./components/tutorDashboardComponents/TutorDbHome"));
const TutorEarnings = lazy(() => import("./components/tutorDashboardComponents/TutorEarnings"));
const TutorHistory = lazy(() => import("./components/tutorDashboardComponents/TutorHistory"));
const TutorReviews = lazy(() => import("./components/tutorDashboardComponents/TutorReviews"));
const TutorSettings = lazy(() => import("./components/tutorDashboardComponents/TutorSettings"));
const StudentSettings = lazy(() => import("./components/studentDashboardComponents/StudentSettings"));
const HelpSection = lazy(() => import("./components/HelpSection"));

const Layout = () => <Outlet />;

const PageLoader = () => (
  <div className='flex min-h-screen items-center justify-center bg-[#f4f6fb] text-[#2e294e]'>
    <div className='text-lg font-medium'>Loading...</div>
  </div>
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
          { path: "settings", element: <TutorSettings /> },
          { path: "help", element: <HelpSection role="tutor" /> },
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
          { path: "settings", element: <StudentSettings /> },
          { path: "help", element: <HelpSection role="student" /> },
        ]
      },
      { path: "chatroom/:sessionId", element: <ChatPage />}
    ],
  },
]);

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
