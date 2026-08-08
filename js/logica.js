// ==================================================
// TRUCO MINEIRO — COMPLETO COM TELA DE MATRÍCULA
// ==================================================

// ===== VALORES E FORÇA DAS CARTAS =====
const valores = ['4', '5', '6', '7', 'Q', 'J', 'K', 'A', '2', '3'];
const naipes = ['♦', '♥', '♠', '♣'];

function calcularForca(valor, naipe) {
    if (valor === '3' && naipe === '♣') return 14;
    if (valor === '7' && naipe === '♥') return 13;
    if (valor === 'A' && naipe === '♠') return 12;
    if (valor === '7' && naipe === '♦') return 11;
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

// ===== VARIÁVEIS =====
let nomeJogador = '';
let baralho = [];
let cartasJogador = [];
let cartasJoao = [];
let cartaJogadaJogador = null;
let cartaJogadaJoao = null;
let pontosJogador = 0;
let pontosJoao = 0;
let vitoriasRodadaJogador = 0;
let vitoriasRodadaJoao = 0;
let quemJogaPrimeiro = 'jogador';
let vezDeJogar = 'jogador';
let podeJogar = true;
const PONTOS_PARTIDA = 12;

// ===== ELEMENTOS DAS TELAS =====
const telaMatricula = document.getElementById('tela-matricula');
const telaJogo = document.getElementById('tela-jogo');
const campoNome = document.getElementById('campo-nome');
const botaoMatricular = document.getElementById('botao-matricular');
const nomeExibicao = document.getElementById('nome-jogador');

// ===== AÇÃO DO BOTÃO MATRICULAR =====
botaoMatricular.addEventListener('click', function() {
    nomeJogador = campoNome.value.trim();
    if (nomeJogador === '') {
        alert('⚠️ Digite seu nome!');
        return;
    }
    // ✅ ESCONDE MATRÍCULA E MOSTRA O JOGO
    telaMatricula.style.display = 'none';
    telaJogo.style.display = 'block';
    nomeExibicao.textContent = nomeJogador;
    // ✅ INICIA O JOGO
    iniciarPartida();
});

// ===== CRIAR EMBARALHAR =====
function criarBaralho() {
    baralho = [];
    for (let v of valores) {
        for (let n of naipes) {
            baralho.push({ valor: v, naipe: n, forca: calcularForca(v, n) });
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
function distribuirCartas() {
    criarBaralho();
    cartasJogador = baralho.splice(0, 3);
    cartasJoao = baralho.splice(0, 3);
    vitoriasRodadaJogador = 0;
    vitoriasRodadaJoao = 0;
    cartaJogadaJogador = null;
    cartaJogadaJoao = null;
}

// ===== LIMPAR MESA =====
function limparMesa() {
    document.getElementById('carta-jogada-jogador').innerHTML = '';
    document.getElementById('carta-jogada-joao').innerHTML = '';
    cartaJogadaJogador = null;
    cartaJogadaJoao = null;
}

// ===== MENSAGEM =====
function mensagem(texto) {
    document.getElementById('resultado-rodada').textContent = texto;
}

// ===== PLACAR =====
function atualizarPlacar() {
    document.getElementById('pontos-jogador').textContent = pontosJogador;
    document.getElementById('pontos-joao').textContent = pontosJoao;
}

// ===== EXIBIR CARTAS =====
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

// ===== VOCÊ JOGA =====
function jogarCarta(indice) {
    podeJogar = false;
    cartaJogadaJogador = cartasJogador.splice(indice, 1)[0];
    exibirCartasJogador();
    document.getElementById('carta-jogada-jogador').innerHTML = 
        `<span>${cartaJogadaJogador.valor}</span><span>${cartaJogadaJogador.naipe}</span>`;
    mensagem(`🃏 Você jogou ${cartaJogadaJogador.valor} de ${cartaJogadaJogador.naipe}`);
    vezDeJogar = 'joao';
    setTimeout(jogadaJoao, 1500);
}

// ===== JOÃO JOGA =====
function jogadaJoao() {
    if (vezDeJogar !== 'joao') return;
    let indiceEscolhido = -1;
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
    if (indiceEscolhido === -1) {
        let menorForca = Math.min(...cartasJoao.map(c => c.forca));
        indiceEscolhido = cartasJoao.findIndex(c => c.forca === menorForca);
    }
    cartaJogadaJoao = cartasJoao.splice(indiceEscolhido, 1)[0];
    exibirCartasJoao();
    document.getElementById('carta-jogada-joao').innerHTML = 
        `<span>${cartaJogadaJoao.valor}</span><span>${cartaJogadaJoao.naipe}</span>`;
    mensagem(`🃏 João jogou ${cartaJogadaJoao.valor} de ${cartaJogadaJoao.naipe}`);
    vezDeJogar = 'jogador';
    setTimeout(verificarVencedor, 1200);
}

// ===== VERIFICAR VENCEDOR =====
function verificarVencedor() {
    const fVoce = cartaJogadaJogador.forca;
    const fJo = cartaJogadaJoao.forca;
    let vencedor;

    if (fVoce > fJo) {
        vitoriasRodadaJogador++;
        vencedor = 'jogador';
        mensagem(`✅ VOCÊ VENCEU! (${vitoriasRodadaJogador} x ${vitoriasRodadaJoao})`);
    } else if (fVoce < fJo) {
        vitoriasRodadaJoao++;
        vencedor = 'joao';
        mensagem(`❌ JOÃO VENCEU! (${vitoriasRodadaJogador} x ${vitoriasRodadaJoao})`);
    } else {
        vencedor = 'joao';
        vitoriasRodadaJoao++;
        mensagem('🤝 EMPATE! Quem jogou por último vence!');
    }

    setTimeout(() => {
        if (vitoriasRodadaJogador === 2) {
            pontosJogador += 2;
            atualizarPlacar();
            mensagem('🏆 VOCÊ FEZ 2! GANHOU A MÃO!');
            quemJogaPrimeiro = 'jogador';
            verificarFimPartida();
            return;
        }
        if (vitoriasRodadaJoao === 2) {
            pontosJoao += 2;
            atualizarPlacar();
            mensagem('😔 JOÃO FEZ 2! GANHOU A MÃO!');
            quemJogaPrimeiro = 'joao';
            verificarFimPartida();
            return;
        }
        limparMesa();
        vezDeJogar = vencedor;
        podeJogar = (vezDeJogar === 'jogador');
        if (vezDeJogar === 'jogador') {
            mensagem('👉 SUA VEZ!');
        } else {
            mensagem('⏳ João jogando...');
            setTimeout(jogadaJoao, 1800);
        }
    }, 2000);
}

// ===== FIM DA PARTIDA =====
function verificarFimPartida() {
    if (pontosJogador >= PONTOS_PARTIDA) {
        setTimeout(() => alert(`🎉 VOCÊ VENCEU!\n${pontosJogador} x ${pontosJoao}`), 600);
    } else if (pontosJoao >= PONTOS_PARTIDA) {
        setTimeout(() => alert(`😔 JOÃO VENCEU!\n${pontosJogador} x ${pontosJoao}`), 600);
    } else {
        setTimeout(() => {
            mensagem('🃏 NOVA MÃO!');
            setTimeout(iniciarNovaRodada, 1500);
        }, 2500);
    }
}

// ===== NOVA RODADA =====
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

// ===== INICIAR PARTIDA =====
function iniciarPartida() {
    pontosJogador = 0;
    pontosJoao = 0;
    quemJogaPrimeiro = 'jogador';
    atualizarPlacar();
    iniciarNovaRodada();
}
