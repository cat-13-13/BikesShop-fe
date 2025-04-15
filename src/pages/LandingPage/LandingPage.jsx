import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import SignupPage from '../SignUpPage/SignUpPage';
import LoginPage from '../LogInPage/LogInPage';
import { AuthContext } from '../../contexts/auth.context';

const LandingPage = () => {
    const [view, setView] = useState('landing');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const renderContent = () => {
        return (
            <>
                <h1>Welcome to marKus_biKus</h1>

                {view === 'login' && <LoginPage onBack={() => setView('landing')} />}
                {view === 'signup' && <SignupPage onBack={() => setView('landing')} />}
                {view === 'landing' && (
                    <div className="landing-content">
                        <p>Your one-stop shop for all your biking needs.</p>
                        {user ? (
                            <button className="shop-now-btn mx-2" onClick={() => navigate('/')}>Shop Now</button>
                        ) : (
                            <>
                                <button className="shop-now-btn mx-2" onClick={() => setView('login')}>Log In</button>
                                <button className="shop-now-btn mx-2" onClick={() => setView('signup')}>Sign Up</button>
                            </>
                        )}
                    </div>
                )}
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
