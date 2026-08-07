// ===== TRUCO MINEIRO — MESA LIMPA + QUEM VENCE JOGA PRIMEIRO + JOÃO PEDE TRUCO =====

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
let quemJogaPrimeiro = 'jogador';
let vezDeJogar = 'jogador'; // ✅ CONTROLA DE QUEM É A VEZ

// ===== VALORES OFICIAIS =====
const VALORES_PEDIDO = { normal: 2, truco: 4, seis: 6, nove: 9, doze: 12 };
const VALOR_SE_RECUSA = { truco: 2, seis: 4, nove: 6, doze: 9 };
const LIMITE_MAO_DE_10 = 10;
const PONTOS_PARTIDA = 12;

let valorAtualRodada = VALORES_PEDIDO.normal;
let proximoPedidoDisponivel = 'truco';
let pedidoEmAndamento = false;
let ultimoAumento = null;

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

function configurarMesa() {
    const areaMesa = document.querySelector('.area-mesa');
    if (!areaMesa) return;
    areaMesa.addEventListener('dragover', e => e.preventDefault());
    areaMesa.addEventListener('drop', function(e) {
        e.preventDefault();
        if (indiceArrastado !== null && vezDeJogar === 'jogador') {
            cartaSelecionada = indiceArrastado;
            efetuarJogada();
        }
    });
}

// ===== INÍCIO DA PARTIDA =====
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

// ===== BOTÃO SÓ FUNCIONA QUANDO ALGUÉM CHEGA A 12 PONTOS =====
function tentarNovaRodada() {
    if (pontosJogador < PONTOS_PARTIDA && pontosJoao < PONTOS_PARTIDA) {
        alert('⚠️ A partida ainda não terminou! Chegue a 12 pontos primeiro!');
        return;
    }
    iniciarNovaPartida();
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
    ultimoAumento = null;
    vezDeJogar = quemJogaPrimeiro; // ✅ QUEM VENCEU JOGA PRIMEIRO!

    // ✅ LIMPA A MESA COMPLETAMENTE!
    cartaJogadaJogadorEl.innerHTML = '';
    cartaJogadaJoaoEl.innerHTML = '';

    // ✅ BOTÃO FICA BLOQUEADO DURANTE TODA A PARTIDA
    botaoNovaRodada.style.opacity = '0.2';
    botaoNovaRodada.style.pointerEvents = 'none';

    let situacao = verificarMaoDeDez();
    let quemComeca = quemJogaPrimeiro === 'jogador' 
        ? '👉 VOCÊ JOGA PRIMEIRO!' 
        : '👉 JOÃO JOGA PRIMEIRO!';
    resultadoRodadaEl.textContent = `${situacao} — ${quemComeca} — vale ${valorAtualRodada} pontos`;

    exibirCartas();
    exibirCartasJoao();
    atualizarBotoesPedido();

    // ✅ SE JOÃO JOGA PRIMEIRO → ELE JOGA AUTOMATICAMENTE!
    if (vezDeJogar === 'joao') {
        setTimeout(() => joaoJoga(), 1200);
    }
}

// ===== MÃO DE 10 E MÃO DE FERRO =====
function verificarMaoDeDez() {
    let voceTemDez = (pontosJogador === LIMITE_MAO_DE_10);
    let joaoTemDez = (pontosJoao === LIMITE_MAO_DE_10);

    if (voceTemDez && joaoTemDez) return '✋✋ MÃO DE FERRO!';
    else if (voceTemDez) return `✋ MÃO DE 10! ${jogadorAtual.nome} vê primeiro!`;
    else if (joaoTemDez) return '✋ MÃO DE 10! João vê primeiro!';
    return '🎯 Rodada normal';
}

// ===== BOTÃO DE PEDIDO — FICA PERTO DAS CARTAS! =====
function atualizarBotoesPedido() {
    if (!areaPedidosEl) return;
    let html = '';
    
    // ✅ SE É SUA VEZ E PODE PEDIR → MOSTRA BOTÃO
    if (proximoPedidoDisponivel && !pedidoEmAndamento && vezDeJogar === 'jogador') {
        let nome = proximoPedidoDisponivel.toUpperCase();
        let val = VALORES_PEDIDO[proximoPedidoDisponivel];
        html = `<button onclick="pedirAumento('${proximoPedidoDisponivel}')" style="padding:10px 20px; background:#ffc107; color:#000; border:none; border-radius:8px; font-weight:bold; font-size:1rem; margin:5px 0;">🎯 PEDIR ${nome} (${val}pts)</button>`;
    }
    areaPedidosEl.innerHTML = html;
}

// ===== VOCÊ PEDE AUMENTO =====
window.pedirAumento = function(tipo) {
    if (pedidoEmAndamento) return;
    pedidoEmAndamento = true;
    ultimoAumento = tipo;

    let valorPedir = VALORES_PEDIDO[tipo];
    let valorRecusa = VALOR_SE_RECUSA[tipo];
    let nome = tipo.toUpperCase();
    
    // ✅ JOÃO DECIDE SE ACEITA OU NÃO (INTELIGENTE!)
    let aceita = joaoDecideAceitar(tipo);
    
    if (aceita) {
        valorAtualRodada = valorPedir;
        resultadoRodadaEl.textContent = `✅ JOÃO ACEITOU! Rodada vale ${valorAtualRodada}pts!`;
        avancarPedido();
    } else {
        pontosJogador += valorRecusa;
        resultadoRodadaEl.textContent = `❌ JOÃO RECUSOU! VOCÊ GANHA ${valorRecusa}pts!`;
        rodadaEmAndamento = false;
        proximoPedidoDisponivel = null;
        quemJogaPrimeiro = 'jogador';
        verificarFimDePartida();
    }
    pedidoEmAndamento = false;
    atualizarPlacar();
    atualizarBotoesPedido();
};

// ===== JOÃO PEDE AUMENTO SOZINHO =====
function joaoPedeAumento() {
    if (!proximoPedidoDisponivel || pedidoEmAndamento) return;
    
    // ✅ JOÃO É INTELIGENTE: PEDE DE ACORDO COM AS CARTAS!
    let devePedir = Math.random() < 0.4; // 40% de chance de pedir
    
    if (devePedir) {
        pedidoEmAndamento = true;
        ultimoAumento = proximoPedidoDisponivel;
        let nome = proximoPedidoDisponivel.toUpperCase();
        let val = VALORES_PEDIDO[proximoPedidoDisponivel];
        
        resultadoRodadaEl.textContent = `🔴 JOÃO PEDE ${nome}! (${val}pts) Aceita?`;
        
        setTimeout(() => {
            let aceita = confirm(`🔴 JOÃO PEDE ${nome}! A rodada passa a valer ${val} pontos!\n\n✅ Sim = Aceita\n❌ Não = Recusa → João ganha ${VALOR_SE_RECUSA[proximoPedidoDisponivel]}pts`);
            
            if (aceita) {
                valorAtualRodada = val;
                resultadoRodadaEl.textContent = `✅ VOCÊ ACEITOU! Vale ${val}pts!`;
                avancarPedido();
            } else {
                pontosJoao += VALOR_SE_RECUSA[proximoPedidoDisponivel];
                resultadoRodadaEl.textContent = `❌ VOCÊ RECUSOU! JOÃO GANHA ${VALOR_SE_RECUSA[proximoPedidoDisponivel]}pts!`;
                rodadaEmAndamento = false;
                proximoPedidoDisponivel = null;
                quemJogaPrimeiro = 'joao';
                verificarFimDePartida();
            }
            pedidoEmAndamento = false;
            atualizarPlacar();
            atualizarBotoesPedido();
        }, 800);
    }
}

// ===== AVANÇA OS NÍVEIS DE PEDIDO =====
function avancarPedido() {
    if (ultimoAumento === 'truco') proximoPedidoDisponivel = 'seis';
    else if (ultimoAumento === 'seis') proximoPedidoDisponivel = 'nove';
    else if (ultimoAumento === 'nove') proximoPedidoDisponivel = 'doze';
    else proximoPedidoDisponivel = null;
}

// ===== DECISÃO INTELIGENTE DO JOÃO =====
function joaoDecideAceitar(tipo) {
    let melhorCartaJoao = Math.max(...cartasJoao.map(c => c.forca));
    let chanceAceitar = 0.5;

    if (melhorCartaJoao >= 8) chanceAceitar = 0.9; // Carta forte → aceita
    else if (melhorCartaJoao >= 5) chanceAceitar = 0.6; // Carta média → aceita às vezes
    else chanceAceitar = 0.2; // Carta fraca → recusa

    if (tipo === 'doze') chanceAceitar *= 0.7; // Mais difícil aceitar 12

    return Math.random() < chanceAceitar;
}

// ===== ✅ CLICA NA CARTA → ELA SOBE! =====
function exibirCartas() {
    suasCartasEl.innerHTML = '';
    cartasJogador.forEach((carta, i) => {
        if (!carta) return;
        const div = document.createElement('div');
        div.className = 'carta';
        div.dataset.indice = i;
        div.draggable = (vezDeJogar === 'jogador');
        div.innerHTML = `<span>${carta.valor}</span><span class="naipe">${carta.naipe}</span>`;

        div.addEventListener('dragstart', e => {
            if (vezDeJogar !== 'jogador') return;
            indiceArrastado = i;
            cartaSelecionada = i;
            marcarCartaSelecionada(i);
            e.dataTransfer.effectAllowed = 'move';
        });

        div.addEventListener('click', () => {
            if (vezDeJogar !== 'jogador') return;
            cartaSelecionada = i;
            marcarCartaSelecionada(i);
            setTimeout(() => efetuarJogada(), 150);
        });

        suasCartasEl.appendChild(div);
    });
}

function marcarCartaSelecionada(indice) {
    document.querySelectorAll('#suas-cartas .carta').forEach((el, idx) => {
        if (idx === indice) {
            el.classList.add('selecionada');
            el.style.transform = 'translateY(-10px)';
            el.style.boxShadow = '0 0 15px #ffd700';
        } else {
            el.classList.remove('selecionada');
            el.style.transform = '';
            el.style.boxShadow = '';
        }
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

// ===== VOCÊ JOGA A CARTA =====
function efetuarJogada() {
    if (cartaSelecionada === null || !cartasJogador[cartaSelecionada]) return;
    if (vezDeJogar !== 'jogador') return;

    rodadaAtual++;
    cartaJogadaJogador = cartasJogador.splice(cartaSelecionada, 1)[0];

    // MOSTRA SUA CARTA NA MESA
    mostrarNaMesa(cartaJogadaJogador, cartaJogadaJogadorEl);
    resultadoRodadaEl.textContent = `🃏 Você jogou: ${cartaJogadaJogador.valor} de ${cartaJogadaJogador.naipe}`;

    vezDeJogar = 'joao';
    cartaSelecionada = indiceArrastado = null;
    exibirCartas();
    atualizarBotoesPedido();

    // ✅ JOÃO JOGA A CARTA DELE
    setTimeout(() => joaoJoga(), 1000);
}

// ===== ✅ JOÃO JOGA AUTOMATICAMENTE =====
function joaoJoga() {
    if (vezDeJogar !== 'joao') return;

    // JOÃO JOGA A MELHOR CARTA DELE
    let melhor = 0;
    cartasJoao.forEach((c, i) => {
        if (c.forca > cartasJoao[melhor].forca) melhor = i;
    });
    cartaJogadaJoao = cartasJoao.splice(melhor, 1)[0];

    // ✅ MOSTRA A CARTA DO JOÃO NA MESA
    mostrarNaMesa(cartaJogadaJoao, cartaJogadaJoaoEl);
    resultadoRodadaEl.textContent = `🃏 João jogou: ${cartaJogadaJoao.valor} de ${cartaJogadaJoao.naipe}`;

    // ✅ VERIFICA QUEM VENCEU A JOGADA
    setTimeout(() => verificarVencedorJogada(), 800);
}

// ===== VERIFICA QUEM VENCEU A JOGADA =====
function verificarVencedorJogada() {
    if (cartaJogadaJogador.forca > cartaJogadaJoao.forca) {
        vitoriasRodadaJogador++;
        resultadoRodadaEl.textContent = `✅ VOCÊ VENCEU A JOGADA! (${vitoriasRodadaJogador}x${vitoriasRodadaJoao})`;
        vezDeJogar = 'jogador'; // ✅ VOCÊ VENCEU → JOGA PRÓXIMA
    } else if (cartaJogadaJogador.forca < cartaJogadaJoao.forca) {
        vitoriasRodadaJoao++;
        resultadoRodadaEl.textContent = `❌ JOÃO VENCEU A JOGADA! (${vitoriasRodadaJogador}x${vitoriasRodadaJoao})`;
        vezDeJogar = 'joao'; // ✅ JOÃO VENCEU → ELE JOGA PRÓXIMA
    } else {
        resultadoRodadaEl.textContent = '🤝 EMPATE! Quem começou joga de novo!';
        // ✅ EMPATE → QUEM COMEÇOU JOGA DE NOVO
        vezDeJogar = quemJogaPrimeiro;
    }

    // ✅ VERIFICA SE A RODADA ACABOU
    if (rodadaAtual === 3 || vitoriasRodadaJogador === 2 || vitoriasRodadaJoao === 2) {
        encerrarRodada();
    } else {
        exibirCartas();
        exibirCartasJoao();
        atualizarBotoesPedido();
        
        // ✅ SE JOÃO VENCEU E TEM PEDIDO DISPONÍVEL → ELE PEDE TRUCO!
        if (vezDeJogar === 'joao' && proximoPedidoDisponivel) {
            setTimeout(() => joaoPedeAumento(), 1200);
        }
        
        // ✅ SE JOÃO JOGA PRÓXIMA → JOGA AUTOMÁTICO
        if (vezDeJogar === 'joao' && !pedidoEmAndamento) {
            setTimeout(() => joaoJoga(), 1500);
        }
    }
}

// ===== ✅ ENCERRA RODADA → LIMPA MESA E DEFINE QUEM JOGA PRÓXIMA =====
function encerrarRodada() {
    rodadaEmAndamento = false;
    proximoPedidoDisponivel = null;

    if (vitoriasRodadaJogador > vitoriasRodadaJoao) {
        // ✅ VOCÊ VENCEU → SOMA PONTOS E VOCÊ JOGA PRÓXIMA
        pontosJogador += valorAtualRodada;
        resultadoRodadaEl.textContent = `🏆 VOCÊ VENCEU A RODADA! +${valorAtualRodada} PONTOS`;
        quemJogaPrimeiro = 'jogador'; // ✅ VOCÊ COMEÇA A PRÓXIMA
    } else if (vitoriasRodadaJoao > vitoriasRodadaJogador) {
        // ✅ JOÃO VENCEU → SOMA PONTOS E ELE JOGA PRÓXIMA
        pontosJoao += valorAtualRodada;
        resultadoRodadaEl.textContent = `😔 JOÃO VENCEU A RODADA! +${valorAtualRodada} PONTOS`;
        quemJogaPrimeiro = 'joao'; // ✅ JOÃO COMEÇA A PRÓXIMA!
    } else {
        resultadoRodadaEl.textContent = '🤝 EMPATE! Ninguém pontuou.';
        // ✅ EMPATE → QUEM COMEÇOU ANTES JOGA DE NOVO
    }

    atualizarPlacar();
    atualizarBotoesPedido();
    
    // ✅ VERIFICA FIM DE PARTIDA OU COMEÇA RODADA NOVA
    verificarFimDePartida();
}

// ===== ✅ FIM DA PARTIDA → SÓ APARECE BOTÃO QUANDO CHEGA A 12 =====
function verificarFimDePartida() {
    if (pontosJogador >= PONTOS_PARTIDA) {
        setTimeout(() => {
            alert(`🎉 PARABÉNS! VOCÊ VENCEU A PARTIDA!\nPlacar: Você ${pontosJogador} x ${pontosJoao} João\n\nQuer jogar outra partida?`);
            botaoNovaRodada.style.opacity = '1';
            botaoNovaRodada.style.pointerEvents = 'auto';
        }, 600);
    } else if (pontosJoao >= PONTOS_PARTIDA) {
        setTimeout(() => {
            alert(`😔 JOÃO VENCEU A PARTIDA!\nPlacar: Você ${pontosJogador} x ${pontosJoao} João\n\nQuer jogar outra partida?`);
            botaoNovaRodada.style.opacity = '1';
            botaoNovaRodada.style.pointerEvents = 'auto';
        }, 600);
    } else {
        // ✅ CONTINUA JOGANDO → LIMPA MESA E COMEÇA NOVA RODADA
        setTimeout(() => iniciarNovaRodada(), 2000);
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

const botao2 = document.getElementById('botao-2jogadores');
const botao4 = document.getElementById('botao-4jogadores');
botao2?.addEventListener('click', () => alert('🎯 Aguardando adversário...'));
botao4?.addEventListener('click', () => alert('🎯 Escolha seu parceiro!'));
