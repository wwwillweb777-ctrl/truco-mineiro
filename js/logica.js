// ===== TRUCO MINEIRO — ARRASTAR OU TOCAR E JOGAR =====

let contadorJogadores = 0;
let jogadorAtual = null;
let listaJogadoresNaFila = [];

let baralho = [];
let cartasJogador = [];
let cartasJoao = [];
let cartaSelecionada = null;
let pontosJogador = 0;
let pontosJoao = 0;
let cartaJogadaJogador = null;
let cartaJogadaJoao = null;
let rodadaAtual = 0;
let indiceArrastado = null;

const valores = ['4', '5', '6', '7', 'Q', 'J', 'K', 'A', '2', '3'];
const naipes = ['♦', '♥', '♠', '♣'];
const forcaCarta = { '4': 1, '5': 2, '6': 3, '7': 4, 'Q': 5, 'J': 6, 'K': 7, 'A': 8, '2': 9, '3': 10 };

const campoNome = document.getElementById('campo-nome');
const botaoMatricular = document.getElementById('botao-matricular');
const avisoMatricula = document.getElementById('aviso-matricula');
const telaMatricula = document.getElementById('tela-matricula');
const telaModo = document.getElementById('tela-modo');
const telaJogo = document.getElementById('tela-jogo');
const telaMaquina1x1 = document.getElementById('tela-maquina-1x1');
const meuIdMostrar = document.getElementById('meu-id');
const listaEspera = document.getElementById('lista-espera');

const botaoModoPessoas = document.getElementById('modo-pessoas');
const botaoModoMaquina1x1 = document.getElementById('modo-maquina-1x1');
const botaoModoMaquinaDuplas = document.getElementById('modo-maquina-duplas');

let nomeJogadorEl, suasCartasEl, cartasJoaoEl, pontosJogadorEl, pontosJoaoEl;
let cartaJogadaJogadorEl, cartaJogadaJoaoEl, resultadoRodadaEl;
let botaoNovaRodada, botaoSair;

// ===== MATRÍCULA =====
botaoMatricular.addEventListener('click', function() {
    let nome = campoNome.value.trim();
    if (nome.length === 0) {
        avisoMatricula.innerHTML = '<span style="color:#ff6b6b;">⚠️ Digite seu nome!</span>';
        return;
    }
    contadorJogadores++;
    jogadorAtual = { nome, id: nome + ' #' + contadorJogadores };
    telaMatricula.style.display = 'none';
    telaModo.style.display = 'block';
    meuIdMostrar.textContent = jogadorAtual.id;
});

// ===== ESCOLHA DE MODO =====
botaoModoPessoas.addEventListener('click', function() {
    jogadorAtual.modoJogo = 'pessoas';
    telaModo.style.display = 'none';
    telaJogo.style.display = 'block';
    listaJogadoresNaFila.push(jogadorAtual);
    alert('🌐 Aguardando adversário...');
});

botaoModoMaquina1x1.addEventListener('click', function() {
    telaModo.style.display = 'none';
    telaMaquina1x1.style.display = 'block';
    inicializarElementos();
    configurarMesa();
    iniciarNovaPartida();
});

botaoModoMaquinaDuplas.addEventListener('click', function() {
    alert('🤝 Em breve disponível!');
});

// ===== INICIALIZA TELA =====
function inicializarElementos() {
    nomeJogadorEl = document.getElementById('nome-jogador');
    suasCartasEl = document.getElementById('suas-cartas');
    cartasJoaoEl = document.getElementById('cartas-joao');
    pontosJogadorEl = document.getElementById('pontos-jogador');
    pontosJoaoEl = document.getElementById('pontos-joao');
    cartaJogadaJogadorEl = document.getElementById('carta-jogada-jogador');
    cartaJogadaJoaoEl = document.getElementById('carta-jogada-joao');
    resultadoRodadaEl = document.getElementById('resultado-rodada');
    botaoNovaRodada = document.getElementById('botao-nova-rodada');
    botaoSair = document.getElementById('botao-sair');

    nomeJogadorEl.textContent = jogadorAtual.nome;
    botaoNovaRodada.addEventListener('click', iniciarNovaRodada);
    botaoSair.addEventListener('click', sairDoJogo);
}

// ===== ÁREA DA MESA — RECEBE CARTA SOLTA =====
function configurarMesa() {
    const areaMesa = document.querySelector('.area-mesa');
    if (!areaMesa) return;
    areaMesa.addEventListener('dragover', e => e.preventDefault());
    areaMesa.addEventListener('drop', function(e) {
        e.preventDefault();
        if (indiceArrastado !== null) {
            cartaSelecionada = indiceArrastado;
            efetuarJogada();
        }
    });
}

// ===== INÍCIO =====
function iniciarNovaPartida() {
    pontosJogador = pontosJoao = 0;
    atualizarPlacar();
    iniciarNovaRodada();
}

function criarBaralho() {
    baralho = [];
    for (let v of valores)
        for (let n of naipes)
            baralho.push({ valor: v, naipe: n, forca: forcaCarta[v] });
    embaralhar();
}

function embaralhar() {
    for (let i = baralho.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [baralho[i], baralho[j]] = [baralho[j], baralho[i]];
    }
}

// ===== NOVA RODADA =====
function iniciarNovaRodada() {
    criarBaralho();
    cartasJogador = baralho.splice(0, 3);
    cartasJoao = baralho.splice(0, 3);
    cartaSelecionada = indiceArrastado = null;
    rodadaAtual = 0;
    cartaJogadaJogador = cartaJogadaJoao = null;
    resultadoRodadaEl.textContent = '';
    cartaJogadaJogadorEl.innerHTML = '';
    cartaJogadaJoaoEl.innerHTML = '';
    exibirCartas();
    exibirCartasJoao();
}

// ===== MOSTRA CARTAS NA MÃO =====
function exibirCartas() {
    suasCartasEl.innerHTML = '';
    cartasJogador.forEach((carta, i) => {
        if (!carta) return;
        const div = document.createElement('div');
        div.className = 'carta';
        div.dataset.indice = i;
        div.draggable = true;
        div.innerHTML = `<span>${carta.valor}</span><span class="naipe">${carta.naipe}</span>`;

        // ✋ ARRASTAR (computador)
        div.addEventListener('dragstart', function(e) {
            indiceArrastado = i;
            cartaSelecionada = i;
            document.querySelectorAll('#suas-cartas .carta').forEach(c => c.classList.remove('selecionada'));
            this.classList.add('selecionada');
            e.dataTransfer.effectAllowed = 'move';
        });

        // 👆 TOCA = JOGA DIRETO (celular)
        div.addEventListener('click', function() {
            cartaSelecionada = i;
            document.querySelectorAll('#suas-cartas .carta').forEach(c => c.classList.remove('selecionada'));
            this.classList.add('selecionada');
            // ⏱️ Pequeno delay para mostrar o amarelo ANTES de jogar
            setTimeout(() => efetuarJogada(), 150);
        });

        suasCartasEl.appendChild(div);
    });
}

function exibirCartasJoao() {
    cartasJoaoEl.innerHTML = '';
    cartasJoao.forEach(carta => {
        if (!carta) return;
        const div = document.createElement('div');
        div.className = 'carta';
        div.style.background = 'linear-gradient(135deg, #4b2e83, #2a194e)';
        div.style.color = 'white';
        div.innerHTML = '<span>?</span><span class="naipe">🃏</span>';
        cartasJoaoEl.appendChild(div);
    });
}

// ===== JOGA A CARTA NA MESA =====
function efetuarJogada() {
    if (cartaSelecionada === null || !cartasJogador[cartaSelecionada]) {
        return;
    }

    rodadaAtual++;

    // Jogador joga
    cartaJogadaJogador = cartasJogador.splice(cartaSelecionada, 1)[0];

    // João joga a melhor carta
    let melhor = 0;
    cartasJoao.forEach((c, i) => {
        if (c.forca > cartasJoao[melhor].forca) melhor = i;
    });
    cartaJogadaJoao = cartasJoao.splice(melhor, 1)[0];

    // 1ª jogada → mostra as duas
    if (rodadaAtual === 1) {
        mostrarNaMesa(cartaJogadaJogador, cartaJogadaJogadorEl);
        mostrarNaMesa(cartaJogadaJoao, cartaJogadaJoaoEl);
    }
    // 2ª e 3ª → limpa e mostra só a nova
    else {
        cartaJogadaJogadorEl.innerHTML = '';
        cartaJogadaJoaoEl.innerHTML = '';
        mostrarNaMesa(cartaJogadaJogador, cartaJogadaJogadorEl);
        mostrarNaMesa(cartaJogadaJoao, cartaJogadaJoaoEl);

        // Decide vencedor
        if (cartaJogadaJogador.forca > cartaJogadaJoao.forca) {
            resultadoRodadaEl.textContent = '✅ VOCÊ VENCEU A RODADA!';
            pontosJogador++;
        } else if (cartaJogadaJogador.forca < cartaJogadaJoao.forca) {
            resultadoRodadaEl.textContent = '❌ JOÃO VENCEU A RODADA!';
            pontosJoao++;
        } else {
            resultadoRodadaEl.textContent = '🤝 EMPATE!';
        }
        atualizarPlacar();
    }

    exibirCartas();
    exibirCartasJoao();
    cartaSelecionada = indiceArrastado = null;
}

function mostrarNaMesa(carta, el) {
    el.innerHTML = `<span>${carta.valor}</span><span class="naipe">${carta.naipe}</span>`;
}

function atualizarPlacar() {
    pontosJogadorEl.textContent = pontosJogador;
    pontosJoaoEl.textContent = pontosJoao;
}

function sairDoJogo() {
    if (confirm('🚪 Sair do jogo?')) {
        telaMaquina1x1.style.display = 'none';
        telaMatricula.style.display = 'block';
    }
}

// ===== TELA DE PESSOAS =====
function atualizarListasTela() {
    if (listaJogadoresNaFila.length === 0) {
        listaEspera.innerHTML = '<p>Ninguém na fila.</p>';
    } else {
        listaEspera.innerHTML = listaJogadoresNaFila.map(j => `<p>⏳ ${j.id}</p>`).join('');
    }
}

const botao2 = document.getElementById('botao-2jogadores');
const botao4 = document.getElementById('botao-4jogadores');
botao2?.addEventListener('click', () => alert('🎯 Aguardando adversário...'));
botao4?.addEventListener('click', () => alert('🎯 Escolha seu parceiro!'));
