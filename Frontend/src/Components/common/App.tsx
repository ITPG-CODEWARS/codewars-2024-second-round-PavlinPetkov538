import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import NotFound from "./NotFound";
import { AuthProvider } from "../auth/AuthContext";
import Login from "../auth/Login";
import Register from "../auth/Register";
import OpenUrlComponent from "./openurl";
import MyUrls from "./mine";
import ProtectedRoute from "./ProtectedRoute";

const AppContent: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/mine" element={<MyUrls />} />
        </Route>
        <Route path=":suffix" element={<OpenUrlComponent />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App: React.FC = () => (
  <Router>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </Router>
);

export default App;
