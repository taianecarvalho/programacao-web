const mostrarImagensDaReserva = (imagens) => {
  const campo = document.querySelector('#ficha-imagens');

  if (imagens.length === 0) {
    campo.textContent = '-';
    return;
  }

  const galeria = document.createElement('ul');
  galeria.className = 'galeria';

  imagens.forEach(({ foto, descricao }) => {
    const item = document.createElement('li');
    item.innerHTML = `<img src="${foto}" alt="${descricao}">`;
    galeria.appendChild(item);
  });

  campo.innerHTML = '';
  campo.appendChild(galeria);
};

const mostrarDataNaFicha = (campo, data) => {
  if (data) {
    mostrarNaFicha(campo, formatarData(data));
  } else {
    mostrarNaFicha(campo, '');
  }
};

const mostrarReserva = (reserva) => {
  mostrarNaFicha('id', reserva.id);
  mostrarNaFicha('proprietario', reserva.proprietario);
  mostrarNaFicha('pet', reserva.pet);
  mostrarNaFicha('chegada', formatarData(reserva.chegada));
  mostrarNaFicha('partida', formatarData(reserva.partida));
  mostrarNaFicha('notas', reserva.notas);
  mostrarNaFicha('anotacoes', reserva.anotacoes);
  mostrarNaFicha('total', reserva.total);
  mostrarDataNaFicha('criado', reserva.criado);
  mostrarDataNaFicha('atualizado', reserva.atualizado);

  document.querySelector('#ficha-status').innerHTML =
    `<div class="etiqueta ${classesDeStatus[reserva.status]}">${reserva.status}</div>`;

  mostrarRecibo(reserva.recibo);
  mostrarImagensDaReserva(reserva.imagens);
};

const mostrarRecibo = (arquivo) => {
  const recibo = document.querySelector('#ficha-recibo');
  if (arquivo) {
    recibo.innerHTML = `<a href="${arquivo}" target="_blank">${arquivo}</a>`;
  } else {
    recibo.textContent = '-';
  }
};

const mostrarEstadoDaReserva = () => {
  const status = valorDoCampo('status');
  const progresso = document.querySelector('#estado-progresso');
  const finalizada = document.querySelector('#estado-finalizada');

  progresso.classList.add('oculto');
  finalizada.classList.add('oculto');

  if (status === 'Em progresso') {
    progresso.classList.remove('oculto');
  }
  if (status === 'Finalizada') {
    finalizada.classList.remove('oculto');
  }
};

const ligarEstado = () => {
  document.querySelector('select[name="status"]').addEventListener('change', mostrarEstadoDaReserva);
  botaoLimpar.addEventListener('click', mostrarEstadoDaReserva);
  mostrarEstadoDaReserva();
};

const listarPetsNoCampo = () => {
  const campo = document.querySelector('select[name="pet"]');
  pets.forEach(({ nome }) => {
    const opcao = document.createElement('option');
    opcao.value = nome;
    opcao.textContent = nome;
    campo.appendChild(opcao);
  });
};

const contarDiarias = (chegada, partida) => {
  if (chegada === '' || partida === '' || partida <= chegada) {
    return 0;
  }
  return (new Date(partida) - new Date(chegada)) / 86400000;
};

const calcularValor = () => contarDiarias(valorDoCampo('chegada'), valorDoCampo('partida')) * configuracoes.diaria;

const mostrarTotal = () => {
  document.querySelector('#total').textContent = formatarValor(calcularValor());
};

const ligarTotal = () => {
  document.querySelectorAll('input[type="date"]').forEach((campo) => {
    campo.addEventListener('change', mostrarTotal);
  });
  botaoLimpar.addEventListener('click', mostrarTotal);
  mostrarTotal();
};

const preencherFormularioDaReserva = (reserva) => {
  preencherTexto('proprietario', reserva.proprietario);
  preencherLista('pet', reserva.pet);
  preencherTexto('chegada', reserva.chegada);
  preencherTexto('partida', reserva.partida);
  preencherAreaDeTexto('notas', reserva.notas);
  preencherLista('status', reserva.status);
  preencherAreaDeTexto('anotacoes', reserva.anotacoes);
  mostrarImagensDaReserva(reserva.imagens);
  mostrarRecibo(reserva.recibo);
};

const lerFormularioDaReserva = (reserva) => {
  reserva.pet = valorDoCampo('pet');
  reserva.chegada = valorDoCampo('chegada');
  reserva.partida = valorDoCampo('partida');
  reserva.notas = valorDoCampo('notas');
  reserva.valor = calcularValor();
  reserva.total = formatarValor(reserva.valor);
};

const periodoValido = () => {
  if (contarDiarias(valorDoCampo('chegada'), valorDoCampo('partida')) === 0) {
    alert('A data de partida precisa ser depois da data de chegada. A reserva não foi salva.');
    return false;
  }
  return true;
};

const cadastrarReserva = () => {
  if (!periodoValido()) {
    return;
  }
  const reserva = {
    id: novoId(reservas),
    status: 'Reservada',
    anotacoes: '',
    recibo: '',
    criado: '',
    atualizado: '',
    imagens: []
  };
  lerFormularioDaReserva(reserva);
  const pet = pets.find((item) => item.nome === reserva.pet);
  reserva.proprietario = pet.proprietario;
  reservas.push(reserva);
  salvarDados('reservas', reservas);
};

const atualizarReserva = () => {
  if (!periodoValido()) {
    return;
  }
  const reserva = buscarSelecionado(reservas, 'reserva');
  lerFormularioDaReserva(reserva);
  reserva.proprietario = valorDoCampo('proprietario');
  reserva.status = valorDoCampo('status');
  reserva.anotacoes = valorDoCampo('anotacoes');
  salvarDados('reservas', reservas);
};

const deletarReserva = (reserva) => {
  const restantes = reservas.filter((item) => item.id !== reserva.id);
  salvarDados('reservas', restantes);
};

const linhaDaReserva = ({ id, pet, chegada, partida, status, total }) => `
  <td><input type="checkbox" name="selecionadas" value="${id}" title="Selecionar reserva"></td>
  <td>${id}</td>
  <td>${pet}</td>
  <td>${formatarData(chegada)}</td>
  <td>${formatarData(partida)}</td>
  <td><div class="etiqueta ${classesDeStatus[status]}">${status}</div></td>
  <td class="valor">${total}</td>
  <td>
    <a href="editar-reserva.html">Editar</a>
    <a href="ver-reserva.html">Visualizar</a>
  </td>
`;


const pesquisarReservas = () => {
  const id = valorPesquisado('id');
  const chegada = valorPesquisado('chegada');
  const partida = valorPesquisado('partida');
  const proprietario = valorPesquisado('proprietario');
  const totalMinimo = valorPesquisado('total_min');
  const totalMaximo = valorPesquisado('total_max');
  const status = valorPesquisado('status');
  const pet = valorPesquisado('pet');

  const encontradas = reservas.filter((reserva) =>
    contem(reserva.id, id) &&
    (chegada === '' || reserva.chegada >= chegada) &&
    (partida === '' || reserva.partida <= partida) &&
    contem(reserva.proprietario, proprietario) &&
    (totalMinimo === '' || reserva.valor >= parseFloat(totalMinimo)) &&
    (totalMaximo === '' || reserva.valor <= parseFloat(totalMaximo)) &&
    (status === '' || classesDeStatus[reserva.status] === status) &&
    contem(reserva.pet, pet)
  );

  mostrarNaTabela(ordenar(encontradas), linhaDaReserva, 'reserva', 'Nenhuma reserva encontrada.');
};

if (document.querySelector('input[name="selecionadas"]')) {
  ligarOrdenacao(['id', 'pet', 'chegada', 'partida', 'status', 'valor'], pesquisarReservas);
  ligarPesquisa(pesquisarReservas);
}

if (document.querySelector('#ficha-pet')) {
  const reserva = buscarSelecionado(reservas, 'reserva');
  mostrarReserva(reserva);
  aoDeletar(() => deletarReserva(reserva));
}

if (estaNaTela('Fazer reserva')) {
  listarPetsNoCampo();
  ligarTotal();
  aoSalvar(cadastrarReserva);
}

if (estaNaTela('Editar reserva')) {
  listarPetsNoCampo();
  preencherFormularioDaReserva(buscarSelecionado(reservas, 'reserva'));
  ligarEstado();
  ligarTotal();
  aoSalvar(atualizarReserva);
}
