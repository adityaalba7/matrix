import { createBrowserRouter, Navigate } from "react-router";
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
import MissionControl from "./pages/MissionControl";
import NeuralEditor from "./pages/NeuralEditor";
import ArtifactVault from "./pages/ArtifactVault";
import LandingPage from "./pages/LandingPage";

// AI Tool Pages
import RoastResume from "./pages/aitools/RoastResume";
import CGPAEstimator from "./pages/aitools/CGPAEstimator";
import CodeMentor from "./pages/aitools/CodeMentor";
import SmartNotes from "./pages/aitools/SmartNotes";
import LectureRecorder from "./pages/aitools/LectureRecorder";
import ScholarshipRadar from "./pages/aitools/ScholarshipRadar";
import ResumeGap from "./pages/aitools/ResumeGap";
import MonthlyWrap from "./pages/aitools/MonthlyWrap";
import SpacedRepetition from "./pages/aitools/SpacedRepetition";

export const router = createBrowserRouter([
  // Landing page — root URL
  {
    path: "/",
    Component: LandingPage,
  },
  // Auth / onboarding — standalone
  {
    path: "/onboarding",
    Component: Onboarding,
  },
  // Legacy /landing alias
  {
    path: "/landing",
    element: <Navigate to="/" replace />,
  },
  // Stitch dashboard pages — standalone
  {
    path: "/mission-control",
    Component: MissionControl,
  },
  {
    path: "/neural-editor",
    Component: NeuralEditor,
  },
  {
    path: "/artifact-vault",
    Component: ArtifactVault,
  },
  // Main app shell — all authenticated pages under /app
  {
    path: "/app",
    Component: RootLayout,
    children: [
      { index: true, Component: HomeDashboard },
      { path: "study", Component: StudyDashboard },
      { path: "finance", Component: FinanceDashboard },
      { path: "interview", Component: InterviewDashboard },
      { path: "profile", Component: ProfileDashboard },
      { path: "rewards", Component: GamificationHub },
      { path: "tools", Component: AITools },
      { path: "tools/roast", Component: RoastResume },
      { path: "tools/cgpa", Component: CGPAEstimator },
      { path: "tools/code", Component: CodeMentor },
      { path: "tools/notes", Component: SmartNotes },
      { path: "tools/lecture", Component: LectureRecorder },
      { path: "tools/scholarship", Component: ScholarshipRadar },
      { path: "tools/resume-gap", Component: ResumeGap },
      { path: "tools/wrap", Component: MonthlyWrap },
      { path: "tools/spaced", Component: SpacedRepetition },
      { path: "share", Component: ShareableCards },
    ],
  },
]);

