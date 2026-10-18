const iconeMostrarSenha = document.querySelector('.olho');
const rotuloSenha = document.querySelector('input[type="password"]').parentElement;
let senhaVisivel = false;

iconeMostrarSenha.addEventListener('click', () => {
  const senhaDigitada = rotuloSenha.querySelector('input').value;
  senhaVisivel = !senhaVisivel;
  let tipo = 'password';
  if (senhaVisivel) {
    tipo = 'text';
  }
  rotuloSenha.innerHTML = `Senha
            <input type="${tipo}" placeholder="Senha" required>`;
  rotuloSenha.querySelector('input').value = senhaDigitada;
});
