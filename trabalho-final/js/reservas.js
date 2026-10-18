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

if (document.querySelector('input[name="selecionadas"]')) {
  guardarSelecaoDaTabela('reserva');
}

if (document.querySelector('#ficha-pet')) {
  mostrarReserva(buscarSelecionado(reservas, 'reserva'));
}

if (document.querySelector('#total') && document.querySelector('[name="proprietario"]')) {
  preencherFormularioDaReserva(buscarSelecionado(reservas, 'reserva'));
}
