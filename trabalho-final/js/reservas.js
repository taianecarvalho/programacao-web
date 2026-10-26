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

const mostrarReserva = (reserva) => {
  mostrarNaFicha('id', reserva.id);
  mostrarNaFicha('proprietario', reserva.proprietario);
  mostrarNaFicha('pet', reserva.pet);
  mostrarNaFicha('chegada', formatarData(reserva.chegada));
  mostrarNaFicha('partida', formatarData(reserva.partida));
  mostrarNaFicha('notas', reserva.notas);
  mostrarNaFicha('anotacoes', reserva.anotacoes);
  mostrarNaFicha('total', reserva.total);
  mostrarNaFicha('criado', formatarData(reserva.criado));
  mostrarNaFicha('atualizado', formatarData(reserva.atualizado));

  document.querySelector('#ficha-status').innerHTML =
    `<div class="etiqueta ${classesDeStatus[reserva.status]}">${reserva.status}</div>`;

  const recibo = document.querySelector('#ficha-recibo');
  if (reserva.recibo) {
    recibo.innerHTML = `<a href="${reserva.recibo}" target="_blank">${reserva.recibo}</a>`;
  } else {
    recibo.textContent = '-';
  }

  mostrarImagensDaReserva(reserva.imagens);
};

const preencherFormularioDaReserva = (reserva) => {
  preencherTexto('proprietario', reserva.proprietario);
  preencherTexto('pet', reserva.pet);
  preencherTexto('chegada', reserva.chegada);
  preencherTexto('partida', reserva.partida);
  preencherAreaDeTexto('notas', reserva.notas);
  document.querySelector('#total').textContent = reserva.total;
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

  mostrarNaTabela(encontradas, linhaDaReserva, 'reserva', 'Nenhuma reserva encontrada.');
};

if (document.querySelector('input[name="selecionadas"]')) {
  ligarPesquisa(pesquisarReservas);
}

if (document.querySelector('#ficha-pet')) {
  mostrarReserva(buscarSelecionado(reservas, 'reserva'));
}

if (document.querySelector('#total') && document.querySelector('[name="proprietario"]')) {
  preencherFormularioDaReserva(buscarSelecionado(reservas, 'reserva'));
}
