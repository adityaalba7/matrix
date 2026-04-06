import { createBrowserRouter } from "react-router";
import RootLayout from "./components/RootLayout";
import HomeDashboard from "./pages/HomeDashboard";
import StudyDashboard from "./pages/StudyDashboard";
import FinanceDashboard from "./pages/FinanceDashboard";
import InterviewDashboard from "./pages/InterviewDashboard";
import ProfileDashboard from "./pages/ProfileDashboard";
import Onboarding from "./pages/Onboarding";
import GamificationHub from "./pages/GamificationHub";
import AITools from "./pages/AITools";
import ShareableCards from "./pages/ShareableCards";

export const router = createBrowserRouter([
  {
    path: "/onboarding",
    Component: Onboarding,
  },
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomeDashboard },
      { path: "study", Component: StudyDashboard },
      { path: "finance", Component: FinanceDashboard },
      { path: "interview", Component: InterviewDashboard },
      { path: "profile", Component: ProfileDashboard },
      { path: "rewards", Component: GamificationHub },
      { path: "tools", Component: AITools },
      { path: "share", Component: ShareableCards },
    ],
  },
]);
