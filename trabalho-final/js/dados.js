const pets = [
  {
    id: '12349984501',
    nome: 'Anya',
    tipo: 'cachorro',
    raca: 'Golden Retriever',
    tamanho: 'grande',
    proprietario: 'José da Silva',
    foto: 'imagens/pet-anya.jpg',
    descricaoFoto: 'Anya, cadela da raça Golden Retriever, deitada na grama'
  },
  {
    id: '12349984502',
    nome: 'Maya',
    tipo: 'cachorro',
    raca: 'Cavalier King Charles',
    tamanho: 'pequeno',
    proprietario: 'José da Silva',
    foto: 'imagens/pet-maya.jpg',
    descricaoFoto: 'Maya, cadela da raça Cavalier King Charles'
  }
];

const reservas = [
  {
    id: '1234099871',
    pet: 'Anya',
    proprietario: 'José da Silva',
    chegada: '2026-05-02',
    partida: '2026-05-07',
    status: 'Reservada',
    total: 'R$ 40,00',
    notas: 'Anya come ração seca duas vezes ao dia e passeia de manhã.',
    anotacoes: '',
    recibo: '',
    criado: '2026-05-02',
    atualizado: '2026-05-02',
    imagens: []
  },
  {
    id: '1234099872',
    pet: 'Maya',
    proprietario: 'José da Silva',
    chegada: '2026-05-02',
    partida: '2026-05-07',
    status: 'Em progresso',
    total: 'R$ 40,00',
    notas: 'Maya toma o remédio de alergia depois do almoço.',
    anotacoes: 'Chegou tranquila e comeu toda a ração.',
    recibo: '',
    criado: '2026-05-02',
    atualizado: '2026-05-03',
    imagens: []
  },
  {
    id: '1234099873',
    pet: 'Anya',
    proprietario: 'José da Silva',
    chegada: '2026-05-02',
    partida: '2026-05-07',
    status: 'Finalizada',
    total: 'R$ 40,00',
    notas: 'Anya come ração seca duas vezes ao dia e passeia de manhã.',
    anotacoes: 'Adaptou-se bem ao canil e brincou com os outros cães no pátio.',
    recibo: 'recibo.pdf',
    criado: '2026-05-02',
    atualizado: '2026-05-07',
    imagens: [
      { foto: 'imagens/estadia-1.jpg', descricao: 'Anya brincando no pátio do hotel' },
      { foto: 'imagens/estadia-2.jpg', descricao: 'Anya descansando na caminha do canil' },
      { foto: 'imagens/estadia-3.jpg', descricao: 'Anya durante o banho de tosa' }
    ]
  }
];

const usuarios = [
  {
    id: '9087651',
    nome: 'Taiane',
    sobrenome: 'Carvalho',
    email: 'taiane@hotelpet.com',
    telefone: '+55 (73) 99876-8943',
    funcao: 'gerente',
    status: 'ativo'
  },
  {
    id: '9087652',
    nome: 'Marcos',
    sobrenome: 'Pereira',
    email: 'marcos@hotelpet.com',
    telefone: '+55 (73) 99812-4477',
    funcao: 'funcionario',
    status: 'ativo'
  },
  {
    id: '9087653',
    nome: 'José',
    sobrenome: 'da Silva',
    email: 'josedasilva@pet.com',
    telefone: '+55 (73) 99765-3321',
    funcao: 'cliente',
    status: 'ativo'
  },
  {
    id: '9087654',
    nome: 'Ana Beatriz',
    sobrenome: 'Rocha',
    email: 'anabeatriz@pet.com',
    telefone: '+55 (73) 99654-1180',
    funcao: 'cliente',
    status: 'inativo'
  }
];

const nomesDeTipo = { cachorro: 'Cachorro', gato: 'Gato' };

const classesDeStatus = {
  'Reservada': 'reservada',
  'Em progresso': 'progresso',
  'Finalizada': 'finalizada'
};
