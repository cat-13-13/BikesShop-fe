import AppRoutes from './../routes/AppRoutes'
import Navigation from './../components/Navigation/Navigation'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import { useLocation } from 'react-router-dom';

function App() {
    const location = useLocation();

    return (
        <div className="App">
            {location.pathname !== '/landing' && <Navigation />}
            <AppRoutes />
        </div>
    );
}

export default App;
