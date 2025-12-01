// 1. Importar a imagem (arquivo está na mesma pasta que este index.jsx)
import imagem from './Gemini_Generated_Image_zeabwvzeabwvzeab.png';

// 2. Nome da função com letra Maiúscula (PascalCase)
function Gelado() {
    return (
        <img 
            src={imagem} // Usar a variável importada ou caminho relativo da pasta public
            alt="Descrição do que é a imagem" // 3. Boa prática: sempre preencher o alt
        />
    );
}

export default Gelado;