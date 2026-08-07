// ===== TRUCO MINEIRO — ETAPA 1: CARTAS E REGRAS BÁSICAS =====

// ===== VALORES E NAIPES =====
const valores = ['4', '5', '6', '7', 'Q', 'J', 'K', 'A', '2', '3'];
const naipes = ['♦', '♥', '♠', '♣'];

// ===== ✅ FORÇA DAS CARTAS — EXATAMENTE COMO VOCÊ ENSINOU =====
function calcularForca(valor, naipe) {
    // 1º — ZAP (4 de Paus) → A MAIOR DE TODAS
    if (valor === '4' && naipe === '♣') return 14;

    // 2º — 7 DE COPAS
    if (valor === '7' && naipe === '♥') return 13;

    // 3º — ESPADILHA (Ás de Espadas)
    if (valor === 'A' && naipe === '♠') return 12;

    // 4º — 7 DE OUROS
    if (valor === '7' && naipe === '♦') return 11;

    // DEMAIS — DO MAIS FORTE AO MAIS FRACO
    if (valor === '3') return 10;
    if (valor === '2') return 9;
    if (valor === 'A') return 8;  // Ás comum
    if (valor === 'K') return 7;   // Rei
    if (valor === 'J') return 6;   // Valete
    if (valor === 'Q') return 5;   // Dama
    if (valor === '7') return 4;   // 7 comum
    if (valor === '6') return 3;
    if (valor === '5') return 2;
    if (valor === '4') return 1;   // 4 comum

    return 0;
}

// ===== VARIÁVEIS PRINCIPAIS =====
let baralho = [];
let cartasJogador = [];
let cartasAdversario = [];
let pontosJogador = 0;
let pontosAdversario = 0;
let vitoriasRodadaJogador = 0;
let vitoriasRodadaAdversario = 0;
let PONTOS_PARTIDA = 12;

// ===== CRIA BARALHO COM FORÇA =====
function criarBaralho() {
    baralho = [];
    for (let v of valores) {
        for (let n of naipes) {
            baralho.push({ 
                valor: v, 
                naipe: n, 
                forca: calcularForca(v, n) 
            });
        }
    }
    embaralhar();
}

// ===== EMBARALHAR =====
function embaralhar() {
    for (let i = baralho.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [baralho[i], baralho[j]] = [baralho[j], baralho[i]];
    }
}

// ===== DISTRIBUIR CARTAS =====
function distribuirCartas() {
    criarBaralho();
    cartasJogador = baralho.splice(0, 3);
    cartasAdversario = baralho.splice(0, 3);
    vitoriasRodadaJogador = 0;
    vitoriasRodadaAdversario = 0;
}

// ===== ✅ COMPARAR CARTAS E DEFINIR VENCEDOR DA JOGADA =====
function compararCartas(cartaJogador, cartaAdversario) {
    if (cartaJogador.forca > cartaAdversario.forca) {
        vitoriasRodadaJogador++;
        return "Jogador venceu esta jogada!";
    } else if (cartaJogador.forca < cartaAdversario.forca) {
        vitoriasRodadaAdversario++;
        return "Adversário venceu esta jogada!";
    } else {
        return "EMPATE! Quem jogou por último joga primeiro na próxima!";
    }
}

// ===== ✅ VERIFICA QUEM GANHOU A RODADA (PRECISA DE 2 VITÓRIAS) =====
function verificarVencedorRodada() {
    if (vitoriasRodadaJogador === 2) {
        pontosJogador += 2;
        return "🏆 JOGADOR VENCEU A RODADA!";
    }
    if (vitoriasRodadaAdversario === 2) {
        pontosAdversario += 2;
        return "😔 ADVERSÁRIO VENCEU A RODADA!";
    }
    return null; // Ainda não chegou a 2 → continua jogando
}
// ===== TRUCO MINEIRO — ETAPA 2: TRUCO, SEIS, NOVE E FLUXO COMPLETO =====

// ===== VALORES DO TRUCO =====
const ETAPAS = [
    { nome: 'truco', valor: 4, recusa: 2 },
    { nome: 'seis', valor: 8, recusa: 4 },
    { nome: 'nove', valor: 12, recusa: 6 }
];
const PONTOS_PARTIDA = 12;
const LIMITE_MAO_DE_10 = 10;

// ===== VARIÁVEIS DO JOGO =====
let valorAtualRodada = 2;
let indiceEtapa = -1;
let aguardandoResposta = false;
let quemPediu = null;
let quemJogaPrimeiro = 'jogador';
let vezDeJogar = 'jogador';
let podeJogar = true;
let rodadaEmAndamento = true;

// ===== ✅ PEDIR AUMENTO =====
function pedirAumento(tipo) {
    if (aguardandoResposta) return;
    
    let indicePedido = ETAPAS.findIndex(e => e.nome === tipo);
    let etapa = ETAPAS[indicePedido];
    
    aguardandoResposta = true;
    quemPediu = 'jogador';
    
    // Aqui o adversário decide: aceita ou corre
    setTimeout(() => {
        // Lógica simples de decisão do adversário
        let chanceAceitar = 0.5; // 50% de chance
        let aceita = Math.random() < chanceAceitar;
        
        if (aceita) {
            indiceEtapa = indicePedido;
            valorAtualRodada = etapa.valor;
            console.log(`✅ Aceitou! Agora vale ${etapa.valor} pontos!`);
        } else {
            // Adversário correu → você ganha os pontos de recusa
            pontosJogador += etapa.recusa;
            console.log(`🏃 Adversário correu! Você ganha ${etapa.recusa} pontos!`);
            encerrarRodada();
        }
        aguardandoResposta = false;
        quemPediu = null;
    }, 1500);
}

// ===== ✅ ACEITAR PEDIDO DO ADVERSÁRIO =====
function aceitarPedido() {
    indiceEtapa++;
    valorAtualRodada = ETAPAS[indiceEtapa].valor;
    console.log(`✅ Você aceitou! Vale ${valorAtualRodada} pontos!`);
    aguardandoResposta = false;
    quemPediu = null;
}

// ===== ✅ RECUSAR / CORRER DO PEDIDO =====
function recusarPedido() {
    pontosAdversario += ETAPAS[indiceEtapa + 1].recusa;
    console.log(`🏃 Você correu! Adversário ganha ${ETAPAS[indiceEtapa + 1].recusa} pontos!`);
    aguardandoResposta = false;
    quemPediu = null;
    encerrarRodada();
}

// ===== ✅ ENCERRAR RODADA E SOMAR PONTOS =====
function encerrarRodada() {
    rodadaEmAndamento = false;
    
    if (vitoriasRodadaJogador > vitoriasRodadaAdversario) {
        pontosJogador += valorAtualRodada;
        console.log(`🏆 VOCÊ VENCEU! +${valorAtualRodada} pontos`);
        quemJogaPrimeiro = 'jogador';
    } else {
        pontosAdversario += valorAtualRodada;
        console.log(`😔 ADVERSÁRIO VENCEU! +${valorAtualRodada} pontos`);
        quemJogaPrimeiro = 'adversário';
    }
    
    // Verifica se alguém chegou aos 12 pontos
    if (pontosJogador >= PONTOS_PARTIDA) {
        console.log("🎉 PARABÉNS! VOCÊ VENCEU A PARTIDA!");
        return;
    }
    if (pontosAdversario >= PONTOS_PARTIDA) {
        console.log("😔 ADVERSÁRIO VENCEU A PARTIDA!");
        return;
    }
    
    // Inicia nova rodada
    setTimeout(() => {
        valorAtualRodada = 2;
        indiceEtapa = -1;
        rodadaEmAndamento = true;
        vitoriasRodadaJogador = 0;
        vitoriasRodadaAdversario = 0;
        distribuirCartas();
        vezDeJogar = quemJogaPrimeiro;
        console.log("🃏 NOVA RODADA INICIADA!");
    }, 2000);
}

// ===== VERIFICA MÃO DE 10 =====
function verificarMaoDeDez() {
    if (pontosJogador === LIMITE_MAO_DE_10 && pontosAdversario === LIMITE_MAO_DE_10) {
        return "✋✋ MÃO DE FERRO! Ninguém vê primeiro!";
    }
    if (pontosJogador === LIMITE_MAO_DE_10) {
        return "✋ MÃO DE DEZ! Você vê primeiro!";
    }
    if (pontosAdversario === LIMITE_MAO_DE_10) {
        return "✋ MÃO DE DEZ! Adversário vê primeiro!";
    }
    return null;
}
