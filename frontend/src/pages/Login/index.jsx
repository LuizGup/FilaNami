import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const styles = {
  wrapper: {
    minHeight: "100vh",
    backgroundColor: "#f6f7f8", 
    padding: "1rem" 
  },
 
  container: {
    maxWidth: "28rem",
    padding: "2rem",
    borderRadius: "1.5rem", 
    backgroundColor: "#ffffff",
  },
  
  input: {
    backgroundColor: "#e5e7eb", 
  },

  forgotLink: {
    color: "#13a4ec", 
    textDecoration: "none",
    fontWeight: "500"
  },
 
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
      const response = await api.post('/users', {
        name: email.split('@')[0],
        email,
        password,
        userType: 'DEFAULT_USER',
      });

      const user = response.data;
      const USER_KEY = import.meta.env.VITE_USER_KEY || 'filaNami_user';
      localStorage.setItem(USER_KEY, JSON.stringify(user));
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