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
  preencherLista('proprietario', pet.proprietario);

  const figura = document.querySelector('#foto-atual').parentElement;
  figura.innerHTML = `
    <img id="foto-atual" src="${pet.foto}" alt="${pet.descricaoFoto}">
    <figcaption>Imagem atual</figcaption>
  `;
};

const linhaDoPet = ({ id, nome, tipo, raca, tamanho }) => `
  <td><input type="checkbox" name="selecionados" value="${id}" title="Selecionar pet"></td>
  <td>${id}</td>
  <td>${nome}</td>
  <td>${nomesDeTipo[tipo]}</td>
  <td>${raca}</td>
  <td>${nomesDeTamanho[tamanho]}</td>
  <td>
    <a href="editar-pet.html">Editar</a>
    <a href="ver-pet.html">Visualizar</a>
  </td>
`;

const pesquisarPets = () => {
  const id = valorPesquisado('id');
  const raca = valorPesquisado('raca');
  const nome = valorPesquisado('nome');
  const tamanho = valorPesquisado('tamanho');

  const encontrados = pets.filter((pet) =>
    contem(pet.id, id) &&
    contem(pet.raca, raca) &&
    contem(pet.nome, nome) &&
    (tamanho === '' || pet.tamanho === tamanho)
  );

  mostrarNaTabela(encontrados, linhaDoPet, 'pet', 'Nenhum pet encontrado.');
};

const listarClientesNoCampo = () => {
  const campo = document.querySelector('select[name="proprietario"]');
  usuarios
    .filter((usuario) => usuario.funcao === 'cliente')
    .forEach(({ nome, sobrenome }) => {
      const opcao = document.createElement('option');
      opcao.value = `${nome} ${sobrenome}`;
      opcao.textContent = `${nome} ${sobrenome}`;
      campo.appendChild(opcao);
    });
};

const lerFormularioDoPet = (pet) => {
  pet.nome = valorDoCampo('nome');
  pet.tipo = valorDoCampo('tipo');
  pet.raca = valorDoCampo('raca');
  pet.tamanho = valorDoCampo('tamanho');
  pet.proprietario = valorDoCampo('proprietario');
};

const cadastrarPet = () => {
  const pet = { id: novoId(pets), foto: 'imagens/avatar.svg' };
  lerFormularioDoPet(pet);
  pet.descricaoFoto = `${pet.nome}, sem foto cadastrada`;
  pets.push(pet);
  salvarDados('pets', pets);
};

const atualizarPet = () => {
  const pet = buscarSelecionado(pets, 'pet');
  const nomeAntigo = pet.nome;
  lerFormularioDoPet(pet);

  reservas.forEach((reserva) => {
    if (reserva.pet === nomeAntigo) {
      reserva.pet = pet.nome;
    }
  });

  salvarDados('pets', pets);
  salvarDados('reservas', reservas);
};

const deletarPet = (pet) => {
  const reservasDoPet = reservas.filter((reserva) => reserva.pet === pet.nome);
  if (reservasDoPet.length > 0) {
    alert(`O pet ${pet.nome} tem reservas e não pode ser deletado.`);
    return;
  }
  const restantes = pets.filter((item) => item.id !== pet.id);
  salvarDados('pets', restantes);
};

if (document.querySelector('input[name="selecionados"]')) {
  ligarPesquisa(pesquisarPets);
}

if (document.querySelector('#ficha-nome')) {
  const pet = buscarSelecionado(pets, 'pet');
  mostrarPet(pet);
  aoDeletar(() => deletarPet(pet));
}

if (estaNaTela('Novo Pet')) {
  listarClientesNoCampo();
  aoSalvar(cadastrarPet);
}

if (estaNaTela('Editar Pet')) {
  listarClientesNoCampo();
  preencherFormularioDoPet(buscarSelecionado(pets, 'pet'));
  aoSalvar(atualizarPet);
}
