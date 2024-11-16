import{ BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

/* components*/
import Navbar from './components/layoult/Navbar';
import Footer from './components/layoult/Footer';
import Container from './components/layoult/Container'
import Message from "./components/layoult/Message"

/*pages*/
import Login from './components/pages/Auth/Login';
import Home from './components/pages/Home';
import Register from './components/pages/Auth/Register';
import Profile from './components/pages/User/Profile';
import MyPets from './components/pages/Pet/MyPets';
import AddPet from './components/pages/Pet/AddPet';

/* context */
import { UserProvider } from './context/UserContext';
import EditPet from './components/pages/Pet/EditPet';
import PetDetails from './components/pages/Pet/PetDetails';
import MyAdoptions from './components/pages/Pet/MyAdoptions';


function App() {
  return (
    <Router>
      <UserProvider>
      <Navbar/>
      <Message/>
        <Container>
        <Routes>
        <Route path='/login' element={<Login />} />
        
        <Route path='/register' element={<Register />} />

        <Route path='/user/profile' element={<Profile />} />

        <Route path='/pet/mypets' element={<MyPets />} />

        <Route path='/pet/add' element={<AddPet />} />

        <Route path='/pet/edit/:id' element={<EditPet />} />

        <Route path='/pet/myadoptions' element={<MyAdoptions />} />

        <Route path='/pet/:id' element={<PetDetails />} />

        <Route path='/' element={<Home />} />
      </Routes>
        </Container>
      <Footer/>
      </UserProvider>
    </Router>
    
  );
}

export default App;
