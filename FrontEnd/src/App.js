import { Fragment } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./Pages/auth/main";

function App() {
  return (
    <>
      <Fragment>
        <Router>
          <Routes>
            <Route path="/" exact element={<Main />}></Route>
          </Routes>
        </Router>
      </Fragment>
    </>
  );
}

export default App;
