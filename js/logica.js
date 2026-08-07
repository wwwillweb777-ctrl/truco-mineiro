// ===== TRUCO MINEIRO — REGRAS COMPLETAS =====

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
let vitoriasRodadaJogador = 0;
let vitoriasRodadaJoao = 0;
let indiceArrastado = null;
let rodadaEmAndamento = false;

// ===== VALORES OFICIAIS DO TRUCO MINEIRO =====
const VALORES_PEDIDO = {
    normal: 2,
    truco: 4,
    seis: 6,
    nove: 9,
    doze: 12
};

const VALOR_SE_RECUSA = {
    truco: 2,
    seis: 4,
    nove: 6,
    doze: 9
};

const LIMITE_MAO_DE_10 = 10;
const PONTOS_PARTIDA = 12;

let valorAtualRodada = VALORES_PEDIDO.normal;
let proximoPedidoDisponivel = 'truco';
let pedidoEmAndamento = false;

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
    areaPedidosEl = document.getElementById('area-pedidos');
    botaoNovaRodada = document.getElementById('botao-nova-rodada');
    botaoSair = document.getElementById('botao-sair');

    nomeJogadorEl.textContent = jogadorAtual.nome;
    botaoNovaRodada.addEventListener('click', tentarNovaRodada);
    botaoSair.addEventListener('click', sairDoJogo);
}

// ===== ÁREA DA MESA =====
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

// ===== INÍCIO DA PARTIDA =====
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

// ===== NOVA RODADA — SÓ FUNCIONA QUANDO A ANTERIOR TERMINA =====
function tentarNovaRodada() {
    if (rodadaEmAndamento) {
        alert('⚠️ Termine a rodada primeiro!');
        return;
    }
    iniciarNovaRodada();
}

function iniciarNovaRodada() {
    criarBaralho();
    cartasJogador = baralho.splice(0, 3);
    cartasJoao = baralho.splice(0, 3);
    cartaSelecionada = indiceArrastado = null;
    rodadaAtual = 0;
    vitoriasRodadaJogador = 0;
    vitoriasRodadaJoao = 0;
    cartaJogadaJogador = cartaJogadaJoao = null;
    rodadaEmAndamento = true;
    valorAtualRodada = VALORES_PEDIDO.normal;
    proximoPedidoDisponivel = 'truco';
    pedidoEmAndamento = false;

    // BOTÃO BLOQUEADO ENQUANTO JOGA
    botaoNovaRodada.style.opacity = '0.4';
    botaoNovaRodada.style.pointerEvents = 'none';

    let situacao = verificarMaoDeDez();
    resultadoRodadaEl.textContent = situacao + ` — Rodada vale ${valorAtualRodada} pontos`;

    cartaJogadaJogadorEl.innerHTML = '';
    cartaJogadaJoaoEl.innerHTML = '';
    
    exibirCartas();
    exibirCartasJoao();
    atualizarBotoesPedido();
}

// ===== MÃO DE 10 E MÃO DE FERRO =====
function verificarMaoDeDez() {
    let voceTemDez = (pontosJogador === LIMITE_MAO_DE_10);
    let joaoTemDez = (pontosJoao === LIMITE_MAO_DE_10);

    if (voceTemDez && joaoTemDez) {
        return '✋✋ MÃO DE FERRO! NINGUÉM VÊ AS CARTAS ANTES!';
    } else if (voceTemDez) {
        return `✋ MÃO DE 10! ${jogadorAtual.nome} vê primeiro — NÃO TROCA CARTAS!`;
    } else if (joaoTemDez) {
        return '✋ MÃO DE 10! João vê primeiro — NÃO TROCA CARTAS!';
    }
    return '🎯 Rodada normal — vale 2 pontos';
}

// ===== SISTEMA DE PEDIDOS: TRUCO → SEIS → NOVE → DOZE =====
function atualizarBotoesPedido() {
    if (!areaPedidosEl) return;
    
    let html = '';
    if (proximoPedidoDisponivel && !pedidoEmAndamento) {
        let nome = proximoPedidoDisponivel.toUpperCase();
        let val = VALORES_PEDIDO[proximoPedidoDisponivel];
        html = `<button onclick="pedirAumento('${proximoPedidoDisponivel}')" style="padding:8px 16px; background:#ffc107; color:#000; border:none; border-radius:8px; font-weight:bold; margin:5px;">🎯 PEDIR ${nome} (${val}pts)</button>`;
    }
    areaPedidosEl.innerHTML = html;
}

window.pedirAumento = function(tipo) {
    if (pedidoEmAndamento) return;
    pedidoEmAndamento = true;
    
    let valorPedir = VALORES_PEDIDO[tipo];
    let valorRecusa = VALOR_SE_RECUSA[tipo];
    let nome = tipo.toUpperCase();
    
    let aceita = confirm(`🎯 PEDIR ${nome}! A rodada passa a valer ${valorPedir} pontos.\n\nO João aceita?\n\n✅ Sim = Aceita\n❌ Não = Recusa → Você ganha ${valorRecusa} pontos`);
    
    if (aceita) {
        valorAtualRodada = valorPedir;
        resultadoRodadaEl.textContent = `✅ ACEITOU! Rodada agora vale ${valorAtualRodada} pontos!`;
        
        // LIBERA PRÓXIMO PEDIDO
        if (tipo === 'truco') proximoPedidoDisponivel = 'seis';
        else if (tipo === 'seis') proximoPedidoDisponivel = 'nove';
        else if (tipo === 'nove') proximoPedidoDisponivel = 'doze';
        else if (tipo === 'doze') proximoPedidoDisponivel = null;
    } else {
        // RECUSOU — QUEM PEDIU GANHA
        pontosJogador += valorRecusa;
        resultadoRodadaEl.textContent = `❌ RECUSOU! Você ganha ${valorRecusa} pontos!`;
        rodadaEmAndamento = false;
        proximoPedidoDisponivel = null;
        verificarFimDePartida();
    }
    
    pedidoEmAndamento = false;
    atualizarPlacar();
    atualizarBotoesPedido();
};

// ===== MOSTRA CARTAS =====
function exibirCartas() {
    suasCartasEl.innerHTML = '';
    cartasJogador.forEach((carta, i) => {
        if (!carta) return;
        const div = document.createElement('div');
        div.className = 'carta';
        div.dataset.indice = i;
        div.draggable = true;
        div.innerHTML = `<span>${carta.valor}</span><span class="naipe">${carta.naipe}</span>`;

        div.addEventListener('dragstart', e => {
            indiceArrastado = i;
            cartaSelecionada = i;
            document.querySelectorAll('#suas-cartas .carta').forEach(c => c.classList.remove('selecionada'));
            div.classList.add('selecionada');
            e.dataTransfer.effectAllowed = 'move';
        });

        div.addEventListener('click', () => {
            cartaSelecionada = i;
            document.querySelectorAll('#suas-cartas .carta').forEach(c => c.classList.remove('selecionada'));
            div.classList.add('selecionada');
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

// ===== JOGA A CARTA =====
function efetuarJogada() {
    if (cartaSelecionada === null || !cartasJogador[cartaSelecionada]) return;

    rodadaAtual++;
    cartaJogadaJogador = cartasJogador.splice(cartaSelecionada, 1)[0];

    // JOÃO JOGA A MELHOR CARTA DELE
    let melhor = 0;
    cartasJoao.forEach((c, i) => {
        if (c.forca > cartasJoao[melhor].forca) melhor = i;
    });
    cartaJogadaJoao = cartasJoao.splice(melhor, 1)[0];

    // MOSTRA NA MESA
    if (rodadaAtual === 1) {
        mostrarNaMesa(cartaJogadaJoao, cartaJogadaJoaoEl);
        mostrarNaMesa(cartaJogadaJogador, cartaJogadaJogadorEl);
    } else {
        cartaJogadaJoaoEl.innerHTML = '';
        cartaJogadaJogadorEl.innerHTML = '';
        mostrarNaMesa(cartaJogadaJoao, cartaJogadaJoaoEl);
        mostrarNaMesa(cartaJogadaJogador, cartaJogadaJogadorEl);
    }

    // VERIFICA QUEM VENCEU A JOGADA
    if (cartaJogadaJogador.forca > cartaJogadaJoao.forca) {
        vitoriasRodadaJogador++;
        resultadoRodadaEl.textContent = `✅ VOCÊ VENCEU A JOGADA! (${vitoriasRodadaJogador}x${vitoriasRodadaJoao}) — vale ${valorAtualRodada}pts`;
    } else if (cartaJogadaJogador.forca < cartaJogadaJoao.forca) {
        vitoriasRodadaJoao++;
        resultadoRodadaEl.textContent = `❌ JOÃO VENCEU A JOGADA! (${vitoriasRodadaJogador}x${vitoriasRodadaJoao}) — vale ${valorAtualRodada}pts`;
    } else {
        resultadoRodadaEl.textContent = '🤝 EMPATE NA JOGADA!';
    }

    // VERIFICA SE A RODADA ACABOU
    if (rodadaAtual === 3 || vitoriasRodadaJogador === 2 || vitoriasRodadaJoao === 2) {
        encerrarRodada();
    } else {
        exibirCartas();
        exibirCartasJoao();
    }
    cartaSelecionada = indiceArrastado = null;
}

// ===== ENCERRA RODADA — SOMA PONTOS E LIBERA BOTÃO =====
function encerrarRodada() {
    rodadaEmAndamento = false;
    proximoPedidoDisponivel = null;

    if (vitoriasRodadaJogador > vitoriasRodadaJoao) {
        resultadoRodadaEl.textContent = `🏆 VOCÊ VENCEU A RODADA! +${valorAtualRodada} PONTOS`;
        pontosJogador += valorAtualRodada;
    } else if (vitoriasRodadaJoao > vitoriasRodadaJogador) {
        resultadoRodadaEl.textContent = `😔 JOÃO VENCEU A RODADA! +${valorAtualRodada} PONTOS`;
        pontosJoao += valorAtualRodada;
    } else {
        resultadoRodadaEl.textContent = '🤝 EMPATE! Ninguém pontuou.';
    }

    // LIBERA BOTÃO DE NOVA RODADA
    botaoNovaRodada.style.opacity = '1';
    botaoNovaRodada.style.pointerEvents = 'auto';

    atualizarPlacar();
    atualizarBotoesPedido();
    verificarFimDePartida();
}

// ===== FIM DE PARTIDA — CHEGOU A 12 PONTOS =====
function verificarFimDePartida() {
    if (pontosJogador >= PONTOS_PARTIDA) {
        setTimeout(() => {
            alert(`🎉 PARABÉNS! VOCÊ VENCEU A PARTIDA!\nPlacar: Você ${pontosJogador} x ${pontosJoao} João`);
            iniciarNovaPartida();
        }, 600);
    } else if (pontosJoao >= PONTOS_PARTIDA) {
        setTimeout(() => {
            alert(`😔 JOÃO VENCEU A PARTIDA!\nPlacar: Você ${pontosJogador} x ${pontosJoao} João`);
            iniciarNovaPartida();
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

// BOTÕES DE FORMATO (FUTURO)
const botao2 = document.getElementById('botao-2jogadores');
const botao4 = document.getElementById('botao-4jogadores');
botao2?.addEventListener('click', () => alert('🎯 Aguardando adversário...'));
botao4?.addEventListener('click', () => alert('🎯 Escolha seu parceiro!'));
