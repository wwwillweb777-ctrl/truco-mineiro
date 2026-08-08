// ==================================================
// TRUCO MINEIRO — 2 JOGADORES — REGRAS EXATAS
// ==================================================

// ===== VALORES E NAIPES =====
const valores = ['4', '5', '6', '7', 'Q', 'J', 'K', 'A', '2', '3'];
const naipes = ['♦', '♥', '♠', '♣'];

// ===== FORÇA DAS CARTAS — TRUCO MINEIRO =====
function calcularForca(valor, naipe) {
    if (valor === '3' && naipe === '♣') return 14; // 1º Zap
    if (valor === '7' && naipe === '♥') return 13;  // 2º 7 de Copas
    if (valor === 'A' && naipe === '♠') return 12;  // 3º Espadilha
    if (valor === '7' && naipe === '♦') return 11;  // 4º 7 de Ouros
    if (valor === '3') return 10;
    if (valor === '2') return 9;
    if (valor === 'A') return 8;
    if (valor === 'K') return 7;
    if (valor === 'J') return 6;
    if (valor === 'Q') return 5;
    if (valor === '7') return 4;
    if (valor === '6') return 3;
    if (valor === '5') return 2;
    if (valor === '4') return 1;
    return 0;
}

// ===== VARIÁVEIS DO JOGO =====
let baralho = [];
let cartasJogador = [];
let cartasJoao = [];
let cartaJogadaJogador = null;
let cartaJogadaJoao = null;
let pontosJogador = 0;
let pontosJoao = 0;
let vitoriasRodadaJogador = 0;
let vitoriasRodadaJoao = 0;
let quemJogaPrimeiro = 'jogador'; // Quem começa na rodada
let vezDeJogar = 'jogador';        // Quem joga AGORA
let podeJogar = true;
const PONTOS_PARTIDA = 12;

// ===== CRIAR E EMBARALHAR BARALHO =====
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

function embaralhar() {
    for (let i = baralho.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [baralho[i], baralho[j]] = [baralho[j], baralho[i]];
    }
}

// ===== DISTRIBUIR 3 CARTAS PARA CADA =====
function distribuirCartas() {
    criarBaralho();
    cartasJogador = baralho.splice(0, 3);
    cartasJoao = baralho.splice(0, 3);
    vitoriasRodadaJogador = 0;
    vitoriasRodadaJoao = 0;
    cartaJogadaJogador = null;
    cartaJogadaJoao = null;
}

// ===== LIMPAR A MESA (CARTAS LADO A LADO) =====
function limparMesa() {
    document.getElementById('carta-jogada-jogador').innerHTML = '';
    document.getElementById('carta-jogada-joao').innerHTML = '';
    cartaJogadaJogador = null;
    cartaJogadaJoao = null;
}

// ===== MOSTRAR SUAS CARTAS =====
function exibirCartasJogador() {
    const container = document.getElementById('suas-cartas');
    container.innerHTML = '';
    cartasJogador.forEach((carta, indice) => {
        if (!carta) return;
        const div = document.createElement('div');
        div.className = 'carta';
        div.innerHTML = `<span>${carta.valor}</span><span class="naipe">${carta.naipe}</span>`;
        div.onclick = () => {
            if (vezDeJogar !== 'jogador' || !podeJogar) {
                mensagem('⏳ Espere sua vez!');
                return;
            }
            jogarCarta(indice);
        };
        container.appendChild(div);
    });
}

// ===== MOSTRAR CARTAS DO JOÃO (VIRADAS) =====
function exibirCartasJoao() {
    const container = document.getElementById('cartas-joao');
    container.innerHTML = '';
    cartasJoao.forEach(() => {
        const div = document.createElement('div');
        div.className = 'carta';
        div.style.background = 'linear-gradient(135deg, #4b2e83, #2a194e)';
        div.style.color = 'white';
        div.innerHTML = '<span>?</span><span class="naipe">🃏</span>';
        container.appendChild(div);
    });
}

// ===== MOSTRAR MENSAGEM =====
function mensagem(texto) {
    document.getElementById('resultado-rodada').textContent = texto;
}

// ===== ATUALIZAR PLACAR =====
function atualizarPlacar() {
    document.getElementById('pontos-jogador').textContent = pontosJogador;
    document.getElementById('pontos-joao').textContent = pontosJoao;
}

// ===== VOCÊ JOGA A CARTA =====
function jogarCarta(indice) {
    podeJogar = false;
    
    // Tira a carta da sua mão
    cartaJogadaJogador = cartasJogador.splice(indice, 1)[0];
    exibirCartasJogador();

    // Coloca na mesa (SEU LADO)
    document.getElementById('carta-jogada-jogador').innerHTML = 
        `<span>${cartaJogadaJogador.valor}</span><span>${cartaJogadaJogador.naipe}</span>`;
    mensagem(`🃏 Você jogou ${cartaJogadaJogador.valor} de ${cartaJogadaJogador.naipe}`);

    // AGORA É A VEZ DO JOÃO!
    vezDeJogar = 'joao';
    setTimeout(jogadaJoao, 1500);
}

// ===== JOÃO JOGA =====
function jogadaJoao() {
    if (vezDeJogar !== 'joao') return;

    let indiceEscolhido = -1;

    // Se você jogou primeiro → João tenta MATAR sua carta
    if (cartaJogadaJogador) {
        let menorQueGanha = null;
        for (let i = 0; i < cartasJoao.length; i++) {
            if (cartasJoao[i].forca > cartaJogadaJogador.forca) {
                if (!menorQueGanha || cartasJoao[i].forca < menorQueGanha.forca) {
                    menorQueGanha = cartasJoao[i];
                    indiceEscolhido = i;
                }
            }
        }
    }

    // Se não conseguiu matar → joga a MAIS FRACA que tem
    if (indiceEscolhido === -1) {
        let menorForca = Math.min(...cartasJoao.map(c => c.forca));
        indiceEscolhido = cartasJoao.findIndex(c => c.forca === menorForca);
    }

    // Tira a carta da mão dele
    cartaJogadaJoao = cartasJoao.splice(indiceEscolhido, 1)[0];
    exibirCartasJoao();

    // Coloca na mesa (LADO DELE — NÃO EM CIMA!)
    document.getElementById('carta-jogada-joao').innerHTML = 
        `<span>${cartaJogadaJoao.valor}</span><span>${cartaJogadaJoao.naipe}</span>`;
    mensagem(`🃏 João jogou ${cartaJogadaJoao.valor} de ${cartaJogadaJoao.naipe}`);

    // VOLTA PARA VOCÊ VERIFICAR QUEM GANHOU
    vezDeJogar = 'jogador';
    setTimeout(verificarVencedor, 1200);
}

// ===== VERIFICAR QUEM GANHOU A JOGADA =====
function verificarVencedor() {
    const forcaVoce = cartaJogadaJogador.forca;
    const forcaJoao = cartaJogadaJoao.forca;
    let vencedor;

    // ✅ COMPARAÇÃO EXATA DAS FORÇAS
    if (forcaVoce > forcaJoao) {
        vitoriasRodadaJogador++;
        vencedor = 'jogador';
        mensagem(`✅ VOCÊ VENCEU! ${cartaJogadaJogador.valor}(${forcaVoce}) > ${cartaJogadaJoao.valor}(${forcaJoao}) — (${vitoriasRodadaJogador} x ${vitoriasRodadaJoao})`);
    } 
    else if (forcaVoce < forcaJoao) {
        vitoriasRodadaJoao++;
        vencedor = 'joao';
        mensagem(`❌ JOÃO VENCEU! ${cartaJogadaJoao.valor}(${forcaJoao}) > ${cartaJogadaJogador.valor}(${forcaVoce}) — (${vitoriasRodadaJogador} x ${vitoriasRodadaJoao})`);
    } 
    else {
        // ✅ EMPATE → QUEM JOGOU POR ÚLTIMO VENCE!
        vencedor = 'joao';
        vitoriasRodadaJoao++;
        mensagem(`🤝 EMPATE! CANGOU! João jogou por último → ELE VENCEU! (${vitoriasRodadaJogador} x ${vitoriasRodadaJoao})`);
    }

    // ===== VERIFICA SE ALGUÉM FEZ 2 RODADAS =====
    setTimeout(() => {
        if (vitoriasRodadaJogador === 2) {
            pontosJogador += 2;
            atualizarPlacar();
            mensagem(`🏆 VOCÊ FEZ 2! GANHOU A MÃO! +2 PONTOS!`);
            quemJogaPrimeiro = 'jogador'; // Você começa na próxima mão
            verificarFimPartida();
            return;
        }
        if (vitoriasRodadaJoao === 2) {
            pontosJoao += 2;
            atualizarPlacar();
            mensagem(`😔 JOÃO FEZ 2! GANHOU A MÃO! +2 PONTOS!`);
            quemJogaPrimeiro = 'joao'; // Ele começa na próxima mão
            verificarFimPartida();
            return;
        }

        // ✅ AINDA NÃO FEZ 2 → QUEM GANHOU JOGA PRIMEIRO NA PRÓXIMA
        limparMesa();
        vezDeJogar = vencedor;
        podeJogar = (vezDeJogar === 'jogador');

        if (vezDeJogar === 'jogador') {
            mensagem('👉 SUA VEZ! Joga primeiro!');
        } else {
            mensagem('⏳ João joga primeiro...');
            setTimeout(jogadaJoao, 1800);
        }
    }, 2000);
}

// ===== FIM DA PARTIDA =====
function verificarFimPartida() {
    if (pontosJogador >= PONTOS_PARTIDA) {
        setTimeout(() => {
            alert(`🎉 VOCÊ VENCEU A PARTIDA!\nPlacar Final:\nVocê: ${pontosJogador} x ${pontosJoao} João`);
        }, 600);
    } 
    else if (pontosJoao >= PONTOS_PARTIDA) {
        setTimeout(() => {
            alert(`😔 JOÃO VENCEU A PARTIDA!\nPlacar Final:\nVocê: ${pontosJogador} x ${pontosJoao} João`);
        }, 600);
    } 
    else {
        // ✅ NOVA MÃO — QUEM GANHOU JOGA PRIMEIRO
        setTimeout(() => {
            mensagem('🃏 NOVA MÃO!');
            setTimeout(iniciarNovaRodada, 1500);
        }, 2500);
    }
}

// ===== INICIAR NOVA RODADA =====
function iniciarNovaRodada() {
    limparMesa();
    distribuirCartas();
    vezDeJogar = quemJogaPrimeiro;
    podeJogar = (vezDeJogar === 'jogador');

    if (vezDeJogar === 'jogador') {
        mensagem('👉 SUA VEZ! Clique na carta!');
    } else {
        mensagem('⏳ João joga primeiro...');
        setTimeout(jogadaJoao, 1800);
    }

    exibirCartasJogador();
    exibirCartasJoao();
}

// ===== INICIAR PARTIDA COMPLETA =====
function iniciarPartida() {
    pontosJogador = 0;
    pontosJoao = 0;
    quemJogaPrimeiro = 'jogador';
    atualizarPlacar();
    iniciarNovaRodada();
}

// ===== BOTÕES =====
document.getElementById('botao-nova-rodada')?.addEventListener('click', () => {
    if (pontosJogador >= PONTOS_PARTIDA || pontosJoao >= PONTOS_PARTIDA) {
        iniciarPartida();
    } else {
        alert('⚠️ Termine a mão primeiro!');
    }
});

// ✅ INICIA O JOGO QUANDO A PÁGINA CARREGA
window.onload = iniciarPartida;
