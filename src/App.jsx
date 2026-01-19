import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { QuestionProvider } from './context/QuestionContext';

import Dashboard from './pages/Dashboard/Dashboard';
import QuestionsList from './pages/Questions/QuestionsList';
import QuestionForm from './pages/Form/QuestionForm';
import TopicsView from './pages/Topics/TopicsView';

function App() {
  return (
    <Router>
      <QuestionProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/questions" element={<QuestionsList />} />
            <Route path="/add" element={<QuestionForm />} />
            <Route path="/edit/:id" element={<QuestionForm />} />
            <Route path="/topics" element={<TopicsView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </QuestionProvider>
    </Router>
  );
}

export default App;
