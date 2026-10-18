const mostrarReservasDoPet = (pet) => {
  const corpo = document.querySelector('#reservas-do-pet');
  corpo.innerHTML = '';

  reservas
    .filter((reserva) => reserva.pet === pet.nome)
    .forEach((reserva) => {
      const linha = document.createElement('tr');
      linha.innerHTML = `
        <td>${formatarData(reserva.chegada)}</td>
        <td>${formatarData(reserva.partida)}</td>
        <td><div class="etiqueta ${classesDeStatus[reserva.status]}">${reserva.status}</div></td>
        <td><a href="ver-reserva.html">Visualizar</a></td>
      `;
      guardarAoClicar(linha.querySelectorAll('a'), 'reserva', reserva.id);
      corpo.appendChild(linha);
    });
};

const mostrarPet = (pet) => {
  const { id, nome, tipo, raca, proprietario, foto, descricaoFoto } = pet;

  mostrarNaFicha('proprietario', proprietario);
  mostrarNaFicha('id', id);
  mostrarNaFicha('nome', nome);
  mostrarNaFicha('tipo', nomesDeTipo[tipo]);
  mostrarNaFicha('raca', raca);

  const figura = document.querySelector('#ficha-foto').parentElement;
  figura.innerHTML = `<img id="ficha-foto" src="${foto}" alt="${descricaoFoto}">`;

  mostrarReservasDoPet(pet);
};

const preencherFormularioDoPet = (pet) => {
  preencherTexto('nome', pet.nome);
  preencherLista('tipo', pet.tipo);
  preencherTexto('raca', pet.raca);
  preencherLista('tamanho', pet.tamanho);

  const figura = document.querySelector('#foto-atual').parentElement;
  figura.innerHTML = `
    <img id="foto-atual" src="${pet.foto}" alt="${pet.descricaoFoto}">
    <figcaption>Imagem atual</figcaption>
  `;
};

if (document.querySelector('input[name="selecionados"]')) {
  guardarSelecaoDaTabela('pet');
}

if (document.querySelector('#ficha-nome')) {
  mostrarPet(buscarSelecionado(pets, 'pet'));
}

if (document.querySelector('#foto-atual')) {
  preencherFormularioDoPet(buscarSelecionado(pets, 'pet'));
}
