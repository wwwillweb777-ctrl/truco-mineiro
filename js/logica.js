// ===== TRUCO MINEIRO — CORRIGIDO: RESPEITA A VEZ DE JOGAR! =====

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
let rodadaAtual = 0;
let vitoriasRodadaJogador = 0;
let vitoriasRodadaJoao = 0;
let indiceArrastado = null;
let rodadaEmAndamento = false;
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
        if (indiceArrastado !== null && vezDeJogar === 'jogador' && podeJogar) {
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

// ===== NOVA RODADA =====
function iniciarNovaRodada() {
    criarBaralho();
    cartasJogador = baralho.splice(0, 3);
    cartasJoao = baralho.splice(0, 3);
    cartaSelecionada = indiceArrastado = null;
    rodadaAtual = 0;
    vitoriasRodadaJogador = vitoriasRodadaJoao = 0;
    cartaJogadaJogador = cartaJogadaJoao = null;
    rodadaEmAndamento = true;
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

    // ✅ SÓ JOÃO JOGA PRIMEIRO SE FOR A VEZ DELE!
    if (vezDeJogar === 'joao') {
        podeJogar = false;
        setTimeout(() => { joaoJoga(); }, 1500);
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
        } else if (indiceEtapa === 1) {
            html = `<button onclick="pedirAumento('nove')" style="padding:10px 16px; background:${CORES.nove}; color:#fff; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">🎯 PEDIR NOVE (12pts)</button>`;
        }
    }
    areaPedidosEl.innerHTML = html;
}

// ===== VOCÊ PEDE =====
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
            else if (tipo === 'nove') setTimeout(() => joaoPedeDoze(), 1500);
        } else {
            pontosJogador += etapa.recusa;
            resultadoRodadaEl.textContent = `❌ JOÃO RECUSOU! VOCÊ GANHA ${etapa.recusa}pts!`;
            encerraAumento();
        }
        atualizarPlacar();
        atualizarBotoesPedido();
    }, 1200);
};

// ===== JOÃO DECIDE =====
function joaoDecideAceitar(tipo) {
    let melhorCarta = Math.max(...cartasJoao.map(c => c.forca));
    let chance = 0.5;
    if (melhorCarta >= 9) chance = 0.95;
    else if (melhorCarta >= 7) chance = 0.75;
    else if (melhorCarta >= 5) chance = 0.5;
    else chance = 0.15;
    if (tipo === 'seis') chance *= 0.75;
    if (tipo === 'nove') chance *= 0.55;
    if (tipo === 'doze') chance *= 0.35;
    if (pontosJoao < pontosJogador - 3) chance += 0.15;
    return Math.random() < chance;
}

// ===== JOÃO PEDE SEIS =====
function joaoPedeSeis() {
    let melhorCarta = Math.max(...cartasJoao.map(c => c.forca));
    let chance = melhorCarta >= 8 ? 0.6 : melhorCarta >= 6 ? 0.25 : 0.02;
    if (Math.random() > chance) { vezDeJogar = 'jogador'; return; }

    indiceEtapa = 1;
    valorAtualRodada = ETAPAS[1].valor;
    aguardandoResposta = true;
    quemPediu = 'joao';
    resultadoRodadaEl.textContent = `🔴 JOÃO PEDE SEIS! Agora vale 8pts! Você aceita ou corre?`;
    atualizarBotoesPedido();
}

// ===== JOÃO PEDE DOZE =====
function joaoPedeDoze() {
    let melhorCarta = Math.max(...cartasJoao.map(c => c.forca));
    let chance = melhorCarta >= 9 ? 0.5 : melhorCarta >= 7 ? 0.2 : 0.01;
    if (Math.random() > chance) { vezDeJogar = 'jogador'; return; }

    indiceEtapa = 3;
    valorAtualRodada = ETAPAS[3].valor;
    aguardandoResposta = true;
    quemPediu = 'joao';
    resultadoRodadaEl.textContent = `🔴 JOÃO PEDE DOZE! Agora vale 12pts! Você aceita ou corre?`;
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
};

// ===== VOCÊ CORRE =====
window.recusarPedido = function() {
    let etapa = ETAPAS[indiceEtapa + 1];
    pontosJoao += etapa.recusa;
    resultadoRodadaEl.textContent = `❌ VOCÊ CORREU! JOÃO GANHA ${etapa.recusa}pts!`;
    encerraAumento();
    atualizarPlacar();
    atualizarBotoesPedido();
};

function encerraAumento() {
    aguardandoResposta = false;
    quemPediu = null;
    if (rodadaEmAndamento) vezDeJogar = quemJogaPrimeiro;
    podeJogar = true;
    verificarFimDePartida();
}

// ===== EXIBIR CARTAS =====
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

// ===== ✅ VOCÊ JOGA CARTA =====
function efetuarJogada() {
    if (cartaSelecionada === null || !cartasJogador[cartaSelecionada]) return;
    if (vezDeJogar !== 'jogador' || !podeJogar || aguardandoResposta) return;

    podeJogar = false; // ✅ BLOQUEIA VOCÊ DE JOGAR DE NOVO!
    rodadaAtual++;
    cartaJogadaJogador = cartasJogador.splice(cartaSelecionada, 1)[0];
    mostrarNaMesa(cartaJogadaJogador, cartaJogadaJogadorEl);
    resultadoRodadaEl.textContent = `🃏 Você jogou: ${cartaJogadaJogador.valor} de ${cartaJogadaJogador.naipe}`;
    cartaSelecionada = indiceArrastado = null;
    exibirCartas();
    atualizarBotoesPedido();

    // ✅ AGORA É A VEZ DO JOÃO!
    setTimeout(() => joaoJoga(), 1500);
}

// ===== ✅ JOÃO JOGA CARTA =====
function joaoJoga() {
    if (vezDeJogar !== 'joao') return; // ✅ SÓ JOGA SE FOR A VEZ DELE!

    let melhorIndice = 0, melhorForca = -1;
    cartasJoao.forEach((carta, i) => {
        if (carta.forca > melhorForca) { melhorForca = carta.forca; melhorIndice = i; }
    });
    cartaJogadaJoao = cartasJoao.splice(melhorIndice, 1)[0];
    mostrarNaMesa(cartaJogadaJoao, cartaJogadaJoaoEl);
    resultadoRodadaEl.textContent = `🃏 João jogou: ${cartaJogadaJoao.valor} de ${cartaJogadaJoao.naipe}`;

    // ✅ COMPARA AS CARTAS
    setTimeout(() => verificarVencedorDaJogada(), 1200);
}

// ===== ✅ COMPARA AS DUAS CARTAS E DIZ QUEM GANHOU =====
function verificarVencedorDaJogada() {
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

    // ✅ LIMPA A MESA E PREPARA PRÓXIMA JOGADA
    setTimeout(() => {
        cartaJogadaJogadorEl.innerHTML = '';
        cartaJogadaJoaoEl.innerHTML = '';

        // ✅ VERIFICA SE ALGUÉM JÁ FEZ 2 → ACABOU A RODADA!
        if (vitoriasRodadaJogador === 2 || vitoriasRodadaJoao === 2) {
            encerrarRodada();
            return;
        }

        // ✅ NÃO ACABOU → QUEM GANHOU JOGA PRIMEIRO
        vezDeJogar = vencedor;
        podeJogar = true;
        exibirCartas();
        exibirCartasJoao();
        atualizarBotoesPedido();

        // ✅ SE JOÃO GANHOU → ELE JOGA NOVAMENTE
        if (vencedor === 'joao') {
            podeJogar = false;
            setTimeout(() => joaoJoga(), 2000);
        }
    }, 1800);
}

// ===== ✅ ACABOU A RODADA → SOMA PONTOS E COMEÇA DE NOVO =====
function encerrarRodada() {
    rodadaEmAndamento = false;
    aguardandoResposta = false;
    quemPediu = null;
    valorAtualRodada = 2;
    indiceEtapa = -1;

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

    // ✅ VERIFICA SE ALGUÉM CHEGOU A 12 PONTOS
    if (pontosJogador >= PONTOS_PARTIDA || pontosJoao >= PONTOS_PARTIDA) {
        verificarFimDePartida();
    } else {
        // ✅ NOVA RODADA COM CARTAS NOVAS!
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
