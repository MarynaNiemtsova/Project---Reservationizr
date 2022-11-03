import { Outlet } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";

const ProtectedRoute = () => <Outlet />;

export default withAuthenticationRequired(ProtectedRoute, {
  onRedirecting: () => <p>Loading</p>,
});
