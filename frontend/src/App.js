import { Route, Switch } from 'react-router-dom'
import Login from './pages/login'
import Dashboard from './pages/dashboard'
import User from './pages/user'
import Meja from './pages/meja'
import Menu from './pages/menu'
import SelectTable from './pages/selectTable'
import SelectMenu from './pages/selectMenu'
import Cart from './pages/cart'
import FormTransaksi from './pages/formTransaksi'
import Transaksi from './pages/transaksi'
import CetakTransaksi from './pages/cetakTransaksi'
import DetailTransaksi from './pages/detailTransaksi'
import Laporan from './pages/laporan'
import PrintLaporan from './pages/printLaporan'
import Profile from './pages/profile'

function App() {
  return (
    <Switch>
      <Route exact path="/" component={Dashboard} />
      <Route path="/login" component={Login} />
      <Route path="/user" component={User} />
      <Route path="/meja" component={Meja} />
      <Route path="/menu" component={Menu} />
      <Route path="/selectTable" component={SelectTable} />
      <Route path="/selectMenu" component={SelectMenu} />
      <Route path="/cart" component={Cart} />
      <Route path="/formTransaksi" component={FormTransaksi} />
      <Route path="/transaksi" component={Transaksi} />
      <Route path="/detailTransaksi" component={DetailTransaksi} />
      <Route path="/cetakTransaksi" component={CetakTransaksi} />
      <Route path="/laporan" component={Laporan} />
      <Route path="/printLaporan" component={PrintLaporan} />
      <Route path="/profile" component={Profile} />
    </Switch>
  );
}

export default App;
