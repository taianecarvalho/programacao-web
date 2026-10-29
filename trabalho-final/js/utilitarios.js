const formatarData = (data) => {
  const [a1, a2, a3, a4, , m1, m2, , d1, d2] = data;
  return `${d1}${d2}/${m1}${m2}/${a1}${a2}${a3}${a4}`;
};

const dataDeHoje = () => {
  const hoje = new Date();
  const mes = `${hoje.getMonth() + 1}`.padStart(2, '0');
  const dia = `${hoje.getDate()}`.padStart(2, '0');
  return `${hoje.getFullYear()}-${mes}-${dia}`;
};

const protegerTexto = (texto) => `${texto}`
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const guardarAoClicar = (links, chave, id) => {
  links.forEach((link) => {
    link.addEventListener('click', () => {
      localStorage.setItem(chave, id);
    });
  });
};

const mostrarNaTabela = (lista, montarLinha, chave, mensagemVazia) => {
  const corpo = document.querySelector('tbody');
  const aviso = document.querySelector('#aviso');
  corpo.innerHTML = '';
  aviso.textContent = '';

  if (lista.length === 0) {
    aviso.textContent = mensagemVazia;
    return;
  }

  lista.forEach((item) => {
    const linha = document.createElement('tr');
    linha.innerHTML = montarLinha(item);
    guardarAoClicar(linha.querySelectorAll('a'), chave, item.id);
    corpo.appendChild(linha);
  });
};

let campoDaOrdem = '';
let ordemInvertida = false;

const valorParaOrdenar = (valor) => {
  if (typeof valor === 'string') {
    return valor.toLowerCase();
  }
  return valor;
};

const ordenar = (lista) => {
  if (campoDaOrdem === '') {
    return lista;
  }
  const ordenada = [...lista].sort((a, b) => {
    const valorA = valorParaOrdenar(a[campoDaOrdem]);
    const valorB = valorParaOrdenar(b[campoDaOrdem]);
    if (valorA < valorB) {
      return -1;
    }
    if (valorA > valorB) {
      return 1;
    }
    return 0;
  });
  if (ordemInvertida) {
    ordenada.reverse();
  }
  return ordenada;
};

const ligarOrdenacao = (campos, pesquisar) => {
  document.querySelectorAll('th a').forEach((link, posicao) => {
    link.addEventListener('click', () => {
      const campo = campos[posicao];
      ordemInvertida = campo === campoDaOrdem && !ordemInvertida;
      campoDaOrdem = campo;
      pesquisar();
    });
  });
};

const contem = (texto, busca) => texto.toLowerCase().indexOf(busca.toLowerCase()) !== -1;

const valorPesquisado = (nome) => document.querySelector(`form [name="${nome}"]`).value;

const ligarPesquisa = (pesquisar) => {
  const [botaoPesquisar, botaoLimpar] = document.querySelectorAll('form .acoes input');
  botaoPesquisar.addEventListener('click', pesquisar);
  botaoLimpar.addEventListener('click', () => {
    botaoPesquisar.form.querySelectorAll('[name]').forEach((campo) => {
      campo.value = '';
    });
    pesquisar();
  });
  pesquisar();
};

const buscarSelecionado = (lista, chave) => {
  const id = localStorage.getItem(chave);
  return lista.find((item) => item.id === id) || lista[0];
};

const preencherTexto = (nome, valor) => {
  const campo = document.querySelector(`[name="${nome}"]`);
  campo.value = valor;
};

const preencherAreaDeTexto = (nome, valor) => {
  const campo = document.querySelector(`[name="${nome}"]`);
  campo.textContent = valor;
};

const preencherLista = (nome, valor) => {
  const lista = document.querySelector(`[name="${nome}"]`);
  lista.value = valor;
};

const mostrarNaFicha = (campo, valor) => {
  document.querySelector(`#ficha-${campo}`).textContent = valor || '-';
};

const carregarDados = (chave, dadosIniciais) => {
  const salvos = localStorage.getItem(chave);
  if (salvos) {
    return JSON.parse(salvos);
  }
  return dadosIniciais;
};

const salvarDados = (chave, dados) => {
  try {
    localStorage.setItem(chave, JSON.stringify(dados));
    return true;
  } catch (erro) {
    alert('O navegador não tem mais espaço para guardar os dados. Use arquivos menores.');
    return false;
  }
};

const arquivosEscolhidos = {};

const reduzirImagem = (arquivo, guardar) => {
  const leitor = new FileReader();
  leitor.addEventListener('load', () => {
    const imagem = new Image();
    imagem.addEventListener('load', () => {
      const escala = Math.min(1, 400 / Math.max(imagem.width, imagem.height));
      const tela = document.createElement('canvas');
      tela.width = Math.round(imagem.width * escala);
      tela.height = Math.round(imagem.height * escala);
      tela.getContext('2d').drawImage(imagem, 0, 0, tela.width, tela.height);
      guardar(tela.toDataURL('image/jpeg', 0.8));
    });
    imagem.src = leitor.result;
  });
  leitor.readAsDataURL(arquivo);
};

const lerPdf = (arquivo, guardar) => {
  if (arquivo.size > 1024 * 1024) {
    alert('O recibo precisa ter até 1 MB.');
    return;
  }
  const leitor = new FileReader();
  leitor.addEventListener('load', () => guardar(leitor.result));
  leitor.readAsDataURL(arquivo);
};

const ligarArquivo = (campo) => {
  campo.addEventListener('change', () => {
    delete arquivosEscolhidos[campo.name];
    const [arquivo] = campo.files;
    if (!arquivo) {
      return;
    }
    const guardar = (conteudo) => {
      arquivosEscolhidos[campo.name] = { nome: arquivo.name, conteudo };
    };
    if (arquivo.type === 'application/pdf') {
      lerPdf(arquivo, guardar);
    } else {
      reduzirImagem(arquivo, guardar);
    }
  });
};

const enderecoDoArquivo = (arquivo) => {
  if (!arquivo.startsWith('data:')) {
    return arquivo;
  }
  const [cabecalho, conteudo] = arquivo.split(',');
  const tipo = cabecalho.slice(5, cabecalho.indexOf(';'));
  const bytes = Uint8Array.from(atob(conteudo), (letra) => letra.charCodeAt(0));
  return URL.createObjectURL(new Blob([bytes], { type: tipo }));
};

const novoId = (lista) => {
  if (lista.length === 0) {
    return '1';
  }
  return `${parseInt(lista[lista.length - 1].id) + 1}`;
};

const formatarValor = (valor) => `R$ ${valor.toFixed(2).replace('.', ',')}`;

const valorDoCampo = (nome) => document.querySelector(`[name="${nome}"]`).value;

const estaNaTela = (titulo) => document.querySelector('h1').textContent === titulo;

const aoSalvar = (salvar) => {
  document.querySelector('form.formulario').addEventListener('submit', (evento) => {
    if (salvar() === false) {
      evento.preventDefault();
    }
  });
};

const aoDeletar = (deletar) => {
  const botaoDeletar = document.querySelector('.acoes-topo a:last-child');
  botaoDeletar.addEventListener('click', deletar);
};

const pets = carregarDados('pets', petsIniciais);
const reservas = carregarDados('reservas', reservasIniciais);
const usuarios = carregarDados('usuarios', usuariosIniciais);
const configuracoes = carregarDados('configuracoes', configuracoesIniciais);

reservas.forEach((reserva) => {
  if (reserva.petId === undefined) {
    const pet = pets.find((item) => item.nome === reserva.pet) || { id: '' };
    reserva.petId = pet.id;
    delete reserva.pet;
  }
  if (reserva.diaria === undefined) {
    reserva.diaria = configuracoes.diaria;
  }
});

document.querySelectorAll('input[type="date"]').forEach((campo) => {
  campo.addEventListener('click', () => campo.showPicker());
});

const botaoLimpar = document.querySelector('form.formulario input[value="Limpar"]');
if (botaoLimpar) {
  botaoLimpar.addEventListener('click', () => {
    document.querySelectorAll('form.formulario [name]').forEach((campo) => {
      campo.value = '';
    });
    Object.keys(arquivosEscolhidos).forEach((nome) => {
      delete arquivosEscolhidos[nome];
    });
  });
}

document.querySelectorAll('input[type="file"]').forEach(ligarArquivo);

const sair = document.querySelector('.topo a[href="index.html"]');
if (sair) {
  sair.addEventListener('click', () => {
    localStorage.removeItem('pet');
    localStorage.removeItem('reserva');
    localStorage.removeItem('usuario');
  });
}
