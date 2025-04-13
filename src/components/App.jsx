import AppRoutes from './../routes/AppRoutes'
import Navigation from './../components/Navigation/Navigation'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';


function App() {
    return (
        <div className="App">
            <Navigation />
            <AppRoutes />
        </div>
    );
}


export default App;
