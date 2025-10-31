
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Doctors from './pages/Doctors';
import Contact from './pages/Contact';
import Login from './pages/Login';
import MyProfile from './pages/MyProfile';
import MyAppointments from './pages/MyAppointments';
import Appointment from './pages/Appointment';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TrustedCareAI from './pages/TrustedCareAI';

const App = () => {
  const location = useLocation();

  // Hide footer & Navbar only on TrustedCareAI page
  const hideFooter = location.pathname === '/trustedcare-Ai';
  
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/login' element={<Login />} />
        <Route path='/my-profile' element={<MyProfile />} /> 
        <Route path='/my-appointments' element={<MyAppointments />} /> 
        <Route path='/appointment/:docId' element={<Appointment />} />
        <Route path='/trustedcare-Ai' element={<TrustedCareAI />} />
      </Routes>

       
      {!hideFooter && <Footer />}
    </div>
  );
};

export default App;

