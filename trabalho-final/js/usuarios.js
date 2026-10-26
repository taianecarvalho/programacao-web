const preencherFormularioDoUsuario = (usuario) => {
  preencherTexto('email', usuario.email);
  preencherTexto('nome', usuario.nome);
  preencherTexto('sobrenome', usuario.sobrenome);
  preencherTexto('telefone', usuario.telefone);
  preencherLista('funcao', usuario.funcao);
  preencherLista('status', usuario.status);
};

const linhaDoUsuario = ({ id, nome, sobrenome, email, telefone, funcao, status }) => `
  <td><input type="checkbox" name="selecionados" value="${id}" title="Selecionar usuário"></td>
  <td>${id}</td>
  <td>${nome} ${sobrenome}</td>
  <td>${email}</td>
  <td>${telefone}</td>
  <td>${nomesDeFuncao[funcao]}</td>
  <td><div class="etiqueta ${status}">${nomesDeSituacao[status]}</div></td>
  <td>
    <a href="editar-usuario.html">Editar</a>
  </td>
`;

const pesquisarUsuarios = () => {
  const id = valorPesquisado('id');
  const nome = valorPesquisado('nome');
  const email = valorPesquisado('email');
  const funcao = valorPesquisado('funcao');
  const status = valorPesquisado('status');

  const encontrados = usuarios.filter((usuario) =>
    contem(usuario.id, id) &&
    contem(`${usuario.nome} ${usuario.sobrenome}`, nome) &&
    contem(usuario.email, email) &&
    (funcao === '' || usuario.funcao === funcao) &&
    (status === '' || usuario.status === status)
  );

  mostrarNaTabela(encontrados, linhaDoUsuario, 'usuario', 'Nenhum usuário encontrado.');
};

if (document.querySelector('input[name="selecionados"]')) {
  ligarPesquisa(pesquisarUsuarios);
}

const tituloDaTela = document.querySelector('h1');
if (tituloDaTela.textContent === 'Editar Usuário') {
  preencherFormularioDoUsuario(buscarSelecionado(usuarios, 'usuario'));
}
