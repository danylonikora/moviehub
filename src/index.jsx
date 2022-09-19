import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  HashRouter,
  Route,
  createHashRouter,
} from "react-router-dom";
import App from "./App";
import Auth from "./components/Auth";
import PreferencesForm from "./components/PreferencesForm";

const root = createRoot(document.querySelector("#react-root"));

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Auth /> },
      { path: "/form", element: <PreferencesForm /> },
    ],
  },
]);

root.render(<RouterProvider router={router} />);
