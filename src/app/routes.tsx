import { createBrowserRouter } from "react-router";
import Intro from "./pages/Intro";
import SmeAuth from "./pages/sme/SmeAuth";
import BusinessSetup from "./pages/sme/BusinessSetup";
import SmeLayout from "./pages/sme/SmeLayout";
import SmeDashboard from "./pages/sme/SmeDashboard";
import MyBusinesses from "./pages/sme/MyBusinesses";
import MyApplications from "./pages/sme/MyApplications";
import NewApplication from "./pages/sme/NewApplication";
import ApplicationSuccess from "./pages/sme/ApplicationSuccess";
import ApplicationTracking from "./pages/sme/ApplicationTracking";
import OfferLetter from "./pages/sme/OfferLetter";
import PostDocs from "./pages/sme/PostDocs";
import BankAuth from "./pages/bank/BankAuth";
import BankLayout from "./pages/bank/BankLayout";
import BankPortal from "./pages/bank/BankPortal";
import SbpAuth from "./pages/sbp/SbpAuth";
import SbpLayout from "./pages/sbp/SbpLayout";
import SbpPortal from "./pages/sbp/SbpPortal";

export const router = createBrowserRouter([
  { path: "/", Component: Intro },
  { path: "/sme/login", Component: SmeAuth },
  { path: "/sme/setup", Component: BusinessSetup },
  {
    path: "/sme",
    Component: SmeLayout,
    children: [
      { index: true, Component: SmeDashboard },
      { path: "businesses", Component: MyBusinesses },
      { path: "applications", Component: MyApplications },
      { path: "apply", Component: NewApplication },
      { path: "success", Component: ApplicationSuccess },
      { path: "tracking", Component: ApplicationTracking },
      { path: "offer", Component: OfferLetter },
      { path: "post-docs", Component: PostDocs },
    ],
  },
  { path: "/bank/login", Component: BankAuth },
  {
    path: "/bank",
    Component: BankLayout,
    children: [
      { index: true, Component: BankPortal },
    ],
  },
  { path: "/sbp/login", Component: SbpAuth },
  {
    path: "/sbp",
    Component: SbpLayout,
    children: [
      { index: true, Component: SbpPortal },
    ],
  },
]);
