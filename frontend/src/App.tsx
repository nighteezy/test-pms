import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IssuesPage from "./pages/IssuesPage";
import BoardsPage from "./pages/BoardsPage";
import BoardPage from "./pages/BoardPage";
import Header from "./components/Header/Header";

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/boards" element={<BoardsPage />} />
        <Route path="/board/:id" element={<BoardPage />} />
        <Route path="/issues" element={<IssuesPage />} />
      </Routes>
    </Router>
  );
};

export default App;
