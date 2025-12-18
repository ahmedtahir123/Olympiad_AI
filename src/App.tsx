import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginForm } from './components/Auth/LoginForm';
import { SignupForm } from './components/Auth/SignupForm';
import { Sidebar } from './components/Layout/Sidebar';
import { CertificateView } from './components/Certificate/CertificateView';
import { SchoolAdminDashboard } from './components/SchoolAdmin/Dashboard';
import { EventSelection } from './components/SchoolAdmin/EventSelection';
import { PaymentScreen } from './components/SchoolAdmin/PaymentScreen';
import { ParticipantManagement } from './components/SchoolAdmin/ParticipantManagement';
import { CompetitionDraws } from './components/SchoolAdmin/CompetitionDraws';
import { ResultsView } from './components/SchoolAdmin/ResultsView';
import { ProfileSettings } from './components/SchoolAdmin/ProfileSettings';
import { SuperAdminDashboard } from './components/SuperAdmin/Dashboard';
import { SchoolManagement } from './components/SuperAdmin/SchoolManagement';
import { EventManagement } from './components/SuperAdmin/EventManagement';
import { DrawManagement } from './components/SuperAdmin/DrawManagement';
import { ParticipantOverview } from './components/SuperAdmin/ParticipantOverview';
import { PaymentManagement } from './components/SuperAdmin/PaymentManagement';
import { ResultManagement } from './components/SuperAdmin/ResultManagement';
import { ScheduleManagement } from './components/SuperAdmin/ScheduleManagement';
import { NotificationCenter } from './components/SuperAdmin/NotificationCenter';
import { Trophy } from 'lucide-react';

const AuthenticatedApp: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Routes>
          {/* Certificate Route - Available to all authenticated users */}
          <Route path="/certificate/:resultId" element={<CertificateView />} />
          
          {user?.role === 'super_admin' ? (
            <>
              <Route path="/dashboard" element={<SuperAdminDashboard />} />
              <Route path="/entities" element={<SchoolManagement />} />
              <Route path="/events" element={<EventManagement />} />
              <Route path="/draws" element={<DrawManagement />} />
              <Route path="/participants" element={<ParticipantOverview />} />
              <Route path="/payments" element={<PaymentManagement />} />
              <Route path="/results" element={<ResultManagement />} />
              <Route path="/schedule" element={<ScheduleManagement />} />
              <Route path="/notifications" element={<NotificationCenter />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </>
          ) : (
            <>
              <Route path="/dashboard" element={<SchoolAdminDashboard />} />
              <Route path="/events" element={<EventSelection />} />
              <Route path="/draws" element={<CompetitionDraws />} />
              <Route path="/participants" element={<ParticipantManagement />} />
              <Route path="/payments" element={<PaymentScreen />} />
              <Route path="/results" element={<ResultsView />} />
              <Route path="/profile" element={<ProfileSettings />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </>
          )}
        </Routes>
      </main>
    </div>
  );
};

const AuthScreen: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Saudi Arabia Olympics System</h1>
          <p className="text-blue-100">For Entity Management Platform</p>
        </div>
        
        {showLogin ? (
          <LoginForm onToggleForm={() => setShowLogin(false)} />
        ) : (
          <SignupForm onToggleForm={() => setShowLogin(true)} />
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Saudi Arabia Olympics System...</p>
        </div>
      </div>
    );
  }

  return user ? <AuthenticatedApp /> : <AuthScreen />;
};

export default App;