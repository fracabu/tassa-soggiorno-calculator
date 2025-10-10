import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { login, forgotPassword } from '../services/api';

const LoginPage = ({ onLoginSuccess, darkMode }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await login(formData.email, formData.password);
      onLoginSuccess(data);
    } catch (err) {
      setError(err.message || 'Credenziali non valide');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await forgotPassword(forgotEmail);
      setForgotSuccess(true);
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotSuccess(false);
      }, 5000);
    } catch (err) {
      setError(err.message || 'Errore durante il recupero password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="w-full max-w-md">
        {/* Logo e Titolo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6 hover:opacity-80 transition-opacity">
            <img
              src="/logo.svg"
              alt="Taxly Logo"
              className="w-12 h-12 rounded-lg"
            />
            <span className={`text-2xl font-extrabold tracking-tight ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`} style={{ fontFamily: "'Poppins', 'SF Pro Display', -apple-system, sans-serif", letterSpacing: '-0.03em', fontWeight: 700 }}>
              Taxly
            </span>
          </Link>
          <h1 className={`text-2xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Accedi al tuo Account
          </h1>
          <p className={`mt-2 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Calcolo Tassa di Soggiorno
          </p>
        </div>

        {/* Form Login */}
        <div className={`rounded-lg shadow-xl p-8 ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        }`}>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="nome@esempio.com"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-end mb-4">
              <button
                type="button"
                onClick={() => setShowForgotPassword(!showForgotPassword)}
                className={`text-sm ${
                  darkMode
                    ? 'text-blue-400 hover:text-blue-300'
                    : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                Password dimenticata?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : darkMode
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {loading ? 'Accesso in corso...' : 'Accedi'}
            </button>
          </form>

          {/* Form Password Dimenticata */}
          {showForgotPassword && (
            <div className={`mt-4 p-4 rounded-lg ${
              darkMode ? 'bg-gray-700' : 'bg-blue-50'
            }`}>
              {forgotSuccess ? (
                <div className="text-center">
                  <p className={`text-sm ${
                    darkMode ? 'text-green-400' : 'text-green-600'
                  }`}>
                    ✓ Email inviata! Controlla la tua casella di posta.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword}>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Inserisci la tua email per recuperare la password
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className={`flex-1 px-4 py-2 rounded-lg border ${
                        darkMode
                          ? 'bg-gray-600 border-gray-500 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="email@example.com"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
                    >
                      Invia
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          <div className="mt-6 text-center">
            <p className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Non hai un account?{' '}
              <Link
                to="/register"
                className={`font-medium ${
                  darkMode
                    ? 'text-blue-400 hover:text-blue-300'
                    : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                Registrati
              </Link>
            </p>
          </div>
        </div>

        {/* Privacy */}
        <p className={`text-xs text-center mt-6 ${
          darkMode ? 'text-gray-500' : 'text-gray-500'
        }`}>
          🔒 I tuoi dati sono al sicuro. I file vengono elaborati solo nel tuo browser.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
