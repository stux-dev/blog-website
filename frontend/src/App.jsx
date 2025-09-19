
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./AppRoutes"; 
import { LoadingProvider } from "./context/LoadingContext";
import { AnimatePresence } from "framer-motion";

function App() {
  return (
    <Router>
      <AuthProvider>
        <LoadingProvider>
          <AnimatePresence mode="wait">
            <AppRoutes />
          </AnimatePresence>
        </LoadingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
