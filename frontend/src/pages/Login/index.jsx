import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import './Login.css';

// Vamos hardcodar as cores, já que não estamos usando o .css
const styles = {
  // O wrapper que centraliza tudo
  wrapper: {
    minHeight: "100vh",
    backgroundColor: "#f6f7f8", // Cor de fundo clara
    padding: "1rem" // Para dar espaço em telas pequenas
  },
  // O card de login
  container: {
    maxWidth: "28rem",
    padding: "2rem",
    borderRadius: "1.5rem", // O 'rounded-xl'
    backgroundColor: "#ffffff",
  },
  // O input customizado
  input: {
    backgroundColor: "#e5e7eb", // Cor de fundo do input
  },
  // O link "esqueci a senha"
  forgotLink: {
    color: "#13a4ec", // Cor primária
    textDecoration: "none",
    fontWeight: "500"
  },
  // Texto do rodapé
  footerText: {
    fontSize: "0.75rem",
  }
};

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // Redireciona para dashboard após login bem-sucedido
      navigate('/user/gerenciar');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao fazer login. Tente novamente.');
      console.error('Erro de login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section 
        className="d-flex align-items-center justify-content-center" 
        style={styles.wrapper}
      >
        <div 
          className="w-100 bg-white shadow-lg d-flex flex-column gap-4" 
          style={styles.container}
        >
          
          <div className="text-center">
            <h2 className="h2 fw-bold"> Login</h2>
            <p className="text-muted" style={{marginTop: "0.5rem"}}>
            Acesso destinado ao NAMI
            </p>
          </div>

          {/* Mensagem de erro */}
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setError('')}
              ></button>
            </div>
          )}

          {/* Formulário */}
          <form className="d-flex flex-column gap-3" onSubmit={handleSubmit}>
            
            {/* Grupo do 1º Input (usando mb-3 do Bootstrap) */}
            <div className="mb-3">
              <label className="visually-hidden" htmlFor="employee-id">Email</label>
              <input
                // Classe 'form-control' do Bootstrap + 'border-0' para tirar a borda
                className="form-control border-0" 
                style={styles.input} // Nosso estilo inline para a cor de fundo
                id="employee-id"
                placeholder="E-mail"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            
            {/* Grupo do 2º Input */}
            <div className="mb-3">
              <label className="visually-hidden" htmlFor="password">Password</label>
              <input
                className="form-control border-0"
                style={styles.input}
                id="password"
                placeholder="Senha"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Botão de Login */}
            <div>
              <button 
                // Classes do Bootstrap: btn, btn-primary, w-100, fw-bold
                className="btn btn-primary w-100 fw-bold" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Autenticando...' : 'Login'}
              </button>
            </div>
          </form>

          {/* Rodapé */}
          <p className="text-center text-muted mb-0" style={styles.footerText}>
            © 2025 Todos os direitos reservados ao NAMI.
          </p>
        </div>
      </section>
    </>
  );
}

export default Login;