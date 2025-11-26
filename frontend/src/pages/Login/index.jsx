import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext'; // Importa o Contexto

const styles = {
  wrapper: { minHeight: "100vh", backgroundColor: "#f6f7f8", padding: "1rem" },
  container: { maxWidth: "28rem", padding: "2rem", borderRadius: "1.5rem", backgroundColor: "#ffffff" },
  input: { backgroundColor: "#e5e7eb" },
  footerText: { fontSize: "0.75rem" }
};

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false); // Loading local do botão
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Pega a função login do contexto

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLocalLoading(true);

    try {
      // Usa a função do contexto (que chama o authService)
      await login(email, password);
      
      // Se não der erro, redireciona
      navigate('/user/gerenciar');
    } catch (err) {
      // Captura mensagem do backend ou erro genérico
      const msg = err.response?.data?.error || 'Erro ao fazer login. Verifique suas credenciais.';
      setError(msg);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <section className="d-flex align-items-center justify-content-center" style={styles.wrapper}>
      <div className="w-100 bg-white shadow-lg d-flex flex-column gap-4" style={styles.container}>
        
        <div className="text-center">
          <h2 className="h2 fw-bold">Login</h2>
          <p className="text-muted" style={{marginTop: "0.5rem"}}>Acesso destinado ao NAMI</p>
        </div>

        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError('')}></button>
          </div>
        )}

        <form className="d-flex flex-column gap-3" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="visually-hidden" htmlFor="email">Email</label>
            <input
              className="form-control border-0" 
              style={styles.input}
              id="email"
              placeholder="E-mail"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={localLoading}
            />
          </div>
          
          <div className="mb-3">
            <label className="visually-hidden" htmlFor="password">Senha</label>
            <input
              className="form-control border-0"
              style={styles.input}
              id="password"
              placeholder="Senha"
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={localLoading}
            />
          </div>

          <div>
            <button 
              className="btn btn-primary w-100 fw-bold" 
              type="submit"
              disabled={localLoading}
            >
              {localLoading ? 'Autenticando...' : 'Login'}
            </button>
          </div>
        </form>

        <p className="text-center text-muted mb-0" style={styles.footerText}>
          © 2025 Todos os direitos reservados ao NAMI.
        </p>
      </div>
    </section>
  );
}

export default Login;