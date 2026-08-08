// ==================================================
// TRUCO MINEIRO — FINAL COMPLETO — BOTÃO FUNCIONANDO
// ==================================================

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

// ===== TELAS =====
const telaInicial = document.getElementById('tela-inicial');
const telaMatricula = document.getElementById('tela-matricula');
const telaJogo = document.getElementById('tela-jogo');
const botao2Jogadores = document.getElementById('botao-2jogadores');
const botaoMatricular = document.getElementById('botao-matricular');
const campoNome = document.getElementById('campo-nome');
const nomeExibicao = document.getElementById('nome-jogador');

// ===== VARIÁVEIS DO JOGO =====
let nomeJogador = '';
let baralho = [], cartasJogador = [], cartasJoao = [];
let cartaJogadaJogador = null, cartaJogadaJoao = null;
let pontosJogador = 0, pontosJoao = 0;
let vitoriasRodadaJogador = 0, vitoriasRodadaJoao = 0;
let quemJogaPrimeiro = 'jogador', vezDeJogar = 'jogador';
let podeJogar = true;
const PONTOS_PARTIDA = 12;

// ===== ✅ BOTÃO AZUL "2 JOGADORES" — ENTRA NA MATRÍCULA =====
botao2Jogadores.addEventListener('click', function() {
    telaInicial.style.display = 'none';
    telaMatricula.style.display = 'block';
});

// ===== ✅ BOTÃO "MATRICULAR-SE" — ENTRA NO JOGO =====
botaoMatricular.addEventListener('click', function() {
    nomeJogador = campoNome.value.trim();
    if (nomeJogador === '') {
        alert('⚠️ Digite seu nome!');
        return;
    }
    telaMatricula.style.display = 'none';
    telaJogo.style.display = 'block';
    nomeExibicao.textContent = nomeJogador;
    iniciarPartida();
});

// ===== FUNÇÕES DO JOGO =====
function criarBaralho() {
    baralho = [];
    for (let v of valores) for (let n of naipes)
        baralho.push({ valor: v, naipe: n, forca: calcularForca(v, n) });
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
    vitoriasRodadaJogador = vitoriasRodadaJoao = 0;
    cartaJogadaJogador = cartaJogadaJoao = null;
}
function limparMesa() {
    document.getElementById('carta-jogada-jogador').innerHTML = '';
    document.getElementById('carta-jogada-joao').innerHTML = '';
    cartaJogadaJogador = cartaJogadaJoao = null;
}
function mensagem(texto) {
    document.getElementById('resultado-rodada').textContent = texto;
}
function atualizarPlacar() {
    document.getElementById('pontos-jogador').textContent = pontosJogador;
    document.getElementById('pontos-joao').textContent = pontosJoao;
}
function exibirCartasJogador() {
    const div = document.getElementById('suas-cartas');
    div.innerHTML = '';
    cartasJogador.forEach((c, i) => {
        if (!c) return;
        const el = document.createElement('div');
        el.className = 'carta';
        el.innerHTML = `<span>${c.valor}</span><span class="naipe">${c.naipe}</span>`;
        el.onclick = () => {
            if (vezDeJogar !== 'jogador' || !podeJogar) {
                mensagem('⏳ Espere sua vez!');
                return;
            }
            jogarCarta(i);
        };
        div.appendChild(el);
    });
}
function exibirCartasJoao() {
    const div = document.getElementById('cartas-joao');
    div.innerHTML = '';
    cartasJoao.forEach(() => {
        const el = document.createElement('div');
        el.className = 'carta';
        el.style.background = 'linear-gradient(135deg, #4b2e83, #2a194e)';
        el.style.color = 'white';
        el.innerHTML = '<span>?</span><span class="naipe">🃏</span>';
        div.appendChild(el);
    });
}
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
function jogadaJoao() {
    if (vezDeJogar !== 'joao') return;
    let idx = -1;
    if (cartaJogadaJogador) {
        let menorQueGanha = null;
        for (let i = 0; i < cartasJoao.length; i++) {
            if (cartasJoao[i].forca > cartaJogadaJogador.forca) {
                if (!menorQueGanha || cartasJoao[i].forca < menorQueGanha.forca) {
                    menorQueGanha = cartasJoao[i];
                    idx = i;
                }
            }
        }
    }
    if (idx === -1) {
        let menorF = Math.min(...cartasJoao.map(c => c.forca));
        idx = cartasJoao.findIndex(c => c.forca === menorF);
    }
    cartaJogadaJoao = cartasJoao.splice(idx, 1)[0];
    exibirCartasJoao();
    document.getElementById('carta-jogada-joao').innerHTML = 
        `<span>${cartaJogadaJoao.valor}</span><span>${cartaJogadaJoao.naipe}</span>`;
    mensagem(`🃏 João jogou ${cartaJogadaJoao.valor} de ${cartaJogadaJoao.naipe}`);
    vezDeJogar = 'jogador';
    setTimeout(verificarVencedor, 1200);
}
function verificarVencedor() {
    const fVoce = cartaJogadaJogador.forca;
    const fJo = cartaJogadaJoao.forca;
    let vencedor;
    if (fVoce > fJo) {
        vitoriasRodadaJogador++; vencedor = 'jogador';
        mensagem(`✅ VOCÊ VENCEU! (${vitoriasRodadaJogador} x ${vitoriasRodadaJoao})`);
    } else if (fVoce < fJo) {
        vitoriasRodadaJoao++; vencedor = 'joao';
        mensagem(`❌ JOÃO VENCEU! (${vitoriasRodadaJogador} x ${vitoriasRodadaJoao})`);
    } else {
        vencedor = 'joao'; vitoriasRodadaJoao++;
        mensagem('🤝 EMPATE! Quem jogou por último vence!');
    }
    setTimeout(() => {
        if (vitoriasRodadaJogador === 2) {
            pontosJogador += 2; atualizarPlacar();
            mensagem('🏆 VOCÊ FEZ 2! GANHOU A MÃO!');
            quemJogaPrimeiro = 'jogador'; verificarFimPartida(); return;
        }
        if (vitoriasRodadaJoao === 2) {
            pontosJoao += 2; atualizarPlacar();
            mensagem('😔 JOÃO FEZ 2! GANHOU A MÃO!');
            quemJogaPrimeiro = 'joao'; verificarFimPartida(); return;
        }
        limparMesa(); vezDeJogar = vencedor;
        podeJogar = (vezDeJogar === 'jogador');
        mensagem(vezDeJogar === 'jogador' ? '👉 SUA VEZ!' : '⏳ João jogando...');
        if (vezDeJogar === 'joao') setTimeout(jogadaJoao, 1800);
    }, 2000);
}
function verificarFimPartida() {
    if (pontosJogador >= PONTOS_PARTIDA) {
        setTimeout(() => alert(`🎉 VOCÊ VENCEU!\n${pontosJogador} x ${pontosJoao}`), 600);
    } else if (pontosJoao >= PONTOS_PARTIDA) {
        setTimeout(() => alert(`😔 JOÃO VENCEU!\n${pontosJogador} x ${pontosJoao}`), 600);
    } else {
        setTimeout(() => { mensagem('🃏 NOVA MÃO!'); setTimeout(iniciarNovaRodada, 1500); }, 2500);
    }
}
function iniciarNovaRodada() {
    limparMesa(); distribuirCartas();
    vezDeJogar = quemJogaPrimeiro;
    podeJogar = (vezDeJogar === 'jogador');
    mensagem(vezDeJogar === 'jogador' ? '👉 SUA VEZ! Clique na carta!' : '⏳ João joga primeiro...');
    if (vezDeJogar === 'joao') setTimeout(jogadaJoao, 1800);
    exibirCartasJogador(); exibirCartasJoao();
}
function iniciarPartida() {
    pontosJogador = pontosJoao = 0;
    quemJogaPrimeiro = 'jogador';
    atualizarPlacar();
    iniciarNovaRodada();
}
