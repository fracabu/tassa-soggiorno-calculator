import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BuildingOffice2Icon,
  ShieldCheckIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import CookiePolicy from './CookiePolicy';
import CookieBanner from './CookieBanner';
import { register } from '../services/api';

const LandingPage = ({ onRegisterSuccess, darkMode }) => {
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await register(formData);

      setSuccess(true);
      // Token e user già salvati da api.js

      // Reindirizza all'app dopo 1.5 secondi
      setTimeout(() => {
        onRegisterSuccess(data);
      }, 1500);
    } catch (err) {
      setError(err.message || 'Errore durante la registrazione');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Fixed Header */}
      <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b ${
        darkMode
          ? 'bg-gray-900/80 border-gray-800'
          : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className={`p-2 rounded-lg ${
                darkMode ? 'bg-blue-600' : 'bg-blue-500'
              }`}>
                <BuildingOffice2Icon className="w-6 h-6 text-white" />
              </div>
              <span className={`text-lg font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Tassa Soggiorno
              </span>
            </Link>

            {/* Buttons */}
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  darkMode
                    ? 'text-gray-300 hover:bg-gray-800'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Accedi
              </Link>
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  darkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('register-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Registrati
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className={`relative overflow-hidden mt-16 ${
        darkMode
          ? 'bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900'
          : 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600'
      }`}>
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-semibold mb-6 border border-white/20">
              <SparklesIcon className="w-4 h-4 mr-2" />
              <span>Gratuito • Sicuro • Professionale</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              Gestisci la Tassa di Soggiorno
              <br />
              <span className="text-blue-200">in Modo Automatico</span>
            </h1>

            <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Il tool professionale per hotel, B&B e strutture ricettive.
              Calcola, analizza ed esporta in pochi click.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <div className="flex items-center space-x-2 text-white">
                <CheckCircleIcon className="w-5 h-5 text-green-300" />
                <span className="text-sm font-medium">100% Gratuito</span>
              </div>
              <div className="flex items-center space-x-2 text-white">
                <CheckCircleIcon className="w-5 h-5 text-green-300" />
                <span className="text-sm font-medium">Tutti i Comuni Italiani</span>
              </div>
              <div className="flex items-center space-x-2 text-white">
                <CheckCircleIcon className="w-5 h-5 text-green-300" />
                <span className="text-sm font-medium">Privacy Garantita</span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('register-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 rounded-lg font-bold text-lg hover:bg-gray-50 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Inizia Gratis Ora
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-500 rounded-full opacity-10 blur-3xl" />
      </header>

      {/* Come Funziona */}
      <section className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Come Funziona
            </h2>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              3 semplici passaggi per calcolare la tassa di soggiorno
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className={`relative p-8 rounded-2xl ${
              darkMode ? 'bg-gray-700' : 'bg-gray-50'
            } hover:shadow-xl transition-shadow`}>
              <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-xl mb-6">
                <BuildingOffice2Icon className="w-8 h-8 text-white" />
              </div>
              <div className="absolute top-8 right-8 text-6xl font-bold text-indigo-600/10">
                01
              </div>
              <h3 className={`text-xl font-bold mb-3 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Seleziona il Comune
              </h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Scegli il tuo comune tra tutti quelli italiani. Le regole e tariffe vengono caricate automaticamente.
              </p>
            </div>

            {/* Step 2 */}
            <div className={`relative p-8 rounded-2xl ${
              darkMode ? 'bg-gray-700' : 'bg-gray-50'
            } hover:shadow-xl transition-shadow`}>
              <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-xl mb-6">
                <DocumentTextIcon className="w-8 h-8 text-white" />
              </div>
              <div className="absolute top-8 right-8 text-6xl font-bold text-indigo-600/10">
                02
              </div>
              <h3 className={`text-xl font-bold mb-3 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Carica il File
              </h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Upload dei tuoi file Excel o CSV da Booking.com, Airbnb o altri portali. Tutto elaborato nel browser.
              </p>
            </div>

            {/* Step 3 */}
            <div className={`relative p-8 rounded-2xl ${
              darkMode ? 'bg-gray-700' : 'bg-gray-50'
            } hover:shadow-xl transition-shadow`}>
              <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-xl mb-6">
                <ChartBarIcon className="w-8 h-8 text-white" />
              </div>
              <div className="absolute top-8 right-8 text-6xl font-bold text-indigo-600/10">
                03
              </div>
              <h3 className={`text-xl font-bold mb-3 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Scarica i Report
              </h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Esporta i calcoli in CSV per la contabilità o PDF per l'archivio. Pronto per GECOS e altri portali.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <ShieldCheckIcon className="w-8 h-8 text-green-500 flex-shrink-0" />
              <div>
                <h3 className={`text-lg font-bold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Privacy Totale
                </h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  I dati vengono elaborati solo nel tuo browser. Nessun caricamento su server esterni.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <CheckCircleIcon className="w-8 h-8 text-blue-500 flex-shrink-0" />
              <div>
                <h3 className={`text-lg font-bold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Sempre Aggiornato
                </h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Regole e tariffe 2025 per tutti i comuni italiani. Aggiornamenti automatici.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <DocumentTextIcon className="w-8 h-8 text-purple-500 flex-shrink-0" />
              <div>
                <h3 className={`text-lg font-bold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Export Multipli
                </h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Esporta in CSV, PDF. Compatibile con GECOS e altri portali comunali.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section id="register-section" className={`min-h-screen flex items-center ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
          <div className="text-center mb-4">
            <h2 className={`text-xl sm:text-2xl font-bold mb-1 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Inizia Subito Gratuitamente
            </h2>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Crea il tuo account in 30 secondi
            </p>
          </div>

          <div className={`p-5 rounded-xl shadow-lg ${
            darkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            {success ? (
              <div className="text-center py-8">
                <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className={`text-2xl font-bold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Registrazione Completata!
                </h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Reindirizzamento all'applicazione...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs">
                    {error}
                  </div>
                )}

                <div>
                  <label className={`block text-xs font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Nome *
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm ${
                      darkMode
                        ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Mario"
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Cognome *
                  </label>
                  <input
                    type="text"
                    name="cognome"
                    value={formData.cognome}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm ${
                      darkMode
                        ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Rossi"
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm ${
                      darkMode
                        ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="mario.rossi@hotel.it"
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm ${
                      darkMode
                        ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Minimo 8 caratteri"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold text-base hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Registrazione...
                    </>
                  ) : (
                    <>
                      Crea Account Gratuito
                      <ArrowRightIcon className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Hai già un account?{' '}
                    <Link
                      to="/login"
                      className={`font-medium ${
                        darkMode
                          ? 'text-indigo-400 hover:text-indigo-300'
                          : 'text-indigo-600 hover:text-indigo-700'
                      }`}
                    >
                      Accedi
                    </Link>
                  </p>
                </div>

                <p className={`text-center text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Registrandoti accetti i nostri{' '}
                  <Link
                    to="/terms"
                    className="text-indigo-600 hover:text-indigo-700 font-medium underline"
                  >
                    Termini di Servizio
                  </Link>
                  {' '}e la{' '}
                  <Link
                    to="/privacy"
                    className="text-indigo-600 hover:text-indigo-700 font-medium underline"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-t`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              © 2025 Tassa Soggiorno Calculator. Made with ❤️ for Italian hosts.
            </p>
          </div>
          <div className="flex justify-center space-x-6 text-sm">
            <Link
              to="/privacy"
              className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'} underline`}
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'} underline`}
            >
              Termini di Servizio
            </Link>
            <Link
              to="/cookie-policy"
              className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'} underline`}
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
