const preencherDadosPessoais = (usuario) => {
  preencherTexto('email', usuario.email);
  preencherTexto('nome', usuario.nome);
  preencherTexto('sobrenome', usuario.sobrenome);
  preencherTexto('telefone', usuario.telefone);
};

const preencherFormularioDoUsuario = (usuario) => {
  preencherDadosPessoais(usuario);
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
  <td><img src="${protegerTexto(foto)}" alt="" class="foto-usuario"></td>
  <td>${id}</td>
  <td>${protegerTexto(`${nome} ${sobrenome}`)}</td>
  <td>${protegerTexto(email)}</td>
  <td>${protegerTexto(telefone)}</td>
  <td>${nomesDeFuncao[funcao]}</td>
  <td><div class="etiqueta ${status}">${nomesDeSituacao[status]}</div></td>
  <td>${dataDeCriacao(criado)}</td>
  <td>
    <a href="editar-usuario.html">Editar</a>
    <a href="ver-usuario.html">Visualizar</a>
    <a href="usuarios.html">Remover</a>
  </td>
`;

const lerDadosPessoais = (usuario) => {
  usuario.email = valorDoCampo('email');
  usuario.nome = valorDoCampo('nome');
  usuario.sobrenome = valorDoCampo('sobrenome');
  usuario.telefone = valorDoCampo('telefone');
};

const lerFormularioDoUsuario = (usuario) => {
  lerDadosPessoais(usuario);
  usuario.funcao = valorDoCampo('funcao');
  usuario.status = valorDoCampo('status');
};

const trocarFotoDoUsuario = (usuario) => {
  if (arquivosEscolhidos.foto) {
    usuario.foto = arquivosEscolhidos.foto.conteudo;
  }
};

const cadastrarUsuario = () => {
  const usuario = { id: novoId(usuarios), foto: 'imagens/avatar.svg', criado: dataDeHoje() };
  lerFormularioDoUsuario(usuario);
  trocarFotoDoUsuario(usuario);
  usuarios.push(usuario);
  return salvarDados('usuarios', usuarios);
};

const nomeCompleto = ({ nome, sobrenome }) => `${nome} ${sobrenome}`;

const trocarProprietario = (nomeAntigo, nomeNovo) => {
  pets.forEach((pet) => {
    if (pet.proprietario === nomeAntigo) {
      pet.proprietario = nomeNovo;
    }
  });
  reservas.forEach((reserva) => {
    if (reserva.proprietario === nomeAntigo) {
      reserva.proprietario = nomeNovo;
    }
  });
  salvarDados('pets', pets);
  salvarDados('reservas', reservas);
};

const atualizarUsuario = () => {
  const usuario = buscarSelecionado(usuarios, 'usuario');
  const nomeAntigo = nomeCompleto(usuario);
  lerFormularioDoUsuario(usuario);
  trocarFotoDoUsuario(usuario);
  trocarProprietario(nomeAntigo, nomeCompleto(usuario));
  return salvarDados('usuarios', usuarios);
};

const buscarPerfil = () => usuarios.find((usuario) => usuario.funcao === 'gerente') || usuarios[0];

const atualizarPerfil = () => {
  const perfil = buscarPerfil();
  const nomeAntigo = nomeCompleto(perfil);
  lerDadosPessoais(perfil);
  trocarFotoDoUsuario(perfil);
  trocarProprietario(nomeAntigo, nomeCompleto(perfil));
  return salvarDados('usuarios', usuarios);
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
    criado: dataDeHoje()
  };
  usuarios.push(usuario);
  salvarDados('usuarios', usuarios);
};

const idsMarcados = () => {
  const marcados = [];
  document.querySelectorAll('input[name="selecionados"]').forEach((caixa) => {
    if (caixa.checked) {
      marcados.push(caixa.value);
    }
  });
  return marcados;
};

const estaMarcado = (usuario, marcados) => marcados.indexOf(usuario.id) !== -1;

const mudarStatusDosMarcados = (status) => {
  const marcados = idsMarcados();
  usuarios.forEach((usuario) => {
    if (estaMarcado(usuario, marcados)) {
      usuario.status = status;
    }
  });
  salvarDados('usuarios', usuarios);
};

const petsDoUsuario = (usuario) => pets.filter((pet) => pet.proprietario === nomeCompleto(usuario));

const avisarQueTemPets = (comPets) => {
  const nomes = comPets.map(nomeCompleto).join(', ');
  alert(`Não é possível remover quem tem pets cadastrados: ${nomes}.`);
};

const removerMarcados = () => {
  const marcados = idsMarcados();
  const comPets = usuarios.filter((usuario) => estaMarcado(usuario, marcados) && petsDoUsuario(usuario).length > 0);
  if (comPets.length > 0) {
    avisarQueTemPets(comPets);
  }
  const restantes = usuarios.filter((usuario) => !estaMarcado(usuario, marcados) || petsDoUsuario(usuario).length > 0);
  salvarDados('usuarios', restantes);
};

const ligarAcoesDosMarcados = () => {
  const [botaoAtivar, botaoInativar, botaoRemover] = document.querySelectorAll('input[name="acao"]');
  botaoAtivar.addEventListener('click', () => mudarStatusDosMarcados('ativo'));
  botaoInativar.addEventListener('click', () => mudarStatusDosMarcados('inativo'));
  botaoRemover.addEventListener('click', removerMarcados);
};

const deletarUsuario = (usuario) => {
  if (petsDoUsuario(usuario).length > 0) {
    avisarQueTemPets([usuario]);
    return;
  }
  const restantes = usuarios.filter((item) => item.id !== usuario.id);
  salvarDados('usuarios', restantes);
};

const ligarRemocao = () => {
  document.querySelectorAll('tbody a[href="usuarios.html"]').forEach((link) => {
    link.addEventListener('click', () => deletarUsuario(buscarSelecionado(usuarios, 'usuario')));
  });
};

const linhaDoPetDoUsuario = ({ nome, tipo, raca }) => `
  <td>${protegerTexto(nome)}</td>
  <td>${nomesDeTipo[tipo]}</td>
  <td>${protegerTexto(raca)}</td>
  <td><a href="ver-pet.html">Visualizar</a></td>
`;

const mostrarPetsDoUsuario = (usuario) => {
  mostrarNaTabela(petsDoUsuario(usuario), linhaDoPetDoUsuario, 'pet', 'Nenhum pet cadastrado para este usuário.');
};

const mostrarUsuario = (usuario) => {
  const { id, email, nome, sobrenome, telefone, funcao, status, foto = 'imagens/avatar.svg', criado = '' } = usuario;

  mostrarNaFicha('id', id);
  mostrarNaFicha('email', email);
  mostrarNaFicha('nome', nome);
  mostrarNaFicha('sobrenome', sobrenome);
  mostrarNaFicha('telefone', telefone);
  mostrarNaFicha('funcao', nomesDeFuncao[funcao]);
  mostrarNaFicha('criado', dataDeCriacao(criado));

  document.querySelector('#ficha-status').innerHTML =
    `<div class="etiqueta ${status}">${nomesDeSituacao[status]}</div>`;

  const figura = document.querySelector('#ficha-foto').parentElement;
  figura.innerHTML = `<img id="ficha-foto" src="${protegerTexto(foto)}" alt="${protegerTexto(`Foto de ${nome} ${sobrenome}`)}">`;

  mostrarPetsDoUsuario(usuario);
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

  let lista = ordenar(encontrados);
  if (visualizarPor === 'Função') {
    lista = agruparPorFuncao(lista);
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
  ligarAcoesDosMarcados();
  ligarOrdenacao(['id', 'nome', 'email', 'telefone', 'funcao', 'status', 'criado'], pesquisarUsuarios);
  ligarPesquisa(pesquisarUsuarios);
}

if (estaNaTela('Novo Usuário')) {
  aoSalvar(cadastrarUsuario);
}

if (estaNaTela('Editar Usuário')) {
  preencherFormularioDoUsuario(buscarSelecionado(usuarios, 'usuario'));
  aoSalvar(atualizarUsuario);
}

if (estaNaTela('Ver usuário')) {
  const usuario = buscarSelecionado(usuarios, 'usuario');
  mostrarUsuario(usuario);
  aoDeletar(() => deletarUsuario(usuario));
}

if (estaNaTela('Editar Perfil')) {
  preencherDadosPessoais(buscarPerfil());
  aoSalvar(atualizarPerfil);
}

if (document.querySelector('input[value="Criar conta"]')) {
  document.querySelector('form').addEventListener('submit', criarConta);
}
