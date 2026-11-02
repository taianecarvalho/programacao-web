const mostrarReservasDoPet = (pet) => {
  const corpo = document.querySelector('#reservas-do-pet');
  const reservasDoPet = reservas.filter((reserva) => reserva.petId === pet.id);
  corpo.innerHTML = '';

  if (reservasDoPet.length === 0) {
    document.querySelector('#aviso').textContent = 'Nenhuma reserva para este pet.';
  }

  reservasDoPet
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
  const { id, nome, tipo, raca, tamanho, foto, descricaoFoto } = pet;

  mostrarNaFicha('proprietario', nomeDoDono(pet));
  mostrarNaFicha('id', id);
  mostrarNaFicha('nome', nome);
  mostrarNaFicha('tipo', nomesDeTipo[tipo]);
  mostrarNaFicha('raca', raca);
  mostrarNaFicha('tamanho', nomesDeTamanho[tamanho]);

  const figura = document.querySelector('#ficha-foto').parentElement;
  figura.innerHTML = `<img id="ficha-foto" src="${protegerTexto(foto)}" alt="${protegerTexto(descricaoFoto)}">`;

  mostrarReservasDoPet(pet);
};

const preencherFormularioDoPet = (pet) => {
  preencherTexto('nome', pet.nome);
  preencherLista('tipo', pet.tipo);
  preencherTexto('raca', pet.raca);
  preencherLista('tamanho', pet.tamanho);
  preencherLista('proprietario', pet.proprietarioId);

  const figura = document.querySelector('#foto-atual').parentElement;
  figura.innerHTML = `
    <img id="foto-atual" src="${protegerTexto(pet.foto)}" alt="${protegerTexto(pet.descricaoFoto)}">
    <figcaption>Imagem atual</figcaption>
  `;
};

const linhaDoPet = ({ id, nome, tipo, raca, tamanho }) => `
  <td><input type="checkbox" name="selecionados" value="${id}" title="Selecionar pet"></td>
  <td>${id}</td>
  <td>${protegerTexto(nome)}</td>
  <td>${nomesDeTipo[tipo]}</td>
  <td>${protegerTexto(raca)}</td>
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

  mostrarNaTabela(ordenar(encontrados), linhaDoPet, 'pet', 'Nenhum pet encontrado.');
};

const listarClientesNoCampo = (idDoDonoAtual) => {
  const campo = document.querySelector('select[name="proprietario"]');
  usuarios
    .filter((usuario) => (usuario.funcao === 'cliente' && usuario.status === 'ativo') || usuario.id === idDoDonoAtual)
    .forEach((usuario) => {
      const opcao = document.createElement('option');
      opcao.value = usuario.id;
      opcao.textContent = nomeCompleto(usuario);
      campo.appendChild(opcao);
    });
};

const lerFormularioDoPet = (pet) => {
  pet.nome = valorDoCampo('nome');
  pet.tipo = valorDoCampo('tipo');
  pet.raca = valorDoCampo('raca');
  pet.tamanho = valorDoCampo('tamanho');
  pet.proprietarioId = valorDoCampo('proprietario');
};

const trocarFotoDoPet = (pet) => {
  if (arquivosEscolhidos.imagem) {
    pet.foto = arquivosEscolhidos.imagem.conteudo;
    pet.descricaoFoto = `Foto de ${pet.nome}`;
  }
};

const cadastrarPet = () => {
  const pet = { id: novoId(pets), foto: 'imagens/avatar.svg' };
  lerFormularioDoPet(pet);
  pet.descricaoFoto = `${pet.nome}, sem foto cadastrada`;
  trocarFotoDoPet(pet);
  pets.push(pet);
  return salvarDados('pets', pets);
};

const atualizarPet = () => {
  const pet = buscarSelecionado(pets, 'pet');
  lerFormularioDoPet(pet);
  trocarFotoDoPet(pet);
  return salvarDados('pets', pets);
};

const deletarPet = (pet) => {
  const reservasDoPet = reservas.filter((reserva) => reserva.petId === pet.id);
  if (reservasDoPet.length > 0) {
    alert(`O pet ${pet.nome} tem reservas e não pode ser deletado.`);
    return false;
  }
  if (!confirm(`Deseja deletar o pet ${pet.nome}?`)) {
    return false;
  }
  const restantes = pets.filter((item) => item.id !== pet.id);
  salvarDados('pets', restantes);
};

if (estaNaTela('Pets')) {
  ligarOrdenacao(['id', 'nome', 'tipo', 'raca', 'tamanho'], pesquisarPets);
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
  const pet = buscarSelecionado(pets, 'pet');
  listarClientesNoCampo(pet.proprietarioId);
  preencherFormularioDoPet(pet);
  aoSalvar(atualizarPet);
}
