import React from 'react';

const InfoFooter = ({ darkMode }) => {
  return (
    <div className="text-center mt-8">
      <p className={`text-sm ${
        darkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        💡 <strong>Nuove funzionalità:</strong><br/>
        • Tariffe personalizzabili per tutti i comuni italiani<br/>
        • Report mensili per il portale Gecos<br/>
        • Filtri avanzati per analisi dettagliate<br/>
        • Dark mode e interfaccia moderna<br/>
        • Sistema di autenticazione sicuro<br/>
        • Paginazione intelligente per grandi dataset
      </p>
    </div>
  );
};

export default InfoFooter;