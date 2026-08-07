// ===== LÓGICA DO TRUCO MINEIRO ONLINE =====

let contadorJogadores = 0;
let jogadorAtual = null;
let listaJogadoresNaFila = [];

// DADOS DO JOGO CONTRA A MÁQUINA
let baralho = [];
let cartasJogador = [];
let cartasJoao = [];
let cartaSelecionada = null;
let pontosJogador = 0;
let pontosJoao = 0;
let cartaJogadaJogador = null;
let cartaJogadaJoao = null;

// VALORES E NAIPES DO TRUCO MINEIRO
const valores = ['4', '5', '6', '7', 'Q', 'J', 'K', 'A', '2', '3'];
const naipes = ['♦', '♥', '♠', '♣'];
const forcaCarta = { '4': 1, '5': 2, '6': 3, '7': 4, 'Q': 5, 'J': 6, 'K': 7, 'A': 8, '2': 9, '3': 10 };

// PEGA OS ELEMENTOS DA TELA
const campoNome = document.getElementById('campo-nome');
const botaoMatricular = document.getElementById('botao-matricular');
const avisoMatricula = document.getElementById('aviso-matricula');
const telaMatricula = document.getElementById('tela-matricula');
const telaModo = document.getElementById('tela-modo');
const telaJogo = document.getElementById('tela-jogo');
const telaMaquina1x1 = document.getElementById('tela-maquina-1x1');
const meuIdMostrar = document.getElementById('meu-id');
const listaJogando = document.getElementById('lista-jogando');
const listaEspera = document.getElementById('lista-espera');

// BOTÕES DE MODO DE JOGO
const botaoModoPessoas = document.getElementById('modo-pessoas');
const botaoModoMaquina1x1 = document.getElementById('modo-maquina-1x1');
const botaoModoMaquinaDuplas = document.getElementById('modo-maquina-duplas');

// ELEMENTOS DA TELA 1x1
let nomeJogadorEl, suasCartasEl, cartasJoaoEl, pontosJogadorEl, pontosJoaoEl;
let cartaJogadaJogadorEl, cartaJogadaJoaoEl, resultadoRodadaEl;
let botaoJogarCarta, botaoNovaRodada, botaoSair;

// AO CLICAR NO BOTÃO DE MATRÍCULA
botaoMatricular.addEventListener('click', function() {
    let nome = campoNome.value.trim();
    
    if (nome.length === 0) {
        avisoMatricula.innerHTML = '<span style="color:#ff6b6b;">⚠️ Digite seu nome primeiro!</span>';
        return;
    }
    if (nome.length < 2) {
        avisoMatricula.innerHTML = '<span style="color:#ff6b6b;">⚠️ Nome muito curto!</span>';
        return;
    }

    contadorJogadores++;
    let identificador = nome + ' #' + contadorJogadores;

    jogadorAtual = {
        nome: nome,
        id: identificador,
        modoJogo: null,
        parceiro: null,
        formatoJogo: null
    };

    telaMatricula.style.display = 'none';
    telaModo.style.display = 'block';
    meuIdMostrar.textContent = identificador;
    avisoMatricula.innerHTML = '<span style="color:#51cf66;">✅ Matrícula realizada com sucesso!</span>';
});

// ===== ESCOLHA DE MODO DE JOGO =====

botaoModoPessoas.addEventListener('click', function() {
    jogadorAtual.modoJogo = 'pessoas';
    telaModo.style.display = 'none';
    telaJogo.style.display = 'block';
    listaJogadoresNaFila.push(jogadorAtual);
    atualizarListasTela();
    alert('🌐 Você escolheu jogar com PESSOAS REAIS! Aguardando adversário...');
});

botaoModoMaquina1x1.addEventListener('click', function() {
    jogadorAtual.modoJogo = 'maquina-1x1';
    telaModo.style.display = 'none';
    telaMaquina1x1.style.display = 'block';
    inicializarElementosTelaMaquina();
    iniciarNovaPartida();
});

botaoModoMaquinaDuplas.addEventListener('click', function() {
    jogadorAtual.modoJogo = 'maquina-duplas';
    alert('🤝 Você escolheu jogar com 3 MÁQUINAS (Duplas)! Em breve disponível!');
});

// ===== INICIALIZA ELEMENTOS DA TELA CONTRA A MÁQUINA =====
function inicializarElementosTelaMaquina() {
    nomeJogadorEl = document.getElementById('nome-jogador');
    suasCartasEl = document.getElementById('suas-cartas');
    cartasJoaoEl = document.getElementById('cartas-joao');
    pontosJogadorEl = document.getElementById('pontos-jogador');
    pontosJoaoEl = document.getElementById('pontos-joao');
    cartaJogadaJogadorEl = document.getElementById('carta-jogada-jogador');
    cartaJogadaJoaoEl = document.getElementById('carta-jogada-joao');
    resultadoRodadaEl = document.getElementById('resultado-rodada');
    botaoJogarCarta = document.getElementById('botao-jogar-carta');
    botaoNovaRodada = document.getElementById('botao-nova-rodada');
    botaoSair = document.getElementById('botao-sair');

    nomeJogadorEl.textContent = jogadorAtual.nome;

    botaoJogarCarta.addEventListener('click', jogarCartaSelecionada);
    botaoNovaRodada.addEventListener('click', iniciarNovaRodada);
    botaoSair.addEventListener('click', sairDoJogo);
}

// ===== LÓGICA DO JOGO CONTRA A MÁQUINA =====
function iniciarNovaPartida() {
    pontosJogador = 0;
    pontosJoao = 0;
    atualizarPlacar();
    iniciarNovaRodada();
}

function criarBaralho() {
    baralho = [];
    for (let v of valores) {
        for (let n of naipes) {
            baralho.push({ valor: v, naipe: n, forca: forcaCarta[v] });
        }
    }
    embaralhar();
}

function embaralhar() {
    for (let i = baralho.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [baralho[i], baralho[j]] = [baralho[j], baralho[i]];
    }
}

function iniciarNovaRodada() {
    criarBaralho();
    cartasJogador = baralho.splice(0, 3);
    cartasJoao = baralho.splice(0, 3);
    cartaSelecionada = null;
    cartaJogadaJogador = null;
    cartaJogadaJoao = null;
    resultadoRodadaEl.textContent = '';
    cartaJogadaJogadorEl.innerHTML = '';
    cartaJogadaJoaoEl.innerHTML = '';
    exibirCartasJogador();
    exibirCartasJoao();
}

function exibirCartasJogador() {
    suasCartasEl.innerHTML = '';
    cartasJogador.forEach((carta, indice) => {
        const div = document.createElement('div');
        div.className = 'carta';
        div.dataset.indice = indice;
        div.innerHTML = `
            <span>${carta.valor}</span>
            <span class="naipe">${carta.naipe}</span>
        `;
        div.addEventListener('click', () => selecionarCarta(indice));
        suasCartasEl.appendChild(div);
    });
}

function exibirCartasJoao() {
    cartasJoaoEl.innerHTML = '';
    cartasJoao.forEach(() => {
        const div = document.createElement('div');
        div.className = 'carta';
        div.style.background = 'linear-gradient(135deg, #4b2e83, #2a194e)';
        div.style.color = 'white';
        div.innerHTML = '<span>?</span><span class="naipe">🃏</span>';
        cartasJoaoEl.appendChild(div);
    });
}

function selecionarCarta(indice) {
    document.querySelectorAll('#suas-cartas .carta').forEach(c => c.classList.remove('selecionada'));
    cartaSelecionada = indice;
    document.querySelector(`#suas-cartas .carta[data-indice="${indice}"]`).classList.add('selecionada');
}

function jogarCartaSelecionada() {
    if (cartaSelecionada === null) {
        alert('⚠️ Selecione uma carta primeiro!');
        return;
    }

    // JOGADOR JOGA
    cartaJogadaJogador = cartasJogador.splice(cartaSelecionada, 1)[0];
    exibirCartaNaMesa(cartaJogadaJogador, cartaJogadaJogadorEl);

    // JOÃO JOGA A MELHOR CARTA QUE TEM
    let melhorIndice = 0;
    cartasJoao.forEach((c, i) => {
        if (c.forca > cartasJoao[melhorIndice].forca) melhorIndice = i;
    });
    cartaJogadaJoao = cartasJoao.splice(melhorIndice, 1)[0];
    exibirCartaNaMesa(cartaJogadaJoao, cartaJogadaJoaoEl);

    // REVELA CARTA DO JOÃO
    cartasJoaoEl.innerHTML = '';
    cartasJoao.forEach(() => {
        const div = document.createElement('div');
        div.className = 'carta';
        div.style.background = 'linear-gradient(135deg, #4b2e83, #2a194e)';
        div.style.color = 'white';
        div.innerHTML = '<span>?</span><span class="naipe">🃏</span>';
        cartasJoaoEl.appendChild(div);
    });

    // DECIDE VENCEDOR
    if (cartaJogadaJogador.forca > cartaJogadaJoao.forca) {
        resultadoRodadaEl.textContent = '✅ VOCÊ VENCEU A RODADA!';
        pontosJogador += 1;
    } else if (cartaJogadaJogador.forca < cartaJogadaJoao.forca) {
        resultadoRodadaEl.textContent = '❌ JOÃO VENCEU A RODADA!';
        pontosJoao += 1;
    } else {
        resultadoRodadaEl.textContent = '🤝 EMPATE! Ninguém pontuou.';
    }

    atualizarPlacar();
    cartaSelecionada = null;
}

function exibirCartaNaMesa(carta, elemento) {
    elemento.innerHTML = `
        <span>${carta.valor}</span>
        <span class="naipe">${carta.naipe}</span>
    `;
}

function atualizarPlacar() {
    pontosJogadorEl.textContent = pontosJogador;
    pontosJoaoEl.textContent = pontosJoao;
}

function sairDoJogo() {
    if (confirm('🚪 Tem certeza que deseja sair do jogo?')) {
        telaMaquina1x1.style.display = 'none';
        telaMatricula.style.display = 'block';
        campoNome.value = '';
    }
}

// ===== FUNÇÕES DA TELA DE PESSOAS =====
function atualizarListasTela() {
    if (listaJogadoresNaFila.length === 0) {
        listaEspera.innerHTML = '<p>Ninguém na fila de espera.</p>';
    } else {
        let html = '';
        listaJogadoresNaFila.forEach(function(jogador) {
            html += `<p>⏳ ${jogador.id} — Aguardando parceiro...</p>`;
        });
        listaEspera.innerHTML = html;
    }
}

// BOTÕES DE FORMATO DE PARTIDA
const botao2 = document.getElementById('botao-2jogadores');
const botao4 = document.getElementById('botao-4jogadores');

botao2.addEventListener('click', function() {
    if (jogadorAtual) {
        jogadorAtual.formatoJogo = '2jogadores';
        alert('🎯 Você escolheu partida de 2 jogadores! Aguardando adversário...');
    }
});

botao4.addEventListener('click', function() {
    if (jogadorAtual) {
        jogadorAtual.formatoJogo = '4jogadores';
        alert('🎯 Você escolheu partida de 4 jogadores! Agora escolha seu parceiro!');
    }
});
