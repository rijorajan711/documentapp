import { BrowserRouter,Routes,Route} from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import Home from "./Pages/Home";

function App() {
  return (
    <div className="App">


   <BrowserRouter>
   <Routes>
    <Route path="/" element={<LoginPage/>}/>
    <Route path="/home" element={<Home/>}/>
   </Routes>
   </BrowserRouter>

    </div>
  );
}

export default App;
