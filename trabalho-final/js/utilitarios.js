const formatarData = (data) => {
  const [a1, a2, a3, a4, , m1, m2, , d1, d2] = data;
  return `${d1}${d2}/${m1}${m2}/${a1}${a2}${a3}${a4}`;
};

const guardarAoClicar = (links, chave, id) => {
  links.forEach((link) => {
    link.addEventListener('click', () => {
      localStorage.setItem(chave, id);
    });
  });
};

const guardarSelecaoDaTabela = (chave) => {
  const linhas = document.querySelectorAll('tbody tr');
  linhas.forEach((linha) => {
    const id = linha.children[1].textContent;
    guardarAoClicar(linha.querySelectorAll('a'), chave, id);
  });
};

const buscarSelecionado = (lista, chave) => {
  const id = localStorage.getItem(chave);
  return lista.find((item) => item.id === id) || lista[0];
};

const preencherTexto = (nome, valor) => {
  const campo = document.querySelector(`[name="${nome}"]`);
  campo.value = valor;
};

const preencherAreaDeTexto = (nome, valor) => {
  const campo = document.querySelector(`[name="${nome}"]`);
  campo.textContent = valor;
};

const preencherLista = (nome, valor) => {
  const lista = document.querySelector(`[name="${nome}"]`);
  lista.value = valor;
};

const mostrarNaFicha = (campo, valor) => {
  document.querySelector(`#ficha-${campo}`).textContent = valor || '-';
};

const sair = document.querySelector('.topo a[href="index.html"]');
sair.addEventListener('click', () => {
  localStorage.clear();
});
