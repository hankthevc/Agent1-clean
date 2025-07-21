import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppContent } from './AppContent'; // We will move the main app logic here
import { PaymentSuccess } from './components/PaymentSuccess';
import { PaymentCanceled } from './components/PaymentCanceled';
import { usePremiumContent } from './hooks/usePremiumContent';

/**
 * ==============================================================================
 * Main App Component
 * ==============================================================================
 * 
 * This component now serves as the root of the application, handling routing
 * and the integration of the premium content model.
 * 
 * ==============================================================================
 */

function App() {
  const { addCreditsOnSuccess } = usePremiumContent();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route 
          path="/payment-success" 
          element={<PaymentSuccess onSuccess={addCreditsOnSuccess} />} 
        />
        <Route path="/payment-canceled" element={<PaymentCanceled />} />
      </Routes>
    </Router>
  );
}

export default App;
