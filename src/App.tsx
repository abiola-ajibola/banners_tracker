import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./pages/Home";
import { LocationsProvider } from "./contexts/locations.Provider";

import "./App.css";
import { AddLocation } from "./pages/AddLocation";
import { Nav } from "./components/Nav";
import { AddedLocations } from "./pages/Locations";
import { UserDataProvider } from "./contexts/userData.Provider";
import { Email } from "./pages/Email";
import { APIProvider } from "@vis.gl/react-google-maps";
import { VerifyEmail } from "./pages/VerifyEmail";
import { Toaster } from "./components/Toast";
import { ConfirmLogin } from "./pages/ConfirmLogin";
import { AdminGuard } from "./components/AdminGuard";
import { AdminHome } from "./pages/AdminHome";
import { adminLinks, links } from "./lib/routes";
import { AllUsers } from "./pages/AllUsers";

const { VITE_GOOGLE_MAPS_API_KEY } = import.meta.env;



const router = createBrowserRouter([
  {
    path: "",
    element: <Nav links={links} adminLinks={adminLinks} />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/verify_message",
        element: <VerifyEmail />,
      },
      {
        path: "/otp",
        element: <ConfirmLogin />,
      },
      {
        path: "/locations",
        element: <AddedLocations />,
      },
      {
        path: "/location",
        element: <AddLocation />,
      },
      {
        path: "/admin",
        element: <AdminGuard />,
        children: [
          { path: "", element: <AdminHome links={adminLinks} /> },
          { path: "all-users", element: <AllUsers /> },
          { path: "all-locations", element: <h1>All Locations</h1> },
        ],
      },
      { path: "/location/:id", element: <AddLocation /> },
      {
        path: "/auth/email",
        element: <Email />,
      },
      { path: "/auth/token_expired", element: <Email expired /> },
    ],
  },
]);

function App() {
  return (
    <LocationsProvider>
      <UserDataProvider>
        <APIProvider
          apiKey={VITE_GOOGLE_MAPS_API_KEY}
          onLoad={() => console.log("Map Loaded")}
        >
          <RouterProvider router={router} />
          <Toaster />
        </APIProvider>
      </UserDataProvider>
    </LocationsProvider>
  );
}

export default App;
