import { Route, Switch } from 'react-router-dom'
import Login from './pages/login'
import Dashboard from './pages/dashboard'
import User from './pages/user'
import Meja from './pages/meja'
import Menu from './pages/menu'
import AddCart from './pages/addCart'
import CartList from './pages/cartList'
import Transaksi from './pages/transaksi'
import Laporan from './pages/laporan'
import Profile from './pages/profile'

function App() {
  return (
    <Switch>
      <Route exact path="/" component={Dashboard} />
      <Route path="/login" component={Login} />
      <Route path="/user" component={User} />
      <Route path="/meja" component={Meja} />
      <Route path="/menu" component={Menu} />
      <Route path="/add-cart" component={AddCart} />
      <Route path="/cart-list" component={CartList} />
      <Route path="/transaksi" component={Transaksi} />
      <Route path="/laporan" component={Laporan} />
      <Route path="/profile" component={Profile} />
    </Switch>
  );
}

export default App;
