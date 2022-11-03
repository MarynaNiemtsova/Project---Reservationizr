import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import ProtectedRoute from "./auth/ProtectedRoute";
import Header from "./components/Header";
import Reservation from "./components/Reservation";
import ReservationList from "./components/ReservationList";
import RestaurantList from "./components/RestaurantList";
import Restaurant from "./components/Restaurant";

const App = () => {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/restaurants/:id" element={<ProtectedRoute />}>
            <Route path="/restaurants/:id" element={<Restaurant />} />
          </Route>

          <Route path="/reservations" element={<ProtectedRoute />}>
            <Route path="/reservations" element={<ReservationList />} />
          </Route>
          <Route path="/reservations/:id" element={<ProtectedRoute />}>
            <Route path="/reservations/:id" element={<Reservation />} />
          </Route>
          <Route path="/" element={<RestaurantList />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
