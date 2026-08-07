// ===== TRUCO MINEIRO — PARTE 1: COM LISTA DE FORÇAS =====

let contadorJogadores = 0;
let jogadorAtual = null;

let baralho = [];
let cartasJogador = [];
let cartasJoao = [];
let cartaSelecionada = null;
let pontosJogador = 0;
let pontosJoao = 0;
let cartaJogadaJogador = null;
let cartaJogadaJoao = null;
let vitoriasRodadaJogador = 0;
let vitoriasRodadaJoao = 0;
let indiceArrastado = null;
let quemJogaPrimeiro = 'jogador';
let vezDeJogar = 'jogador';
let podeJogar = true;
let rodadaEmAndamento = true;

// ===== VALORES OFICIAIS =====
const ETAPAS = [
    { nome: 'truco', valor: 4, recusa: 2 },
    { nome: 'seis', valor: 8, recusa: 4 },
    { nome: 'nove', valor: 12, recusa: 6 }
];
const LIMITE_MAO_DE_10 = 10;
const PONTOS_PARTIDA = 12;

let valorAtualRodada = 2;
let indiceEtapa = -1;
let aguardandoResposta = false;
let quemPediu = null;

const valores = ['4', '5', '6', '7', 'Q', 'J', 'K', 'A', '2', '3'];
const naipes = ['♦', '♥', '♠', '♣'];

// ===== 🃏 TABELA DE FORÇAS — ORDEM OFICIAL DO TRUCO MINEIRO =====
const TABELA_FORCAS = [
    { nome: '⚔️ ZAP (4 de paus)', valor: '4', naipe: '♣', forca: 14, mata: 'TODAS as cartas!' },
    { nome: '⚔️ ESPADILHA (Ás de espadas)', valor: 'A', naipe: '♠', forca: 13, mata: 'Todas, menos o Zap!' },
    { nome: '🏆 7 DE COPAS', valor: '7', naipe: '♥', forca: 12, mata: 'Todas, menos Zap e Espadilha!' },
    { nome: '🏆 7 DE OUROS', valor: '7', naipe: '♦', forca: 11, mata: 'Todas as comuns!' },
    { nome: '3', valor: '3', naipe: null, forca: 10, mata: '2, Ás, Rei, Valete, Dama, 7 comum e abaixo!' },
    { nome: '2', valor: '2', naipe: null, forca: 9, mata: 'Ás, Rei, Valete, Dama, 7 comum e abaixo!' },
    { nome: 'Ás comum', valor: 'A', naipe: null, forca: 8, mata: 'Rei, Valete, Dama, 7 comum e abaixo!' },
    { nome: 'Rei (K)', valor: 'K', naipe: null, forca: 7, mata: 'Valete, Dama, 7 comum e abaixo!' },
    { nome: 'Valete (J)', valor: 'J', naipe: null, forca: 6, mata: 'Dama, 7 comum e abaixo!' },
    { nome: 'Dama (Q)', valor: 'Q', naipe: null, forca: 5, mata: '7 comum, 6, 5 e 4 comum!' },
    { nome: '7 comum', valor: '7', naipe: null, forca: 4, mata: '6, 5 e 4 comum!' },
    { nome: '6', valor: '6', naipe: null, forca: 3, mata: '5 e 4 comum!' },
    { nome: '5', valor: '5', naipe: null, forca: 2, mata: '4 comum!' },
    { nome: '4 comum', valor: '4', naipe: null, forca: 1, mata: 'Nenhuma!' }
];

// ===== ✅ CALCULA FORÇA — JOÃO AGORA SABE TUDO! =====
function calcularForca(valor, naipe) {
    // Cartas ESPECIAIS — o naipe FAZ diferença!
    if (valor === '4' && naipe === '♣') return 14; // ZAP
    if (valor === 'A' && naipe === '♠') return 13;  // ESPADILHA
    if (valor === '7' && naipe === '♥') return 12;  // 7 DE COPAS
    if (valor === '7' && naipe === '♦') return 11;  // 7 DE OUROS

    // Cartas NORMAIS — o naipe NÃO faz diferença!
    const ordemNormal = { '3': 10, '2': 9, 'A': 8, 'K': 7, 'J': 6, 'Q': 5, '7': 4, '6': 3, '5': 2, '4': 1 };
    return ordemNormal[valor] || 0;
}

const CORES = { truco: '#ffc107', seis: '#ff6b00', nove: '#e53935' };

// ===== ELEMENTOS DA TELA =====
const campoNome = document.getElementById('campo-nome');
const botaoMatricular = document.getElementById('botao-matricular');
const avisoMatricula = document.getElementById('aviso-matricula');
const telaMatricula = document.getElementById('tela-matricula');
const telaModo = document.getElementById('tela-modo');
const telaMaquina1x1 = document.getElementById('tela-maquina-1x1');
const meuIdMostrar = document.getElementById('meu-id');

const botaoModoPessoas = document.getElementById('modo-pessoas');
const botaoModoMaquina1x1 = document.getElementById('modo-maquina-1x1');

let nomeJogadorEl, suasCartasEl, cartasJoaoEl;
let pontosJogadorEl, pontosJoaoEl;
let cartaJogadaJogadorEl, cartaJogadaJoaoEl;
let resultadoRodadaEl, areaPedidosEl;
let botaoNovaRodada, botaoSair;

// ===== MATRÍCULA E TELAS =====
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

botaoModoMaquina1x1.addEventListener('click', () => {
    telaModo.style.display = 'none';
    telaMaquina1x1.style.display = 'block';
    inicializarElementos();
    iniciarNovaPartida();
});

// ===== INICIALIZA ELEMENTOS =====
function inicializarElementos() {
    nomeJogadorEl = document.getElementById('nome-jogador');
    suasCartasEl = document.getElementById('suas-cartas');
    cartasJoaoEl = document.getElementById('cartas-joao');
    pontosJogadorEl = document.getElementById('pontos-jogador');
    pontosJoaoEl = document.getElementById('pontos-joao');
    cartaJogadaJogadorEl = document.getElementById('carta-jogada-jogador');
    cartaJogadaJoaoEl = document.getElementById('carta-jogada-joao');
    resultadoRodadaEl = document.getElementById('resultado-rodada');
    areaPedidosEl = document.getElementById('area-pedidos');
    botaoNovaRodada = document.getElementById('botao-nova-rodada');
    botaoSair = document.getElementById('botao-sair');

    nomeJogadorEl.textContent = jogadorAtual.nome;
    botaoNovaRodada.style.opacity = '0.2';
    botaoNovaRodada.style.pointerEvents = 'none';
    botaoNovaRodada.addEventListener('click', () => {
        if (pontosJogador >= PONTOS_PARTIDA || pontosJoao >= PONTOS_PARTIDA) {
            iniciarNovaPartida();
        } else {
            alert('⚠️ Chegue a 12 pontos primeiro!');
        }
    });
    botaoSair.addEventListener('click', () => {
        if (confirm('🚪 Sair do jogo?')) {
            telaMaquina1x1.style.display = 'none';
            telaMatricula.style.display = 'block';
        }
    });
}

// ===== NOVA PARTIDA =====
function iniciarNovaPartida() {
    pontosJogador = pontosJoao = 0;
    quemJogaPrimeiro = 'jogador';
    atualizarPlacar();
    iniciarNovaRodada();
}

// ===== ✅ BARALHO COM FORÇA CORRIGIDA =====
function criarBaralho() {
    baralho = [];
    for (let v of valores)
        for (let n of naipes) {
            let forcaCalculada = calcularForca(v, n);
            baralho.push({ valor: v, naipe: n, forca: forcaCalculada });
        }
    embaralhar();
}

function embaralhar() {
    for (let i = baralho.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [baralho[i], baralho[j]] = [baralho[j], baralho[i]];
    }
}

function atualizarPlacar() {
    pontosJogadorEl.textContent = pontosJogador;
    pontosJoaoEl.textContent = pontosJoao;
}



// ===== PARTE 2: RODADA, JOGADAS E JOÃO — CORRIGIDO =====

// ===== NOVA RODADA =====
function iniciarNovaRodada() {
    rodadaEmAndamento = true;
    criarBaralho();
    cartasJogador = baralho.splice(0, 3);
    cartasJoao = baralho.splice(0, 3);
    cartaSelecionada = indiceArrastado = null;
    vitoriasRodadaJogador = vitoriasRodadaJoao = 0;
    cartaJogadaJogador = cartaJogadaJoao = null;
    valorAtualRodada = 2;
    indiceEtapa = -1;
    aguardandoResposta = false;
    quemPediu = null;
    vezDeJogar = quemJogaPrimeiro;
    podeJogar = true;

    cartaJogadaJogadorEl.innerHTML = '';
    cartaJogadaJoaoEl.innerHTML = '';

    let situacao = verificarMaoDeDez();
    let quemComeca = quemJogaPrimeiro === 'jogador' ? '👉 VOCÊ JOGA PRIMEIRO!' : '👉 JOÃO JOGA PRIMEIRO!';
    resultadoRodadaEl.textContent = `${situacao} — ${quemComeca} — vale ${valorAtualRodada}pts`;

    exibirCartas();
    exibirCartasJoao();
    atualizarBotoesPedido();

    if (vezDeJogar === 'joao') {
        podeJogar = false;
        setTimeout(() => joaoJoga(), 1500);
    }
}

function verificarMaoDeDez() {
    let voceTem = pontosJogador === LIMITE_MAO_DE_10;
    let joaoTem = pontosJoao === LIMITE_MAO_DE_10;
    if (voceTem && joaoTem) return '✋✋ MÃO DE FERRO!';
    if (voceTem) return `✋ MÃO DE 10! Você vê primeiro!`;
    if (joaoTem) return '✋ MÃO DE 10! João vê primeiro!';
    return '🎯 Rodada normal';
}

// ===== BOTÕES — MÃO DE 10 ESCONDE TRUCO =====
function atualizarBotoesPedido() {
    if (!areaPedidosEl) return;
    let html = '';

    let ehMaoDeDez = (pontosJogador === LIMITE_MAO_DE_10) || (pontosJoao === LIMITE_MAO_DE_10);
    if (ehMaoDeDez) {
        areaPedidosEl.innerHTML = '';
        return;
    }

    if (aguardandoResposta && quemPediu === 'joao') {
        let etapa = ETAPAS[indiceEtapa + 1];
        html = `
            <div style="display:flex; gap:10px; justify-content:center;">
                <button onclick="aceitarPedido()" style="padding:10px 18px; background:#28a745; color:white; border:none; border-radius:8px; font-weight:bold;">✅ ACEITAR (${etapa.valor}pts)</button>
                <button onclick="recusarPedido()" style="padding:10px 18px; background:#dc3545; color:white; border:none; border-radius:8px; font-weight:bold;">❌ CORRER (+${etapa.recusa}pts)</button>
            </div>`;
    } else if (!aguardandoResposta && vezDeJogar === 'jogador') {
        if (indiceEtapa === -1) {
            html = `<button onclick="pedirAumento('truco')" style="padding:10px 16px; background:${CORES.truco}; color:#000; border:none; border-radius:8px; font-weight:bold;">🎯 PEDIR TRUCO (4pts)</button>`;
        } else if (indiceEtapa === 0) {
            html = `<button onclick="pedirAumento('seis')" style="padding:10px 16px; background:${CORES.seis}; color:#fff; border:none; border-radius:8px; font-weight:bold;">🎯 PEDIR SEIS (8pts)</button>`;
        } else if (indiceEtapa === 1) {
            html = `<button onclick="pedirAumento('nove')" style="padding:10px 16px; background:${CORES.nove}; color:#fff; border:none; border-radius:8px; font-weight:bold;">🎯 PEDIR NOVE (12pts)</button>`;
        }
    }
    areaPedidosEl.innerHTML = html;
}

// ===== VOCÊ JOGA =====
function efetuarJogada() {
    if (cartaSelecionada === null || !cartasJogador[cartaSelecionada]) return;
    if (vezDeJogar !== 'jogador' || !podeJogar || aguardandoResposta) return;

    podeJogar = false;
    cartaJogadaJogador = cartasJogador.splice(cartaSelecionada, 1)[0];
    mostrarNaMesa(cartaJogadaJogador, cartaJogadaJogadorEl);
    resultadoRodadaEl.textContent = `🃏 Você jogou: ${cartaJogadaJogador.valor} de ${cartaJogadaJogador.naipe}`;
    cartaSelecionada = null;
    exibirCartas();

    vezDeJogar = 'joao';
    areaPedidosEl.innerHTML = '';
    atualizarBotoesPedido();

    setTimeout(() => joaoJoga(), 1500);
}

// ===== JOÃO JOGA =====
function joaoJoga() {
    if (vezDeJogar !== 'joao') return;

    let forcas = cartasJoao.map(c => c.forca);
    let melhorForca = Math.max(...forcas);
    let indiceMelhor = forcas.indexOf(melhorForca);

    cartaJogadaJoao = cartasJoao.splice(indiceMelhor, 1)[0];
    mostrarNaMesa(cartaJogadaJoao, cartaJogadaJoaoEl);
    resultadoRodadaEl.textContent = `🃏 João jogou: ${cartaJogadaJoao.valor} de ${cartaJogadaJoao.naipe}`;

    setTimeout(() => verificarVencedor(), 1200);
}

// ===== ✅ CORRIGIDO — JOÃO JOGA UMA SÓ E PARA =====
function verificarVencedor() {
    let vencedor = null;

    if (cartaJogadaJogador.forca > cartaJogadaJoao.forca) {
        vitoriasRodadaJogador++;
        resultadoRodadaEl.textContent = `✅ VOCÊ VENCEU! (${vitoriasRodadaJogador} x ${vitoriasRodadaJoao})`;
        vencedor = 'jogador';
    } else if (cartaJogadaJogador.forca < cartaJogadaJoao.forca) {
        vitoriasRodadaJoao++;
        resultadoRodadaEl.textContent = `❌ JOÃO VENCEU! (${vitoriasRodadaJogador} x ${vitoriasRodadaJoao})`;
        vencedor = 'joao';
    } else {
        resultadoRodadaEl.textContent = '🤝 EMPATE! Quem começou joga a próxima!';
        vencedor = quemJogaPrimeiro;
    }

    setTimeout(() => {
        cartaJogadaJogadorEl.innerHTML = '';
        cartaJogadaJoaoEl.innerHTML = '';

        if (vitoriasRodadaJogador === 2 || vitoriasRodadaJoao === 2) {
            encerrarRodada();
            return;
        }

        vezDeJogar = vencedor;
        podeJogar = true; // ✅ SEMPRE LIBERA DEPOIS!

        exibirCartas();
        exibirCartasJoao();
        atualizarBotoesPedido();

        // ✅ SÓ JOGA DE NOVO SE FOR A VEZ DELE — UMA POR VEZ!
        if (vencedor === 'joao') {
            podeJogar = false;
            setTimeout(() => joaoJoga(), 1500);
        }
    }, 1800);
}

// ===== ENCERRAR RODADA =====
function encerrarRodada() {
    rodadaEmAndamento = false;
    aguardandoResposta = false;

    if (vitoriasRodadaJogador > vitoriasRodadaJoao) {
        pontosJogador += valorAtualRodada;
        resultadoRodadaEl.textContent = `🏆 VOCÊ VENCEU A RODADA! +${valorAtualRodada}pts`;
        quemJogaPrimeiro = 'jogador';
    } else {
        pontosJoao += valorAtualRodada;
        resultadoRodadaEl.textContent = `😔 JOÃO VENCEU A RODADA! +${valorAtualRodada}pts`;
        quemJogaPrimeiro = 'joao';
    }

    atualizarPlacar();
    atualizarBotoesPedido();

    if (pontosJogador >= PONTOS_PARTIDA || pontosJoao >= PONTOS_PARTIDA) {
        setTimeout(() => {
            let ganhou = pontosJogador >= PONTOS_PARTIDA;
            alert(`${ganhou ? '🎉 PARABÉNS! VOCÊ VENCEU!' : '😔 JOÃO VENCEU A PARTIDA!'}\nPlacar: ${pontosJogador} x ${pontosJoao}`);
            botaoNovaRodada.style.opacity = '1';
            botaoNovaRodada.style.pointerEvents = 'auto';
        }, 600);
    } else {
        setTimeout(() => {
            resultadoRodadaEl.textContent = '🃏 Preparando nova rodada...';
            iniciarNovaRodada();
        }, 2500);
    }
}

// ===== EXIBIR CARTAS =====
function exibirCartas() {
    suasCartasEl.innerHTML = '';
    cartasJogador.forEach((carta, i) => {
        if (!carta) return;
        const div = document.createElement('div');
        div.className = 'carta';
        div.style.cursor = (vezDeJogar === 'jogador' && podeJogar && !aguardandoResposta) ? 'pointer' : 'not-allowed';
        div.innerHTML = `<span>${carta.valor}</span><span class="naipe">${carta.naipe}</span>`;
        div.addEventListener('click', () => {
            if (vezDeJogar !== 'jogador' || !podeJogar || aguardandoResposta) return;
            cartaSelecionada = i;
            document.querySelectorAll('#suas-cartas .carta').forEach((el, idx) => {
                el.style.transform = idx === i ? 'translateY(-10px)' : '';
                el.style.boxShadow = idx === i ? '0 0 15px #ffd700' : '';
            });
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

function mostrarNaMesa(carta, el) {
    el.innerHTML = `<span style="font-size:1.3rem; font-weight:bold;">${carta.valor}</span><span style="font-size:1.5rem;">${carta.naipe}</span>`;
}

// ===== TRUCO =====
window.pedirAumento = function(tipo) {
    if (aguardandoResposta) return;
    let indicePedido = ETAPAS.findIndex(e => e.nome === tipo);
    let etapa = ETAPAS[indicePedido];

    aguardandoResposta = true;
    quemPediu = 'jogador';
    resultadoRodadaEl.textContent = `🔴 VOCÊ PEDE ${tipo.toUpperCase()}! João decide...`;

    setTimeout(() => {
        let forcas = cartasJoao.map(c => c.forca);
        let melhor = Math.max(...forcas);
        let chance = melhor >= 8 ? 0.85 : melhor >= 5 ? 0.55 : 0.20;
        let aceita = Math.random() < chance;

        if (aceita) {
            indiceEtapa = indicePedido;
            valorAtualRodada = etapa.valor;
            resultadoRodadaEl.textContent = `✅ JOÃO ACEITOU! Agora vale ${etapa.valor}pts!`;
            encerraAumento();
        } else {
            pontosJogador += etapa.recusa;
            resultadoRodadaEl.textContent = `🏃 JOÃO CORREU! VOCÊ GANHA ${etapa.recusa}pts!`;
            encerraAumento();
        }
        atualizarPlacar();
        atualizarBotoesPedido();
    }, 1500);
};

window.aceitarPedido = function() {
    let etapa = ETAPAS[indiceEtapa + 1];
    indiceEtapa++;
    valorAtualRodada = etapa.valor;
    resultadoRodadaEl.textContent = `✅ VOCÊ ACEITOU! ${etapa.valor}pts!`;
    encerraAumento();
    atualizarPlacar();
    atualizarBotoesPedido();
};

window.recusarPedido = function() {
    let etapa = ETAPAS[indiceEtapa + 1];
    pontosJoao += etapa.recusa;
    resultadoRodadaEl.textContent = `🏃 VOCÊ CORREU! JOÃO GANHA ${etapa.recusa}pts!`;
    encerraAumento();
    atualizarPlacar();
    atualizarBotoesPedido();
};

function encerraAumento() {
    aguardandoResposta = false;
    quemPediu = null;
    if (vitoriasRodadaJogador === 2 || vitoriasRodadaJoao === 2) {
        encerrarRodada();
        return;
    }
    if (rodadaEmAndamento) {
        vezDeJogar = quemJogaPrimeiro;
        podeJogar = true;
        if (vezDeJogar === 'joao') setTimeout(() => joaoJoga(), 1500);
    }
}
