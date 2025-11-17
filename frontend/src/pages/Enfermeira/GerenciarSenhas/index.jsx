import React from 'react';
import { Container, Row, Col, Card, Button, Navbar, Image, Badge } from 'react-bootstrap';
import { 
  Trophy, 
  PersonWorkspace, 
  CheckCircle, 
  ArrowClockwise 
} from 'react-bootstrap-icons';

// DADOS MOCADOS (Apenas para preencher a tela como na imagem)
// Na sua aplicação, você vai substituir isso pelos seus 'states' ou 'props'
const MOCK_WAITING = [
  { id: 'A-123', estWait: '15 mins' },
  { id: 'A-124', estWait: '20 mins' },
  { id: 'A-125', estWait: '22 mins' },
];

const MOCK_COUNTERS = [
  { 
    id: 1, 
    name: 'Guiche 1', 
    tickets: [
      { id: 'B-045', counter: 'Counter 1', servingTime: '3m 12s' },
      { id: 'C-210', counter: 'Counter 2', servingTime: '1m 45s' },
    ] 
  },
  { 
    id: 2, 
    name: 'Guiche 2', 
    tickets: [
      { id: 'B-045', counter: 'Counter 1', servingTime: '3m 12s' },
      { id: 'C-210', counter: 'Counter 2', servingTime: '1m 45s' },
    ] 
  },
  { 
    id: 3, 
    name: 'Guiche 3', 
    tickets: [
      { id: 'B-045', counter: 'Counter 1', servingTime: '3m 12s' },
      { id: 'C-210', counter: 'Counter 2', servingTime: '1m 45s' },
    ] 
  },
  { 
    id: 4, 
    name: 'Guiche 4', 
    tickets: [
      { id: 'B-045', counter: 'Counter 1', servingTime: '3m 12s' },
      { id: 'C-210', counter: 'Counter 2', servingTime: '1m 45s' },
    ] 
  },
];

const MOCK_DONE = [
  { id: 'D-101', counter: 'Counter 4', completedAt: '10:32 AM' },
  { id: 'A-122', counter: 'Counter 3', completedAt: '10:30 AM' },
];

function PasswordDashboard() {
  // NOTA: Em uma aplicação real, os dados acima viriam de 'props' 
  // ou de um 'useState' gerenciado pelo Socket.io/Axios.

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingBottom: '100px' }}>
      {/* 1. Header (Navbar) */}
      <Navbar bg="white" expand="lg" className="shadow-sm">
        <Container fluid className="px-4">
          <Navbar.Brand href="#home">
            <PersonWorkspace size={24} className="me-2" />
            Gerenciamento de Senhas
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Image 
              src="https://via.placeholder.com/40" // Substitua pela foto do usuário
              roundedCircle 
            />
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* 2. Conteúdo Principal (Dashboard) */}
      <Container fluid className="p-4">
        
        {/* Título e Atualização */}
        <Row className="mb-3 align-items-center">
          <Col>
            <h2 className="mb-0">Status Senha</h2>
          </Col>
          <Col xs="auto" className="text-muted">
            <ArrowClockwise size={14} className="me-1" />
            Last updated: Just now
          </Col>
        </Row>

        {/* Colunas do Kanban */}
        <Row>
          {/* Coluna 1: Esperando */}
          <Col lg={2} md={4} className="mb-3">
            <h5 className="mb-3 text-secondary">
              <Trophy size={20} className="me-2 text-warning" />
              Esperando
              <Badge pill bg="light" text="dark" className="ms-2">
                {MOCK_WAITING.length}
              </Badge>
            </h5>
            {MOCK_WAITING.map(ticket => (
              <Card key={ticket.id} className="mb-3 shadow-sm border-0">
                <Card.Body className="p-3">
                  <Card.Title className="h5 fw-bold mb-1">{ticket.id}</Card.Title>
                  <Card.Text className="small text-muted">
                    Est. wait: {ticket.estWait}
                  </Card.Text>
                </Card.Body>
              </Card>
            ))}
          </Col>

          {/* Colunas 2-5: Guiches */}
          {MOCK_COUNTERS.map(counter => (
            <Col key={counter.id} lg={2} md={4} className="mb-3">
              <h5 className="mb-3 text-secondary">
                <PersonWorkspace size={20} className="me-2 text-primary" />
                {counter.name}
              </h5>
              {counter.tickets.map(ticket => (
                <Card key={ticket.id + counter.id} className="mb-3 shadow-sm border-0">
                  <Card.Body className="p-3">
                    <Card.Title className="h5 fw-bold mb-1 text-primary">{ticket.id}</Card.Title>
                    <Card.Text className="small text-muted mb-1">
                      {ticket.counter}
                    </Card.Text>
                    <Card.Text className="small text-dark fw-bold">
                      Serving time: {ticket.servingTime}
                    </Card.Text>
                  </Card.Body>
                </Card>
              ))}
            </Col>
          ))}

          {/* Coluna 6: Feito */}
          <Col lg={2} md={4} className="mb-3">
            <h5 className="mb-3 text-secondary">
              <CheckCircle size={20} className="me-2 text-success" />
              Feito
              <Badge pill bg="light" text="dark" className="ms-2">
                {MOCK_DONE.length}
              </Badge>
            </h5>
            {MOCK_DONE.map(ticket => (
              <Card key={ticket.id} className="mb-3 shadow-sm border-0">
                <Card.Body className="p-3">
                  <Card.Title className="h5 fw-bold mb-1">{ticket.id}</Card.Title>
                  <Card.Text className="small text-muted">
                    Completed at: {ticket.completedAt}
                    <br />
                    {ticket.counter}
                  </Card.Text>
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>

        {/* 3. Botões de Ação */}
        {/* Usamos 'className' para aplicar classes utilitárias do Bootstrap 
          para posicionamento e espaçamento, como 'fixed-bottom'.
        */}
        <div className="fixed-bottom p-4">
          <Row>
            <Col className="d-flex justify-content-center gap-3">
              <Button variant="primary" size="lg" className="shadow px-5 py-2">
                Chamar senha
              </Button>
              <Button variant="primary" size="lg" className="shadow px-5 py-2">
                Exame realizado
              </Button>
            </Col>
          </Row>
        </div>

      </Container>
    </div>
  );
}

export default PasswordDashboard;