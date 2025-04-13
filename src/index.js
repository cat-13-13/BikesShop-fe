import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProviderWrapper } from './contexts/auth.context';
import { UserProvider } from './contexts/user.context';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <AuthProviderWrapper>
            <UserProvider>
                <Router>
                    <App />
                </Router>
            </UserProvider>
        </AuthProviderWrapper>
    </React.StrictMode>
);

