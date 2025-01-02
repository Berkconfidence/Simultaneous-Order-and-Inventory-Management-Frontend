import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/login/Login';
import Signup from './components/login/Signup';
import Profile from './components/profile/Profile';
import Wallet from './components/wallet/Wallet';
import Products from './components/product/Products';
import AdminProfile from './components/admin/AdminProfile';
import AdminProducts from './components/admin/AdminProducts';
import AdminWallet from './components/admin/AdminWallet';
import AdminOrders from './components/admin/AdminOrders';
import AdminLogs from './components/admin/AdminLogs';

function App() {
  return (
    <div className="App">
        <BrowserRouter>
            <Routes>
              <Route exact path='/login' Component={Login}></Route>
              <Route exact path='/signup' Component={Signup}></Route>

              <Route exact path='/profile/:userId' Component={Profile}></Route>
              <Route exact path='/adminprofile/:adminId' Component={AdminProfile}></Route>

              <Route exact path='/products/:userId' Component={Products}></Route>
              <Route exact path='/adminproducts/:adminId' Component={AdminProducts}></Route>
              
              <Route exact path='/wallet/:userId' Component={Wallet}></Route>
              <Route exact path='/adminwallet/:adminId' Component={AdminWallet}></Route>
              <Route exact path='/adminorders/:adminId' Component={AdminOrders}></Route>
              <Route exact path='/adminlogs/:adminId' Component={AdminLogs}></Route>
            
            </Routes>
          </BrowserRouter>
    </div>
  );
}

export default App;
