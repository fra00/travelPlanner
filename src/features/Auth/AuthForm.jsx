import React, { useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import Button from "../../components/ui/Button";
import FormInput from "../../components/ui/FormInput";

function AuthForm() {
  const [authLoading, setAuthLoading] = useState(false);
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const clearMessages = () => {
    setError("");
    setMessage("");
  };

  const handleAuthAction = async (e) => {
    e.preventDefault();
    clearMessages();
    setAuthLoading(true);
    try {
      const credentials = { email, password };
      let response;

      if (isRegister) {
        response = await supabase.auth.signUp(credentials);
        if (!response.error) {
          setMessage(
            "Registrazione avvenuta! Controlla la tua email per confermare l'account."
          );
        }
      } else {
        // Per il login, non mostriamo un messaggio di successo.
        // L'onAuthStateChange gestirà la chiusura del modale e l'aggiornamento dell'UI.
        response = await supabase.auth.signInWithPassword(credentials);
      }
      if (response.error) {
        setError(response.error.message);
      }
    } catch (error) {
      setError(error.error_description || error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      setError(
        "Per favore, inserisci la tua email per ricevere il magic link."
      );
      return;
    }
    clearMessages();
    setMagicLinkLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
      });
      if (error) throw error;
      setMessage("Controlla la tua email per il link di accesso!");
    } catch (error) {
      setError(error.error_description || error.message);
    } finally {
      setMagicLinkLoading(false);
    }
  };

  return (
    <div className="p-2">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              clearMessages();
            }}
            className={`${
              !isRegister
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm focus:outline-none`}
          >
            Accedi
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              clearMessages();
            }}
            className={`${
              isRegister
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm focus:outline-none`}
          >
            Registrati
          </button>
        </nav>
      </div>

      {/* Form Content */}
      <div className="pt-6">
        <form onSubmit={handleAuthAction} className="space-y-4">
          <FormInput
            label="Email"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="iltuonome@email.com"
          />
          <FormInput
            label="Password (min. 6 caratteri)"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            minLength="6"
          />
          <Button
            type="submit"
            disabled={authLoading || magicLinkLoading}
            className="w-full"
          >
            {authLoading ? "Caricamento..." : isRegister ? "Registrati" : "Accedi"}
          </Button>
        </form>

        {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {!isRegister && (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Oppure</span>
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={handleMagicLink}
              disabled={authLoading || magicLinkLoading || !email}
              className="w-full"
            >
              {magicLinkLoading ? "Invio in corso..." : "Accedi con Magic Link"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default AuthForm;
