// ==================================================
// TRUCO MINEIRO — CÓDIGO UNIFICADO & CORRIGIDO
// ==================================================

// ===== VARIÁVEIS GERAIS =====
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

let quemJogaPrimeiro = 'jogador';
let vezDeJogar = 'jogador';
let podeJogar = true;
let temporizador = null;

// ===== CONFIGURAÇÕES =====
const TEMPO_ESPERA = 180000; // 3 minutos
const PONTOS_PARTIDA = 12;

// ===== VALORES E NAIPES =====
const valores = ['4', '5', '6', '7', 'Q', 'J', 'K', 'A', '2', '3'];
const naipes = ['♦', '♥', '♠', '♣'];

// ===== ✅ FORÇA DAS CARTAS — TRUCO MINEIRO =====
function calcularForca(valor, naipe) {
    if (valor === '4' && naipe === '♣') return 14; // 🥇 ZAP
    if (valor === '7' && naipe === '♥') return 13;  // 🥈 7 de Copas
    if (valor === 'A' && naipe === '♠') return 12;   // 🥉 ESPADILHA
    if (valor === '7' && naipe === '♦') return 11;  // 🏅 7 de Ouros
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

// ===== ✅ COMPARAR CARTAS =====
function compararCartas(cartaA, cartaB) {
    const forcaA = calcularForca(cartaA.valor, cartaA.naipe);
    const forcaB = calcularForca(cartaB.valor, cartaB.naipe);
    if (forcaA > forcaB) return 1;
    if (forcaA < forcaB) return -1;
    return 0; // 🤝 CANGOU
}

// ===== ⏱️ CONTAGEM DE TEMPO =====
function pararTempo() {
    if (temporizador) { clearTimeout(temporizador); temporizador = null; }
}

function iniciarContagem() {
    pararTempo();
    podeJogar = true;
    temporizador = setTimeout(() => {
        if (vezDeJogar === 'jogador' && cartasJogador.length > 0) {
            pararTempo();
            cartaSelecionada = Math.floor(Math.random() * cartasJogador.length);
            jogarCarta();
        }
    }, TEMPO_ESPERA);
}

// ===== 🃏 BARALHO =====
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
    cartaSelecionada = null;
    vitoriasRodadaJogador = 0;
    vitoriasRodadaJoao = 0;
    cartaJogadaJogador = null;
    cartaJogadaJoao = null;
}

// ===== 📊 ATUALIZAR TELA =====
function atualizarPlacar() {
    const elJogador = document.getElementById('pontos-jogador') || document.getElementById('placar-jogador');
    const elJoao = document.getElementById('pontos-joao') || document.getElementById('placar-joao');
    if (elJogador) elJogador.textContent = pontosJogador;
    if (elJoao) elJoao.textContent = pontosJoao;
}

function limparMesa() {
    const elJogador = document.getElementById('carta-jogada-jogador');
    const elJoao = document.getElementById('carta-jogada-joao');
    if (elJogador) elJogador.innerHTML = '';
    if (elJoao) elJoao.innerHTML = '';
    cartaJogadaJogador = null;
    cartaJogadaJoao = null;
}

// ===== 🖼️ EXIBIR CARTAS =====
function exibirCartasJogador() {
    const container = document.getElementById('suas-cartas') || document.getElementById('minhas-cartas');
    if (!container) return;
    container.innerHTML = '';
    
    cartasJogador.forEach((carta, indice) => {
        const div = document.createElement('div');
        div.className = 'carta';
        div.innerHTML = `<span class="valor">${carta.valor}</span><span class="naipe">${carta.naipe}</span>`;
        div.onclick = function() {
            if (vezDeJogar !== 'jogador' || !podeJogar) {
                document.getElementById('resultado-rodada').textContent = '⏳ Espere sua vez!';
                return;
            }
            pararTempo();
            document.querySelectorAll('.carta').forEach(c => c.classList.remove('selecionada'));
            div.classList.add('selecionada');
            cartaSelecionada = indice;
            jogarCarta();
        };
        container.appendChild(div);
    });
}

function exibirCartasJoao() {
    const container = document.getElementById('cartas-joao');
    if (!container) return;
    container.innerHTML = '';
    cartasJoao.forEach(() => {
        const div = document.createElement('div');
        div.className = 'carta costa';
        div.innerHTML = '<span>?</span><span>🃏</span>';
        container.appendChild(div);
    });
}

// ===== 🎮 INICIAR PARTIDA E RODADA =====
function iniciarNovaPartida() {
    pontosJogador = 0;
    pontosJoao = 0;
    quemJogaPrimeiro = 'jogador';
    atualizarPlacar();
    iniciarNovaRodada();
}

function iniciarNovaRodada() {
    pararTempo();
    distribuirCartas();
    vezDeJogar = quemJogaPrimeiro;
    limparMesa();

    if (vezDeJogar === 'jogador') {
        podeJogar = true;
        document.getElementById('resultado-rodada').textContent = '👉 SUA VEZ! Você tem 3 minutos!';
        iniciarContagem();
    } else {
        podeJogar = false;
        document.getElementById('resultado-rodada').textContent = '⏳ JOÃO JOGA PRIMEIRO...';
        setTimeout(() => joaoJoga(), 1800);
    }

    exibirCartasJogador();
    exibirCartasJoao();
}

// ===== 🃏 JOGAR CARTA =====
function jogarCarta() {
    pararTempo();
    if (!podeJogar) return;
    if (cartaSelecionada === null || cartaSelecionada < 0 || cartaSelecionada >= cartasJogador.length) {
        document.getElementById('resultado-rodada').textContent = '⚠️ Selecione uma carta!';
        return;
    }

    podeJogar = false;
    cartaJogadaJogador = cartasJogador.splice(cartaSelecionada, 1)[0];
    cartaSelecionada = null;
    exibirCartasJogador();
    
    const elJogada = document.getElementById('carta-jogada-jogador');
    if (elJogada) elJogada.innerHTML = `<span>${cartaJogadaJogador.valor}</span><span>${cartaJogadaJogador.naipe}</span>`;
    document.getElementById('resultado-rodada').textContent = `🃏 Você jogou ${cartaJogadaJogador.valor} de ${cartaJogadaJogador.naipe}`;

    vezDeJogar = 'joao';
    setTimeout(() => joaoJoga(), 1500);
}

// ===== 🤖 JOÃO JOGA =====
function joaoJoga() {
    if (!cartaJogadaJogador && vezDeJogar !== 'joao') return;

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
    
    const elJoao = document.getElementById('carta-jogada-joao');
    if (elJoao) elJoao.innerHTML = `<span>${cartaJogadaJoao.valor}</span><span>${cartaJogadaJoao.naipe}</span>`;
    document.getElementById('resultado-rodada').textContent = `🃏 João jogou ${cartaJogadaJoao.valor} de ${cartaJogadaJoao.naipe}`;

    setTimeout(() => verificarVencedor(), 1200);
}

// ===== ✅ VERIFICAR VENCEDOR =====
function verificarVencedor() {
    const comparacao = compararCartas(cartaJogadaJogador, cartaJogadaJoao);
    let vencedor;

    if (comparacao === 1) {
        vitoriasRodadaJogador++;
        vencedor = 'jogador';
        document.getElementById('resultado-rodada').textContent = `✅ VOCÊ GANHOU ESSA! (${vitoriasRodadaJogador} x ${vitoriasRodadaJoao})`;
    } else if (comparacao === -1) {
        vitoriasRodadaJoao++;
        vencedor = 'joao';
        document.getElementById('resultado-rodada').textContent = `❌ JOÃO GANHOU ESSA! (${vitoriasRodadaJogador} x ${vitoriasRodadaJoao})`;
    } else {
        // 🤝 CANGOU — NÃO CONTA PONTO! Só decide quem joga
        vencedor = (vezDeJogar === 'jogador') ? 'joao' : 'jogador';

        // ✅ 1 VITÓRIA + EMPATE = GANHA A RODADA!
        if (vitoriasRodadaJogador === 1 && vitoriasRodadaJoao === 0) {
            setTimeout(() => {
                pontosJogador += 2;
                document.getElementById('resultado-rodada').textContent = `🏆 VOCÊ GANHOU A RODADA! +2 PONTOS! → ${pontosJogador} x ${pontosJoao}`;
                quemJogaPrimeiro = 'jogador';
                verificarFimPartida();
            }, 1500);
            return;
        }
        if (vitoriasRodadaJoao === 1 && vitoriasRodadaJogador === 0) {
            setTimeout(() => {
                pontosJoao += 2;
                document.getElementById('resultado-rodada').textContent = `😔 JOÃO GANHOU A RODADA! +2 PONTOS! → ${pontosJogador} x ${pontosJoao}`;
                quemJogaPrimeiro = 'joao';
                verificarFimPartida();
            }, 1500);
            return;
        }

        document.getElementById('resultado-rodada').textContent = `🤝 CANGOU! Quem desempata joga primeiro!`;
    }

    setTimeout(() => {
        // ✅ FEZ 2 VITÓRIAS → GANHOU A RODADA!
        if (vitoriasRodadaJogador >= 2) {
            pontosJogador += 2;
            document.getElementById('resultado-rodada').textContent = `🏆 VOCÊ GANHOU A RODADA! +2 PONTOS! → ${pontosJogador} x ${pontosJoao}`;
            quemJogaPrimeiro = 'jogador';
            verificarFimPartida();
            return;
        }
        if (vitoriasRodadaJoao >= 2) {
            pontosJoao += 2;
            document.getElementById('resultado-rodada').textContent = `😔 JOÃO GANHOU A RODADA! +2 PONTOS! → ${pontosJogador} x ${pontosJoao}`;
            quemJogaPrimeiro = 'joao';
            verificarFimPartida();
            return;
        }

        // ✅ SÓ VAI PARA 3ª SE ESTIVER 1 x 1
        if (vitoriasRodadaJogador === 1 && vitoriasRodadaJoao === 1) {
            document.getElementById('resultado-rodada').textContent = `⚡ 3ª E ÚLTIMA! Quem ganhar leva! (1 x 1)`;
        }

        // CONTINUAR RODADA
        vezDeJogar = vencedor;
        limparMesa();

        if (vezDeJogar === 'jogador') {
            podeJogar = true;
            document.getElementById('resultado-rodada').textContent += ' — SUA VEZ!';
            iniciarContagem();
        } else {
            podeJogar = false;
            document.getElementById('resultado-rodada').textContent += ' — João jogando...';
            setTimeout(() => joaoJoga(), 1800);
        }
    }, 2000);
}

// ===== 🏆 FIM DE JOGO =====
function verificarFimPartida() {
    pararTempo();
    atualizarPlacar();

    if (pontosJogador >= PONTOS_PARTIDA) {
        setTimeout(() => alert(`🎉 VOCÊ GANHOU O JOGO!\n\nPLACAR FINAL:\nVOCÊ: ${pontosJogador}\nJOÃO: ${pontosJoao}`), 800);
    } else if (pontosJoao >= PONTOS_PARTIDA) {
        setTimeout(() => alert(`😔 JOÃO GANHOU O JOGO!\n\nPLACAR FINAL:\nVOCÊ: ${pontosJogador}\nJOÃO: ${pontosJoao}`), 800);
    } else {
        setTimeout(() => {
            document.getElementById('resultado-rodada').textContent = '🃏 NOVA RODADA!';
            setTimeout(() => iniciarNovaRodada(), 1500);
        }, 2500);
    }
}

// ===== 🔘 BOTÕES DE TELA INICIAL =====
const telaMatricula = document.getElementById('tela-matricula');
const telaModo = document.getElementById('tela-modo');
const telaMaquina1x1 = document.getElementById('tela-maquina-1x1');
const campoNome = document.getElementById('campo-nome');
const botaoMatricular = document.getElementById('botao-matricular');
const avisoMatricula = document.getElementById('aviso-matricula');
const meuIdMostrar = document.getElementById('meu-id');
const botaoModoMaquina1x1 = document.getElementById('modo-maquina-1x1');

if (botaoMatricular) {
    botaoMatricular.addEventListener('click', function() {
        const nome = campoNome.value.trim();
        if (nome === '') {
            avisoMatricula.innerHTML = '<span style="color:#ffc107;">⚠️ Digite seu nome!</span>';
            return;
        }
        contadorJogadores++;
        jogadorAtual = { nome: nome, id: nome + ' #' + contadorJogadores };
        if (meuIdMostrar) meuIdMostrar.textContent = jogadorAtual.id;
        if (telaMatricula) telaMatricula.style.display = 'none';
        if (telaModo) telaModo.style.display = 'block';
    });
}

if (botaoModoMaquina1x1) {
    botaoModoMaquina1x1.addEventListener('click', function() {
        if (telaModo) telaModo.style.display = 'none';
        if (telaMaquina1x1) telaMaquina1x1.style.display = 'block';
        const nomeEl = document.getElementById('nome-jogador');
        if (nomeEl && jogadorAtual) nomeEl.textContent = jogadorAtual.nome;
        iniciarNovaPartida();
    });
}

// ===== 🔘 BOTÕES DO JOGO =====
const botaoNovaRodada = document.getElementById('botao-nova-rodada');
const botaoSair = document.getElementById('botao-sair');

if (botaoNovaRodada) {
    botaoNovaRodada.addEventListener('click', function() {
        if (pontosJogador >= PONTOS_PARTIDA || pontosJoao >= PONTOS_PARTIDA) {
            pararTempo();
            pontosJogador = 0;
            pontosJoao = 0;
            atualizarPlacar();
            iniciarNovaRodada();
        } else {
            alert('⚠️ Termine a rodada primeiro!');
        }
    });
}

if (botaoSair) {
    botaoSair.addEventListener('click', function() {
        pararTempo();
        if (confirm('🚪 Sair do jogo?')) {
            if (telaMaquina1x1) telaMaquina1x1.style.display = 'none';
            if (telaMatricula) telaMatricula.style.display = 'block';
            if (campoNome) campoNome.value = '';
            if (avisoMatricula) avisoMatricula.textContent = '';
        }
    });
}
