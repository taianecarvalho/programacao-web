const salvarConfiguracoes = () => {
  configuracoes.diaria = parseFloat(valorDoCampo('diaria').replace(',', '.'));
  configuracoes.vagas = parseInt(valorDoCampo('vagas'));
  salvarDados('configuracoes', configuracoes);
};

preencherTexto('diaria', configuracoes.diaria.toFixed(2).replace('.', ','));
preencherTexto('vagas', configuracoes.vagas);
aoSalvar(salvarConfiguracoes);
