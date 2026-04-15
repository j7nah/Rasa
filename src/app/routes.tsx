import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import NewEntry from "./pages/NewEntry";
import EditEntry from "./pages/EditEntry";
import ViewEntry from "./pages/ViewEntry";

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
    path: "/entry/:id",
    Component: ViewEntry,
  },
  {
    path: "/edit/:id",
    Component: EditEntry,
  },
]);
