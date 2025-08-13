import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';
import CategoriesView from './view/CategoriesView';
import TransactionsView from './view/TransactionsView';
import SummaryPage from './view/SummaryPage';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">Finances App</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/transactions">Transações</Nav.Link>
              <Nav.Link as={Link} to="/summary">Resumo</Nav.Link>
              <Nav.Link as={Link} to="/categories">Categorias</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container fluid className="mt-4">
        <Routes>
          <Route path="/" element={<TransactionsView />} />
          <Route path="/transactions" element={<TransactionsView />} />
          <Route path="/summary" element={<SummaryPage />} />
          <Route path="/categories" element={<CategoriesView />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;