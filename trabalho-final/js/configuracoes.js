const salvarConfiguracoes = () => {
  const diaria = parseFloat(valorDoCampo('diaria').replace(',', '.'));
  const vagas = parseInt(valorDoCampo('vagas'));

  if (isNaN(diaria) || isNaN(vagas) || diaria <= 0 || vagas <= 0) {
    alert('Informe um valor de diária e um número de vagas maiores que zero.');
    return false;
  }

  configuracoes.diaria = diaria;
  configuracoes.vagas = vagas;
  salvarDados('configuracoes', configuracoes);
};

preencherTexto('diaria', configuracoes.diaria.toFixed(2).replace('.', ','));
preencherTexto('vagas', configuracoes.vagas);
aoSalvar(salvarConfiguracoes);
