import React, { useState } from 'react';
import './LandingPage.css';
import SignupPage from '../SignUpPage/SignUpPage';
import LoginPage from '../LogInPage/LogInPage';

const LandingPage = () => {
    const [view, setView] = useState('landing');

    const renderContent = () => {
        return (
            <>
            <div className="landing-page">
                <h1>Welcome to marKus_biKus</h1>

                {view === 'login' && <LoginPage onBack={() => setView('landing')} />}
                {view === 'signup' && <SignupPage onBack={() => setView('landing')} />}
                {view === 'landing' && (
                    <div className="landing-content">
                        <p>Your one-stop shop for all your biking needs.</p>
                        <button className="shop-now-btn mx-2" onClick={() => setView('login')}>Log In</button>
                        <button className="shop-now-btn mx-2" onClick={() => setView('signup')}>Sign Up</button>
                    </div>
                )}
            </div>
            </>
        );
    };

    return (
        <div className="landing-page">
            {renderContent()}
        </div>
    );
};

export default LandingPage;
