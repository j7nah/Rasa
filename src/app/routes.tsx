import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import NewEntry from "./pages/NewEntry";
import EditEntry from "./pages/EditEntry";
import ViewEntry from "./pages/ViewEntry";
import Entries from "./pages/Entries";
import Profile from "./pages/Profile";
import Queue from "./pages/Queue";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/new",
    Component: NewEntry,
  },
  {
    path: "/entries",
    Component: Entries,
  },
  {
    path: "/profile",
    Component: Profile,
  },
  {
    path: "/queue",
    Component: Queue,
  },
  {
    path: "/entry/:id",
    Component: ViewEntry,
  },
  {
    path: "/edit/:id",
    Component: EditEntry,
  },
]);
