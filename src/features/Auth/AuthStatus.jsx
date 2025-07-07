import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { supabase } from "../../utils/supabaseClient";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import AuthForm from "./AuthForm";
import { FaSignInAlt, FaSignOutAlt, FaUserCircle } from "react-icons/fa";

function AuthStatus() {
  const { user, session, loading } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Chiude il modale automaticamente quando l'utente effettua il login
  useEffect(() => {
    if (session) {
      setIsLoginModalOpen(false);
    }
  }, [session]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Caricamento...</div>;
  }

  if (session && user) {
    return (
      <div className="flex items-center space-x-2">
        <FaUserCircle className="text-gray-600" />
        <span className="text-sm text-gray-700 hidden sm:inline">
          {user.email}
        </span>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleLogout}
          title="Logout"
        >
          <FaSignOutAlt />
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button variant="secondary" onClick={() => setIsLoginModalOpen(true)}>
        <FaSignInAlt className="mr-2" />
        Login / Registrati
      </Button>
      <Modal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="Accedi o Registrati"
      >
        <AuthForm />
      </Modal>
    </>
  );
}

export default AuthStatus;
