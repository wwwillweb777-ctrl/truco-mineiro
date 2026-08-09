// ==================================================
// TRUCO MINEIRO — ✅ TROCA A VEZ CERTINHO! NÃO TRAVA NA 3ª!
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
const TEMPO_ESPERA = 180000;
const PONTOS_PARTIDA = 12;

// ===== VALORES E NAIPES =====
const valores = ['4', '5', '6', '7', 'Q', 'J', 'K', 'A', '2', '3'];
const naipes = ['♦', '♥', '♠', '♣'];

// ===== ✅ FORÇA DAS CARTAS — TRUCO MINEIRO OFICIAL =====
function calcularForca(valor, naipe) {
    if (valor === '4' && naipe === '♣') return 14; // 1º ZAP (4 de Paus)
    if (valor === '7' && naipe === '♥') return 13;  // 2º 7 de Copas
    if (valor === 'A' && naipe === '♠') return 12;   // 3º ESPADILHA (A de Espadas)
    if (valor === '7' && naipe === '♦') return 11;  // 4º 7 de Ouros
    if (valor === '3') return 10;                    // 5º TODOS OS 3
    if (valor === '2') return 9;                     // 6º TODOS OS 2
    if (valor === 'A') return 8;                     // 7º A COMUM
    if (valor === 'K') return 7;                     // 8º REIS
    if (valor === 'J') return 6;                     // 9º VALETES
    if (valor === 'Q') return 5;                     // 10º DAMAS
    if (valor === '7') return 4;                     // 11º 7 COMUM
    if (valor === '6') return 3;                     // 12º TODOS OS 6
    if (valor === '5') return 2;                     // 13º TODOS OS 5
    if (valor === '4') return 1;                     // 14º 4 COMUM
    return 0;
}

// ===== ✅ COMPARAR CARTAS =====
function compararCartas(cartaA, cartaB) {
    if (!cartaA || !cartaB || !cartaA.valor || !cartaB.valor) return null;
    const forcaA = calcularForca(cartaA.valor, cartaA.naipe);
    const forcaB = calcularForca(cartaB.valor, cartaB.naipe);
    if (forcaA > forcaB) return 1;
    if (forcaA < forcaB) return -1;
    return 0; // CANGOU
}

// ===== ⏱️ TEMPO =====
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

// ===== 📊 TELA =====
function atualizarPlacar() {
    const elJ = document.getElementById('pontos-jogador') || document.getElementById('placar-jogador');
    const elJo = document.getElementById('pontos-joao') || document.getElementById('placar-joao');
    if (elJ) elJ.textContent = pontosJogador;
    if (elJo) elJo.textContent = pontosJoao;
}

// ===== ✅ LIMPA MESA =====
function limparMesa() {
    const elJ = document.getElementById('carta-jogada-jogador');
    const elJo = document.getElementById('carta-jogada-joao');
    if (elJ) elJ.innerHTML = '';
    if (elJo) elJo.innerHTML = '';
    cartaJogadaJogador = null;
    cartaJogadaJoao = null;
}

// ===== 🖼️ EXIBIR =====
function exibirCartasJogador() {
    const container = document.getElementById('suas-cartas') || document.getElementById('minhas-cartas');
    if (!container) return;
    container.innerHTML = '';
    
    cartasJogador.forEach((carta, i) => {
        const div = document.createElement('div');
        div.className = 'carta';
        div.innerHTML = `<span class="valor">${carta.valor}</span><span class="naipe">${carta.naipe}</span>`;
        div.onclick = () => {
            if (vezDeJogar !== 'jogador') return;
            if (!podeJogar) return;
            pararTempo();
            document.querySelectorAll('.carta').forEach(c => c.classList.remove('selecionada'));
            div.classList.add('selecionada');
            cartaSelecionada = i;
            jogarCarta();
        };
        container.appendChild(div);
    });
}

function exibirCartasJoao() {
    const c = document.getElementById('cartas-joao');
    if (!c) return;
    c.innerHTML = '';
    cartasJoao.forEach(() => {
        const div = document.createElement('div');
        div.className = 'carta costa';
        div.innerHTML = '<span>?</span><span>🃏</span>';
        c.appendChild(div);
    });
}

// ===== 🎮 INICIAR =====
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
        const r = document.getElementById('resultado-rodada');
        if (r) r.textContent = '👉 SUA VEZ! Clique em uma carta!';
        iniciarContagem();
    } else {
        podeJogar = false;
        const r = document.getElementById('resultado-rodada');
        if (r) r.textContent = '⏳ JOÃO JOGA PRIMEIRO...';
        setTimeout(() => joaoJoga(), 1800);
    }

    exibirCartasJogador();
    exibirCartasJoao();
}

// ===== 🃏 VOCÊ JOGA =====
function jogarCarta() {
    pararTempo();
    
    if (cartasJogador.length === 0) return;
    if (cartaSelecionada === null || cartaSelecionada < 0 || cartaSelecionada >= cartasJogador.length) {
        cartaSelecionada = 0;
    }

    podeJogar = false;
    cartaJogadaJogador = cartasJogador.splice(cartaSelecionada, 1)[0];
    cartaSelecionada = null;
    exibirCartasJogador();
    
    const elJ = document.getElementById('carta-jogada-jogador');
    if (elJ && cartaJogadaJogador) {
        elJ.innerHTML = `<span>${cartaJogadaJogador.valor}</span><span>${cartaJogadaJogador.naipe}</span>`;
    }
    const r = document.getElementById('resultado-rodada');
    if (r && cartaJogadaJogador) {
        r.textContent = `🃏 Você jogou ${cartaJogadaJogador.valor} de ${cartaJogadaJogador.naipe}`;
    }

    // ✅ AGORA É A VEZ DO JOÃO! TROCA GARANTIDA!
    vezDeJogar = 'joao';
    setTimeout(() => joaoJoga(), 1500);
}

// ===== 🤖 JOÃO JOGA =====
function joaoJoga() {
    if (vezDeJogar !== 'joao') return;
    if (cartasJoao.length === 0) return;

    let indice = 0;

    if (cartaJogadaJogador) {
        let menorQueGanha = null;
        indice = -1;
        for (let i = 0; i < cartasJoao.length; i++) {
            if (cartasJoao[i].forca > cartaJogadaJogador.forca) {
                if (!menorQueGanha || cartasJoao[i].forca < menorQueGanha.forca) {
                    menorQueGanha = cartasJoao[i];
                    indice = i;
                }
            }
        }
        if (indice === -1) {
            let menorForca = 999;
            for (let i = 0; i < cartasJoao.length; i++) {
                if (cartasJoao[i].forca < menorForca) {
                    menorForca = cartasJoao[i].forca;
                    indice = i;
                }
            }
        }
    }

    if (indice < 0 || indice >= cartasJoao.length) indice = 0;

    cartaJogadaJoao = cartasJoao.splice(indice, 1)[0];
    exibirCartasJoao();
    
    const elJo = document.getElementById('carta-jogada-joao');
    if (elJo && cartaJogadaJoao) {
        elJo.innerHTML = `<span>${cartaJogadaJoao.valor}</span><span>${cartaJogadaJoao.naipe}</span>`;
    }
    const r = document.getElementById('resultado-rodada');
    if (r && cartaJogadaJoao) {
        r.textContent = `🃏 João jogou ${cartaJogadaJoao.valor} de ${cartaJogadaJoao.naipe}`;
    }

    setTimeout(() => verificarVencedor(), 1200);
}

// ===== ✅ VERIFICAR VENCEDOR — TROCA A VEZ CERTINHO! =====
function verificarVencedor() {
    if (!cartaJogadaJogador || !cartaJogadaJoao) return;

    const comp = compararCartas(cartaJogadaJogador, cartaJogadaJoao);
    let vencedor;
    const r = document.getElementById('resultado-rodada');

    if (comp === 1) {
        vitoriasRodadaJogador++;
        vencedor = 'jogador';
        if (r) r.textContent = `✅ VOCÊ GANHOU ESSA! (${vitoriasRodadaJogador} x ${vitoriasRodadaJoao})`;
    } else if (comp === -1) {
        vitoriasRodadaJoao++;
        vencedor = 'joao';
        if (r) r.textContent = `❌ JOÃO GANHOU ESSA! (${vitoriasRodadaJogador} x ${vitoriasRodadaJoao})`;
    } else {
        // 🤝 CANGOU — QUEM JOGOU POR ÚLTIMO DESEMPATA
        vencedor = (vezDeJogar === 'jogador') ? 'joao' : 'jogador';
        if (r) r.textContent = `🤝 CANGOU! ${vencedor === 'jogador' ? 'VOCÊ' : 'JOÃO'} joga de novo!`;
    }

    setTimeout(() => {
        // ✅ GANHOU 2 → RODADA ACABOU!
        if (vitoriasRodadaJogador >= 2) {
            pontosJogador += 2;
            if (r) r.textContent = `🏆 VOCÊ GANHOU A RODADA! +2 PONTOS! → ${pontosJogador} x ${pontosJoao}`;
            quemJogaPrimeiro = 'jogador';
            verificarFimPartida();
            return;
        }
        if (vitoriasRodadaJoao >= 2) {
            pontosJoao += 2;
            if (r) r.textContent = `😔 JOÃO GANHOU A RODADA! +2 PONTOS! → ${pontosJogador} x ${pontosJoao}`;
            quemJogaPrimeiro = 'joao';
            verificarFimPartida();
            return;
        }

        // ⚡ 1 x 1 → VAI PARA A 3ª!
        if (vitoriasRodadaJogador === 1 && vitoriasRodadaJoao === 1) {
            if (r) r.textContent = `⚡ 3ª E ÚLTIMA! Quem ganhar leva!`;
        }

        // ✅ LIMPA A MESA ANTES DA PRÓXIMA JOGADA
        limparMesa();

        // ✅ TROCA A VEZ DE QUEM VAI JOGAR — ISSO QUE ESTAVA FALTANDO!
        vezDeJogar = vencedor; // 👈 AQUI ESTAVA O ERRO! AGORA TROCA CERTINHO!

        // ✅ LIBERA A VEZ CORRETAMENTE
        if (vezDeJogar === 'jogador') {
            podeJogar = true;
            iniciarContagem(); // ✅ VOCÊ JOGA! LIBERA SUAS CARTAS!
        } else {
            podeJogar = false;
            setTimeout(() => joaoJoga(), 1800); // ✅ JOÃO JOGA
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
            const r = document.getElementById('resultado-rodada');
            if (r) r.textContent = '🃏 NOVA RODADA! Quem ganhou começa!';
            setTimeout(() => iniciarNovaRodada(), 1500);
        }, 2500);
    }
}

// ===== 🔘 BOTÕES =====
const telaMatricula = document.getElementById('tela-matricula');
const telaModo = document.getElementById('tela-modo');
const telaMaquina1x1 = document.getElementById('tela-maquina-1x1');
const campoNome = document.getElementById('campo-nome');
const botaoMatricular = document.getElementById('botao-matricular');
const avisoMatricula = document.getElementById('aviso-matricula');
const meuIdMostrar = document.getElementById('meu-id');
const botaoModoMaquina1x1 = document.getElementById('modo-maquina-1x1');

if (botaoMatricular) {
    botaoMatricular.addEventListener('click', () => {
        const nome = campoNome.value.trim();
        if (!nome) {
            if (avisoMatricula) avisoMatricula.innerHTML = '<span style="color:#ffc107;">⚠️ Digite seu nome!</span>';
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
    botaoModoMaquina1x1.addEventListener('click', () => {
        if (telaModo) telaModo.style.display = 'none';
        if (telaMaquina1x1) telaMaquina1x1.style.display = 'block';
        const nomeEl = document.getElementById('nome-jogador');
        if (nomeEl && jogadorAtual) nomeEl.textContent = jogadorAtual.nome;
        iniciarNovaPartida();
    });
}

const botaoNovaRodada = document.getElementById('botao-nova-rodada');
const botaoSair = document.getElementById('botao-sair');

if (botaoNovaRodada) {
    botaoNovaRodada.addEventListener('click', () => {
        if (pontosJogador >= PONTOS_PARTIDA || pontosJoao >= PONTOS_PARTIDA) {
            pararTempo();
            pontosJogador = 0;
            pontosJoao = 0;
            atualizarPlacar();
            iniciarNovaRodada();
        } else alert('⚠️ Termine a rodada primeiro!');
    });
}

if (botaoSair) {
    botaoSair.addEventListener('click', () => {
        pararTempo();
        if (confirm('🚪 Sair do jogo?')) {
            if (telaMaquina1x1) telaMaquina1x1.style.display = 'none';
            if (telaMatricula) telaMatricula.style.display = 'block';
            if (campoNome) campoNome.value = '';
            if (avisoMatricula) avisoMatricula.textContent = '';
        }
    });
}
