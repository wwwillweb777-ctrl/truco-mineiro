// ===== TRUCO MINEIRO — JOÃO AGORA SABE BLEFAR! =====

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

// ===== VALORES OFICIAIS =====
const ETAPAS = [
    { nome: 'truco', valor: 4, recusa: 2 },
    { nome: 'seis', valor: 8, recusa: 4 },
    { nome: 'nove', valor: 12, recusa: 6 },
    { nome: 'doze', valor: 12, recusa: 9 }
];
const LIMITE_MAO_DE_10 = 10;
const PONTOS_PARTIDA = 12;

let valorAtualRodada = 2;
let indiceEtapa = -1;
let aguardandoResposta = false;
let quemPediu = null;

const valores = ['4', '5', '6', '7', 'Q', 'J', 'K', 'A', '2', '3'];
const naipes = ['♦', '♥', '♠', '♣'];
const forcaCarta = { '4': 1, '5': 2, '6': 3, '7': 4, 'Q': 5, 'J': 6, 'K': 7, 'A': 8, '2': 9, '3': 10 };

const CORES = { truco: '#ffc107', seis: '#ff6b00', nove: '#e53935', doze: '#8e24aa' };

const campoNome = document.getElementById('campo-nome');
const botaoMatricular = document.getElementById('botao-matricular');
const avisoMatricula = document.getElementById('aviso-matricula');
const telaMatricula = document.getElementById('tela-matricula');
const telaModo = document.getElementById('tela-modo');
const telaJogo = document.getElementById('tela-jogo');
const telaMaquina1x1 = document.getElementById('tela-maquina-1x1');
const meuIdMostrar = document.getElementById('meu-id');

const botaoModoPessoas = document.getElementById('modo-pessoas');
const botaoModoMaquina1x1 = document.getElementById('modo-maquina-1x1');
const botaoModoMaquinaDuplas = document.getElementById('modo-maquina-duplas');

let nomeJogadorEl, suasCartasEl, cartasJoaoEl, pontosJogadorEl, pontosJoaoEl;
let cartaJogadaJogadorEl, cartaJogadaJoaoEl, resultadoRodadaEl;
let botaoNovaRodada, botaoSair, areaPedidosEl;

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

botaoModoPessoas.addEventListener('click', () => {
    jogadorAtual.modoJogo = 'pessoas';
    telaModo.style.display = 'none';
    telaJogo.style.display = 'block';
    alert('🌐 Aguardando adversário...');
});

botaoModoMaquina1x1.addEventListener('click', () => {
    telaModo.style.display = 'none';
    telaMaquina1x1.style.display = 'block';
    inicializarElementos();
    configurarMesa();
    iniciarNovaPartida();
});

botaoModoMaquinaDuplas.addEventListener('click', () => alert('🤝 Em breve!'));

// ===== INICIALIZA =====
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
    botaoNovaRodada.addEventListener('click', tentarNovaRodada);
    botaoNovaRodada.style.opacity = '0.2';
    botaoNovaRodada.style.pointerEvents = 'none';
    botaoSair.addEventListener('click', sairDoJogo);
}

function configurarMesa() {
    const areaMesa = document.querySelector('.area-mesa');
    if (!areaMesa) return;
    areaMesa.addEventListener('dragover', e => e.preventDefault());
    areaMesa.addEventListener('drop', e => {
        e.preventDefault();
        if (indiceArrastado !== null && vezDeJogar === 'jogador' && podeJogar && !aguardandoResposta) {
            cartaSelecionada = indiceArrastado;
            efetuarJogada();
        }
    });
}

// ===== PARTIDA =====
function iniciarNovaPartida() {
    pontosJogador = pontosJoao = 0;
    quemJogaPrimeiro = 'jogador';
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

function tentarNovaRodada() {
    if (pontosJogador < PONTOS_PARTIDA && pontosJoao < PONTOS_PARTIDA) {
        alert('⚠️ Chegue a 12 pontos primeiro!');
        return;
    }
    iniciarNovaPartida();
}

// ===== ✅ NOVA RODADA =====
function iniciarNovaRodada() {
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

// ===== BOTÕES =====
function atualizarBotoesPedido() {
    if (!areaPedidosEl) return;
    let html = '';
    
    if (aguardandoResposta && quemPediu === 'joao') {
        let etapa = ETAPAS[indiceEtapa + 1];
        html = `
            <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
                <button onclick="aceitarPedido()" style="padding:10px 18px; background:#28a745; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">✅ ACEITAR (vale ${etapa.valor}pts)</button>
                <button onclick="recusarPedido()" style="padding:10px 18px; background:#dc3545; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">❌ CORRER (você ganha ${etapa.recusa}pts)</button>
            </div>
        `;
    } else if (!aguardandoResposta && vezDeJogar === 'jogador') {
        if (indiceEtapa === -1) {
            html = `<button onclick="pedirAumento('truco')" style="padding:10px 16px; background:${CORES.truco}; color:#000; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">🎯 PEDIR TRUCO (4pts)</button>`;
        } else if (indiceEtapa === 0) {
            html = `<button onclick="pedirAumento('seis')" style="padding:10px 16px; background:${CORES.seis}; color:#fff; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">🎯 PEDIR SEIS (8pts)</button>`;
        } else if (indiceEtapa === 1) {
            html = `<button onclick="pedirAumento('nove')" style="padding:10px 16px; background:${CORES.nove}; color:#fff; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">🎯 PEDIR NOVE (12pts)</button>`;
        }
    }
    areaPedidosEl.innerHTML = html;
}

// ===== VOCÊ PEDE TRUCO =====
window.pedirAumento = function(tipo) {
    if (aguardandoResposta) return;
    let indicePedido = ETAPAS.findIndex(e => e.nome === tipo);
    let etapa = ETAPAS[indicePedido];

    aguardandoResposta = true;
    quemPediu = 'jogador';
    resultadoRodadaEl.textContent = `🔴 VOCÊ PEDE ${tipo.toUpperCase()}! (${etapa.valor}pts) João decide...`;

    setTimeout(() => {
        let aceita = joaoDecideAceitar(tipo);
        if (aceita) {
            indiceEtapa = indicePedido;
            valorAtualRodada = etapa.valor;
            resultadoRodadaEl.textContent = `✅ JOÃO ACEITOU! Agora vale ${etapa.valor}pts!`;
            if (tipo === 'truco') setTimeout(() => joaoPedeSeis(), 1500);
            else if (tipo === 'seis') setTimeout(() => joaoPedeNove(), 1500);
        } else {
            pontosJogador += etapa.recusa;
            resultadoRodadaEl.textContent = `🏃 JOÃO CORREU! VOCÊ GANHA ${etapa.recusa}pts!`;
            encerraAumento();
        }
        atualizarPlacar();
        atualizarBotoesPedido();
    }, 1200);
};

// ===== ✅ JOÃO DECIDE: ACEITAR OU CORRER — AGORA COM BLEFE! =====
function joaoDecideAceitar(tipo) {
    let forcas = cartasJoao.map(c => c.forca);
    let melhorCarta = Math.max(...forcas);
    let piorCarta = Math.min(...forcas);
    let media = forcas.reduce((a,b) => a+b, 0) / 3;

    // 🎭 JOÃO SABE QUE VOCÊ TEM BOTÃO DE ACEITAR E CORRER!
    // Ele calcula: "será que ele vai aceitar ou vai correr?"

    let chance = 0.5;

    // Se tiver carta MUITO FORTE → ACEITA DE CORAÇÃO
    if (melhorCarta >= 9) chance = 0.95;
    // Se tiver carta BOA → aceita com confiança
    else if (melhorCarta >= 7) chance = 0.75;
    // 🎭 BLEFE: carta fraca MAS arrisca 20% das vezes pra te assustar!
    else if (melhorCarta >= 5) chance = 0.5;
    // 🔴 Muito fraco → quase sempre corre... mas às vezes BLEFA!
    else chance = 0.20; // ← ANTES ERA 0.15! Agora ele blefa mais!

    // Quanto mais alto o valor, mais ele fica com medo... mas às vezes te engana!
    if (tipo === 'seis') chance *= 0.80;
    if (tipo === 'nove') chance *= 0.65;
    if (tipo === 'doze') chance *= 0.50;

    // Se ele está perdendo → arrisca MAIS! Blefa mais ainda!
    if (pontosJoao < pontosJogador - 3) chance += 0.15;

    // 🎭 Se você está na frente → ele pensa: "ele pode correr!" → arrisca!
    if (pontosJogador > pontosJoao) chance += 0.08;

    return Math.random() < chance;
}

// ===== ✅ JOÃO JOGA A CARTA DELE — E SABE PEDIR TRUCO! =====
function joaoJoga() {
    if (vezDeJogar !== 'joao') return;

    let forcas = cartasJoao.map(c => c.forca);
    let melhorCarta = Math.max(...forcas);
    let piorCarta = Math.min(...forcas);

    // 🎭 BLEFE: antes de jogar, João decide se vai te assustar pedindo Truco!
    if (!aguardandoResposta && indiceEtapa === -1 && valorAtualRodada < 4) {
        let chanceDePedir = 0;

        // Se tiver carta boa → pede de verdade
        if (melhorCarta >= 8) chanceDePedir = 0.70;
        // 🎭 BLEFE: carta média MAS pede pra te assustar!
        else if (melhorCarta >= 5) chanceDePedir = 0.35; // ← BLEFA!
        // 🎭 BLEFE TOTAL: carta ruim MAS pede de qualquer jeito!
        else chanceDePedir = 0.15; // ← FINGE QUE TEM CARTA FORTE!

        // Se está perdendo → BLEFA MAIS AINDA!
        if (pontosJoao < pontosJogador - 2) chanceDePedir += 0.15;

        // Se decidir pedir → para de jogar e te desafia!
        if (Math.random() < chanceDePedir) {
            aguardandoResposta = true;
            quemPediu = 'joao';
            indiceEtapa = -1;
            resultadoRodadaEl.textContent = `🔴 JOÃO PEDE TRUCO! Ele sabe que você pode ACEITAR ou CORRER!`;
            atualizarBotoesPedido();
            return; // ← NÃO JOGA A CARTA AINDA! Ele te desafiou!
        }
    }

    // Escolhe a carta para jogar
    let indiceParaJogar = 0;
    // Se tem vantagem → joga a pior carta (economiza as fortes)
    if (melhorCarta >= 7 && vitoriasRodadaJoao > 0) {
        indiceParaJogar = forcas.indexOf(piorCarta);
    } else {
        // Se está perdendo → joga a melhor!
        indiceParaJogar = forcas.indexOf(melhorCarta);
    }

    cartaJogadaJoao = cartasJoao.splice(indiceParaJogar, 1)[0];
    mostrarNaMesa(cartaJogadaJoao, cartaJogadaJoaoEl);
    resultadoRodadaEl.textContent = `🃏 João jogou: ${cartaJogadaJoao.valor} de ${cartaJogadaJoao.naipe}`;

    setTimeout(() => verificarVencedor(), 1200);
}

// ===== JOÃO PEDE SEIS =====
function joaoPedeSeis() {
    let forcas = cartasJoao.map(c => c.forca);
    let melhorCarta = Math.max(...forcas);
    let chance = melhorCarta >= 8 ? 0.65 : melhorCarta >= 5 ? 0.30 : 0.10;
    if (Math.random() > chance) { vezDeJogar = 'jogador'; return; }

    indiceEtapa = 1;
    valorAtualRodada = ETAPAS[1].valor;
    aguardandoResposta = true;
    quemPediu = 'joao';
    resultadoRodadaEl.textContent = `🔴 JOÃO PEDE SEIS! Agora vale 8pts! Você ACEITA ou CORRE?`;
    atualizarBotoesPedido();
}

// ===== JOÃO PEDE NOVE =====
function joaoPedeNove() {
    let forcas = cartasJoao.map(c => c.forca);
    let melhorCarta = Math.max(...forcas);
    let chance = melhorCarta >= 9 ? 0.55 : melhorCarta >= 6 ? 0.25 : 0.05;
    if (Math.random() > chance) { vezDeJogar = 'jogador'; return; }

    indiceEtapa = 2;
    valorAtualRodada = ETAPAS[2].valor;
    aguardandoResposta = true;
    quemPediu = 'joao';
    resultadoRodadaEl.textContent = `🔴 JOÃO PEDE NOVE! Agora vale 12pts! Você ACEITA ou CORRE?`;
    atualizarBotoesPedido();
}

// ===== VOCÊ ACEITA =====
window.aceitarPedido = function() {
    let etapa = ETAPAS[indiceEtapa + 1];
    indiceEtapa = indiceEtapa + 1;
    valorAtualRodada = etapa.valor;
    resultadoRodadaEl.textContent = `✅ VOCÊ ACEITOU! Agora vale ${etapa.valor}pts!`;
    encerraAumento();
    atualizarPlacar();
    atualizarBotoesPedido();
    if (etapa.nome === 'seis') { indiceEtapa = 1; setTimeout(() => { atualizarBotoesPedido(); }, 500); }
    if (etapa.nome === 'truco') { setTimeout(() => joaoPedeSeis(), 1500); }
    if (etapa.nome === 'seis') { setTimeout(() => joaoPedeNove(), 1500); }
};

// ===== VOCÊ CORRE =====
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
    if (!aguardandoResposta && rodadaEmAndamento) {
        vezDeJogar = quemJogaPrimeiro;
        podeJogar = true;
        if (vezDeJogar === 'joao') {
            podeJogar = false;
            setTimeout(() => joaoJoga(), 1500);
        }
    }
}

// ===== EXIBIR SUAS CARTAS =====
function exibirCartas() {
    suasCartasEl.innerHTML = '';
    cartasJogador.forEach((carta, i) => {
        if (!carta) return;
        const div = document.createElement('div');
        div.className = 'carta';
        div.draggable = (vezDeJogar === 'jogador' && podeJogar && !aguardandoResposta);
        div.innerHTML = `<span>${carta.valor}</span><span class="naipe">${carta.naipe}</span>`;
        div.addEventListener('dragstart', e => {
            if (vezDeJogar !== 'jogador' || !podeJogar || aguardandoResposta) return;
            indiceArrastado = i;
            cartaSelecionada = i;
            marcarCartaSelecionada(i);
            e.dataTransfer.effectAllowed = 'move';
        });
        div.addEventListener('click', () => {
            if (vezDeJogar !== 'jogador' || !podeJogar || aguardandoResposta) return;
            cartaSelecionada = i;
            marcarCartaSelecionada(i);
            setTimeout(() => efetuarJogada(), 150);
        });
        suasCartasEl.appendChild(div);
    });
}

function marcarCartaSelecionada(indice) {
    document.querySelectorAll('#suas-cartas .carta').forEach((el, i) => {
        el.classList.toggle('selecionada', i === indice);
        el.style.transform = i === indice ? 'translateY(-10px)' : '';
        el.style.boxShadow = i === indice ? '0 0 15px #ffd700' : '';
    });
}

// ===== EXIBIR CARTAS DO JOÃO =====
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

// ===== VOCÊ JOGA =====
function efetuarJogada() {
    if (cartaSelecionada === null || !cartasJogador[cartaSelecionada]) return;
    if (vezDeJogar !== 'jogador' || !podeJogar || aguardandoResposta) return;

    podeJogar = false;
    cartaJogadaJogador = cartasJogador.splice(cartaSelecionada, 1)[0];
    mostrarNaMesa(cartaJogadaJogador, cartaJogadaJogadorEl);
    resultadoRodadaEl.textContent = `🃏 Você jogou: ${cartaJogadaJogador.valor} de ${cartaJogadaJogador.naipe}`;
    cartaSelecionada = indiceArrastado = null;
    exibirCartas();
    atualizarBotoesPedido();

    setTimeout(() => joaoJoga(), 1500);
}

// ===== COMPARA E DECIDE =====
function verificarVencedor() {
    let vencedor = null;

    if (cartaJogadaJogador.forca > cartaJogadaJoao.forca) {
        vitoriasRodadaJogador++;
        resultadoRodadaEl.textContent = `✅ VOCÊ VENCEU A JOGADA! (${vitoriasRodadaJogador} x ${vitoriasRodadaJoao})`;
        vencedor = 'jogador';
    } else if (cartaJogadaJogador.forca < cartaJogadaJoao.forca) {
        vitoriasRodadaJoao++;
        resultadoRodadaEl.textContent = `❌ JOÃO VENCEU A JOGADA! (${vitoriasRodadaJogador} x ${vitoriasRodadaJoao})`;
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
        podeJogar = true;
        exibirCartas();
        exibirCartasJoao();
        atualizarBotoesPedido();

        if (vencedor === 'joao') {
            podeJogar = false;
            setTimeout(() => joaoJoga(), 2000);
        }
    }, 1800);
}

// ===== ENCERRAR RODADA =====
function encerrarRodada() {
    rodadaEmAndamento = false;
    aguardandoResposta = false;
    quemPediu = null;

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
        verificarFimDePartida();
    } else {
        setTimeout(() => {
            resultadoRodadaEl.textContent = '🃏 Preparando nova rodada...';
            iniciarNovaRodada();
        }, 2500);
    }
}

function verificarFimDePartida() {
    if (pontosJogador >= PONTOS_PARTIDA) {
        setTimeout(() => {
            alert(`🎉 PARABÉNS! VOCÊ VENCEU A PARTIDA!\nPlacar: ${pontosJogador} x ${pontosJoao}`);
            botaoNovaRodada.style.opacity = '1';
            botaoNovaRodada.style.pointerEvents = 'auto';
        }, 600);
    } else if (pontosJoao >= PONTOS_PARTIDA) {
        setTimeout(() => {
            alert(`😔 JOÃO VENCEU A PARTIDA!\nPlacar: ${pontosJogador} x ${pontosJoao}`);
            botaoNovaRodada.style.opacity = '1';
            botaoNovaRodada.style.pointerEvents = 'auto';
        }, 600);
    }
}

function mostrarNaMesa(carta, el) {
    el.innerHTML = `<span style="font-size:1.3rem; font-weight:bold;">${carta.valor}</span><span style="font-size:1.5rem;">${carta.naipe}</span>`;
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
