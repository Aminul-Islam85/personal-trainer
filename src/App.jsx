import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/header/MainLayout";
import Customers from "./routes/Customers";
import Trainings from "./routes/Trainings";
import Calendar from "./routes/Calendar";


const App = () => {
  return(
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Customers/>} />
          <Route path="/customers" element={<Customers/>} />
          <Route path="/trainings" element={<Trainings/>} />
          <Route path="/calendar" element={<Calendar/>} />
        </Routes>
      </MainLayout>
    </Router>
  )
}
export default App;