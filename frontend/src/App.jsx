
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./AppRoutes"; 
import { LoadingProvider } from "./context/LoadingContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <LoadingProvider>
          <AppRoutes />
        </LoadingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
