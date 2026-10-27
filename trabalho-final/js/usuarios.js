const preencherFormularioDoUsuario = (usuario) => {
  preencherTexto('email', usuario.email);
  preencherTexto('nome', usuario.nome);
  preencherTexto('sobrenome', usuario.sobrenome);
  preencherTexto('telefone', usuario.telefone);
  preencherLista('funcao', usuario.funcao);
  preencherLista('status', usuario.status);
};

let visualizarPor = 'Usuários';

const dataDeCriacao = (criado) => {
  if (criado) {
    return formatarData(criado);
  }
  return '-';
};

const linhaDoUsuario = ({ id, nome, sobrenome, email, telefone, funcao, status, foto = 'imagens/avatar.svg', criado = '' }) => `
  <td><input type="checkbox" name="selecionados" value="${id}" title="Selecionar usuário"></td>
  <td><img src="${foto}" alt="" class="foto-usuario"></td>
  <td>${id}</td>
  <td>${nome} ${sobrenome}</td>
  <td>${email}</td>
  <td>${telefone}</td>
  <td>${nomesDeFuncao[funcao]}</td>
  <td><div class="etiqueta ${status}">${nomesDeSituacao[status]}</div></td>
  <td>${dataDeCriacao(criado)}</td>
  <td>
    <a href="editar-usuario.html">Editar</a>
    <a href="usuarios.html">Remover</a>
  </td>
`;

const lerFormularioDoUsuario = (usuario) => {
  usuario.email = valorDoCampo('email');
  usuario.nome = valorDoCampo('nome');
  usuario.sobrenome = valorDoCampo('sobrenome');
  usuario.telefone = valorDoCampo('telefone');
  usuario.funcao = valorDoCampo('funcao');
  usuario.status = valorDoCampo('status');
};

const cadastrarUsuario = () => {
  const usuario = { id: novoId(usuarios), foto: 'imagens/avatar.svg', criado: '' };
  lerFormularioDoUsuario(usuario);
  usuarios.push(usuario);
  salvarDados('usuarios', usuarios);
};

const atualizarUsuario = () => {
  lerFormularioDoUsuario(buscarSelecionado(usuarios, 'usuario'));
  salvarDados('usuarios', usuarios);
};

const criarConta = () => {
  const login = valorDoCampo('login');
  const usuario = {
    id: novoId(usuarios),
    nome: login,
    sobrenome: '',
    email: login,
    telefone: '',
    funcao: 'cliente',
    status: 'ativo',
    foto: 'imagens/avatar.svg',
    criado: ''
  };
  usuarios.push(usuario);
  salvarDados('usuarios', usuarios);
};

const ligarRemocao = () => {
  document.querySelectorAll('tbody a[href="usuarios.html"]').forEach((link) => {
    link.addEventListener('click', () => {
      const usuario = buscarSelecionado(usuarios, 'usuario');
      const restantes = usuarios.filter((item) => item.id !== usuario.id);
      salvarDados('usuarios', restantes);
    });
  });
};

const agruparPorFuncao = (lista) => [
  ...lista.filter((usuario) => usuario.funcao === 'gerente'),
  ...lista.filter((usuario) => usuario.funcao === 'funcionario'),
  ...lista.filter((usuario) => usuario.funcao === 'cliente')
];

const pesquisarUsuarios = () => {
  const id = valorPesquisado('id');
  const nome = valorPesquisado('nome');
  const email = valorPesquisado('email');
  const funcao = valorPesquisado('funcao');
  const status = valorPesquisado('status');
  const criadoInicio = valorPesquisado('criado_inicio');
  const criadoFim = valorPesquisado('criado_fim');

  const encontrados = usuarios.filter((usuario) =>
    contem(usuario.id, id) &&
    contem(`${usuario.nome} ${usuario.sobrenome}`, nome) &&
    contem(usuario.email, email) &&
    (funcao === '' || usuario.funcao === funcao) &&
    (status === '' || usuario.status === status) &&
    (criadoInicio === '' || usuario.criado >= criadoInicio) &&
    (criadoFim === '' || usuario.criado <= criadoFim)
  );

  let lista = encontrados;
  if (visualizarPor === 'Função') {
    lista = agruparPorFuncao(encontrados);
  }

  mostrarNaTabela(lista, linhaDoUsuario, 'usuario', 'Nenhum usuário encontrado.');
  ligarRemocao();
};

const ligarVisualizacao = () => {
  const botoes = document.querySelectorAll('.visualizar input');
  botoes.forEach((botao) => {
    botao.addEventListener('click', () => {
      botoes.forEach((item) => item.classList.remove('principal'));
      botao.classList.add('principal');
      visualizarPor = botao.value;
      pesquisarUsuarios();
    });
  });
};

if (document.querySelector('input[name="selecionados"]')) {
  ligarVisualizacao();
  ligarPesquisa(pesquisarUsuarios);
}

if (estaNaTela('Novo Usuário')) {
  aoSalvar(cadastrarUsuario);
}

if (estaNaTela('Editar Usuário')) {
  preencherFormularioDoUsuario(buscarSelecionado(usuarios, 'usuario'));
  aoSalvar(atualizarUsuario);
}

if (document.querySelector('input[value="Criar conta"]')) {
  document.querySelector('form').addEventListener('submit', criarConta);
}
