import React from 'react';


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
  // Usando <> (Fragment) como no seu exemplo
  return (
    <>
      <section 
        // d-flex, align-items-center, justify-content-center (do Bootstrap)
        className="d-flex align-items-center justify-content-center" 
        style={styles.wrapper}
      >
        {/* O card de login: w-100, bg-white, shadow-lg, d-flex, etc. */}
        <div 
          className="w-100 bg-white shadow-lg d-flex flex-column gap-4" 
          style={styles.container}
        >
          
          {/* Cabeçalho */}
          <div className="text-center">
            {/* Ícone removido, conforme pedido */}
            <h2 className="h2 fw-bold"> Login</h2>
            <p className="text-muted" style={{marginTop: "0.5rem"}}>
            Acesso destinado ao NAMI
            </p>
          </div>

          {/* Formulário */}
          <form className="d-flex flex-column gap-3" onSubmit={(e) => e.preventDefault()}>
            
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
                type="text"
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
              />
            </div>

            {/* Link "Esqueci a senha" */}
            <div className="d-flex justify-content-end">
              <a style={styles.forgotLink} href="#">
                Esqueceu a senha?
              </a>
            </div>

            {/* Botão de Login */}
            <div>
              <button 
                // Classes do Bootstrap: btn, btn-primary, w-100, fw-bold
                className="btn btn-primary w-100 fw-bold" 
                type="submit"
              >
                Login
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