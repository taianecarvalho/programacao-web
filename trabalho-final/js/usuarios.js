const preencherFormularioDoUsuario = (usuario) => {
  preencherTexto('email', usuario.email);
  preencherTexto('nome', usuario.nome);
  preencherTexto('sobrenome', usuario.sobrenome);
  preencherTexto('telefone', usuario.telefone);
  preencherLista('funcao', usuario.funcao);
  preencherLista('status', usuario.status);
};

if (document.querySelector('input[name="selecionados"]')) {
  guardarSelecaoDaTabela('usuario');
}

const tituloDaTela = document.querySelector('h1');
if (tituloDaTela.textContent === 'Editar Usuário') {
  preencherFormularioDoUsuario(buscarSelecionado(usuarios, 'usuario'));
}
