import { BrowserRouter, Routes , Route } from "react-router-dom";

import Room from "./pages/Room";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Header from "./components/header";

import HomeIcon from '@mui/icons-material/Home';
import { IconButton } from "@mui/material";

function App() {
  return (
    <div className="App">
    <BrowserRouter>
      <Header>
      <IconButton color="primary" aria-label="upload picture" component="span">
        <HomeIcon />
      </IconButton>
      </Header>
        <Routes >
          <Route exact path='/room/:id' element={ <Room/> }/>
          <Route exact path='/' element={ <Home/> }/>
          <Route path='*'  element={ <NotFound/> }/>
        </Routes >
      </BrowserRouter>
    </div>
  );
}

export default App;
