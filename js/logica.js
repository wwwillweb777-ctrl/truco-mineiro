// ===== VALORES E NAIPES DO BARALHO =====
const valores = ['4', '5', '6', '7', 'Q', 'J', 'K', 'A', '2', '3'];
const naipes = ['♦', '♥', '♠', '♣'];

// ===== ✅ FORÇA DAS CARTAS — TRUCO MINEIRO =====
function calcularForca(valor, naipe) {
    if (valor === '4' && naipe === '♣') return 14; // Zap
    if (valor === '7' && naipe === '♥') return 13;  // 7 de Copas
    if (valor === 'A' && naipe === '♠') return 12;  // Espadilha
    if (valor === '7' && naipe === '♦') return 11;  // 7 de Ouros
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

// ===== COMPARA DUAS CARTAS =====
function compararCartas(cartaA, cartaB) {
    const forcaA = calcularForca(cartaA.valor, cartaA.naipe);
    const forcaB = calcularForca(cartaB.valor, cartaB.naipe);
    if (forcaA > forcaB) return 1;   // cartaA vence
    if (forcaA < forcaB) return -1;  // cartaB vence
    return 0;                         // empate / cangou
}
// ===== CONFIGURAÇÕES DO JOGO =====
const TEMPO_ESPERA = 180000; // 3 minutos
const PONTOS_PARTIDA = 12;

// ===== VARIÁVEIS DE ESTADO =====
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

let temporizadorEspera = null;

// ===== ELEMENTOS DA TELA =====
const telaMatricula = document.getElementById('tela-matricula');
const telaModo = document.getElementById('tela-modo');
const telaMaquina1x1 = document.getElementById('tela-maquina-1x1');
const campoNome = document.getElementById('campo-nome');
const botaoMatricular = document.getElementById('botao-matricular');
const avisoMatricula = document.getElementById('aviso-matricula');
const meuIdMostrar = document.getElementById('meu-id');
const botaoModoMaquina1x1 = document.getElementById('modo-maquina-1x1');
// ===== LIMPAR MESA =====
function limparMesa() {
    document.getElementById('carta-jogada-jogador').innerHTML = '';
    document.getElementById('carta-jogada-joao').innerHTML = '';
}

// ===== PARAR CONTAGEM DE ESPERA =====
function limparContagemEspera() {
    if (temporizadorEspera) {
        clearTimeout(temporizadorEspera);
        temporizadorEspera = null;
    }
}

// ===== INICIAR CONTAGEM DE ESPERA =====
function iniciarContagemEspera() {
    limparContagemEspera();
    temporizadorEspera = setTimeout(() => {
        document.getElementById('resultado-rodada').textContent = '⏱️ Tempo esgotado! Jogando carta aleatória...';
        setTimeout(() => {
            const indiceAleatorio = Math.floor(Math.random() * cartasJogador.length);
            cartaSelecionada = indiceAleatorio;
            jogarCarta();
        }, 1500);
    }, TEMPO_ESPERA);
}

// ===== CRIAR E EMBARALHAR BARALHO =====
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

// ===== DISTRIBUIR CARTAS =====
function distribuirCartas() {
    criarBaralho();
    cartasJogador = baralho.splice(0, 3);
    cartasJoao = baralho.splice(0, 3);
    vitoriasRodadaJogador = 0;
    vitoriasRodadaJoao = 0;
}

// ===== ATUALIZAR PLACAR =====
function atualizarPlacar() {
    document.getElementById('pontos-jogador').textContent = pontosJogador;
    document.getElementById('pontos-joao').textContent = pontosJoao;
}

// ===== EXIBIR CARTAS NA TELA =====
function exibirCartasJogador() {
    const container = document.getElementById('suas-cartas');
    container.innerHTML = '';
    cartasJogador.forEach((carta, indice) => {
        if (!carta) return;
        const div = document.createElement('div');
        div.className = 'carta';
        div.innerHTML = `<span>${carta.valor}</span><span class="naipe">${carta.naipe}</span>`;
        div.onclick = function() {
            if (vezDeJogar !== 'jogador' || !podeJogar) {
                document.getElementById('resultado-rodada').textContent = '⏳ Espere sua vez!';
                return;
            }
            limparContagemEspera();
            document.querySelectorAll('#suas-cartas .carta').forEach(el => el.classList.remove('selecionada'));
            div.classList.add('selecionada');
            cartaSelecionada = indice;
            jogarCarta();
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
// ===== BOTÃO MATRICULAR =====
botaoMatricular.addEventListener('click', function() {
    const nome = campoNome.value.trim();
    if (nome === '') {
        avisoMatricula.innerHTML = '<span style="color:#ffc107;">⚠️ Digite seu nome!</span>';
        return;
    }
    contadorJogadores++;
    jogadorAtual = { nome: nome, id: nome + ' #' + contadorJogadores };
    meuIdMostrar.textContent = jogadorAtual.id;
    telaMatricula.style.display = 'none';
    telaModo.style.display = 'block';
});

// ===== BOTÃO JOGAR CONTRA A MÁQUINA =====
botaoModoMaquina1x1.addEventListener('click', function() {
    telaModo.style.display = 'none';
    telaMaquina1x1.style.display = 'block';
    document.getElementById('nome-jogador').textContent = jogadorAtual.nome;
    iniciarNovaPartida();
});

// ===== INICIAR PARTIDA =====
function iniciarNovaPartida() {
    pontosJogador = 0;
    pontosJoao = 0;
    quemJogaPrimeiro = 'jogador';
    atualizarPlacar();
    iniciarNovaRodada();
}

// ===== NOVA RODADA =====
function iniciarNovaRodada() {
    limparContagemEspera();
    cartaSelecionada = null;
    cartaJogadaJogador = null;
    cartaJogadaJoao = null;

    distribuirCartas();
    vezDeJogar = quemJogaPrimeiro;
    podeJogar = (vezDeJogar === 'jogador');

    limparMesa();

    if (vezDeJogar === 'jogador') {
        document.getElementById('resultado-rodada').textContent = '👉 SUA VEZ! 1ª JOGADA!';
        iniciarContagemEspera();
    } else {
        document.getElementById('resultado-rodada').textContent = '⏳ João joga primeiro...';
        setTimeout(() => joaoJoga(), 1800);
    }

    exibirCartasJogador();
    exibirCartasJoao();
}

// ===== VOCÊ JOGA =====
function jogarCarta() {
    limparContagemEspera();
    if (cartaSelecionada === null || cartaSelecionada < 0 || cartaSelecionada >= cartasJogador.length) {
        document.getElementById('resultado-rodada').textContent = '⚠️ Selecione uma carta!';
        return;
    }
    podeJogar = false;
    cartaJogadaJogador = cartasJogador.splice(cartaSelecionada, 1)[0];
    cartaSelecionada = null;
    exibirCartasJogador();
    document.getElementById('carta-jogada-jogador').innerHTML =
        `<span>${cartaJogadaJogador.valor}</span><span>${cartaJogadaJogador.naipe}</span>`;
    document.getElementById('resultado-rodada').textContent =
        `🃏 Você jogou ${cartaJogadaJogador.valor} de ${cartaJogadaJogador.naipe}`;
    
    vezDeJogar = 'joao';
    setTimeout(() => joaoJoga(), 1500);
}

// ===== JOÃO JOGA =====
function joaoJoga() {
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
    document.getElementById('resultado-rodada').textContent =
        `🃏 João jogou ${cartaJogadaJoao.valor} de ${cartaJogadaJoao.naipe}`;

    vezDeJogar = 'jogador';
    setTimeout(() => verificarVencedor(), 1200);
}

// ===== ✅ VERIFICAR VENCEDOR — REGRA DAS 2 VITÓRIAS EM 3 TENTATIVAS =====
function verificarVencedor() {
    const comparacao = compararCartas(cartaJogadaJogador, cartaJogadaJoao);
    let vencedor;

    if (comparacao === 1) {
        vitoriasRodadaJogador++;
        vencedor = 'jogador';
    } else if (comparacao === -1) {
        vitoriasRodadaJoao++;
        vencedor = 'joao';
    } else {
        vencedor = vezDeJogar; // CANGOU → quem jogou por último vence
        if (vencedor === 'jogador') vitoriasRodadaJogador++;
        else vitoriasRodadaJoao++;
    }

    setTimeout(() => {
        // ===== ✅ ALGUÉM CHEGOU NAS 2 VITÓRIAS → FIM DA RODADA! =====
        if (vitoriasRodadaJogador === 2) {
            pontosJogador += 2;
            document.getElementById('resultado-rodada').textContent =
                `🏆 VOCÊ FEZ 2 VITÓRIAS! GANHOU A RODADA! +2 PONTOS!`;
            quemJogaPrimeiro = 'jogador';
            verificarFimPartida();
            return;
        }
        if (vitoriasRodadaJoao === 2) {
            pontosJoao += 2;
            document.getElementById('resultado-rodada').textContent =
                `😔 JOÃO FEZ 2 VITÓRIAS! VOCÊ PERDEU A RODADA! +2 PONTOS PARA JOÃO!`;
            quemJogaPrimeiro = 'joao';
            verificarFimPartida();
            return;
        }

        // ===== AINDA NÃO CHEGOU NAS 2 → CONTINUA =====
        // Se estiver 1x1 → vai para a 3ª e última
        if (vitoriasRodadaJogador === 1 && vitoriasRodadaJoao === 1) {
            document.getElementById('resultado-rodada').textContent =
                `⚡ 3ª E ÚLTIMA JOGADA! Quem fizer 2, ganha! (${vitoriasRodadaJogador} x ${vitoriasRodadaJoao})`;
        } else {
            document.getElementById('resultado-rodada').textContent =
                `📊 RODADA: ${vitoriasRodadaJogador} x ${vitoriasRodadaJoao} — Precisa de 2 vitórias!`;
        }

        vezDeJogar = vencedor;
        podeJogar = (vezDeJogar === 'jogador');
        limparMesa();

        if (vezDeJogar === 'jogador') {
            document.getElementById('resultado-rodada').textContent += ' — SUA VEZ!';
            iniciarContagemEspera();
        } else {
            document.getElementById('resultado-rodada').textContent += ' — João jogando...';
            setTimeout(() => joaoJoga(), 1800);
        }
    }, 2000);
}

// ===== FIM DA PARTIDA =====
function verificarFimPartida() {
    atualizarPlacar();
    if (pontosJogador >= PONTOS_PARTIDA) {
        setTimeout(() => alert(`🎉 VOCÊ VENCEU A PARTIDA!\nPlacar Final:\nVocê: ${pontosJogador} x ${pontosJoao} João`), 600);
    } else if (pontosJoao >= PONTOS_PARTIDA) {
        setTimeout(() => alert(`😔 JOÃO VENCEU A PARTIDA!\nPlacar Final:\nVocê: ${pontosJogador} x ${pontosJoao} João`), 600);
    } else {
        setTimeout(() => {
            document.getElementById('resultado-rodada').textContent = '🃏 NOVA RODADA!';
            setTimeout(() => iniciarNovaRodada(), 1500);
        }, 2500);
    }
}

// ===== BOTÕES DA TELA =====
document.getElementById('botao-nova-rodada').addEventListener('click', function() {
    if (pontosJogador >= PONTOS_PARTIDA || pontosJoao >= PONTOS_PARTIDA) {
        pontosJogador = 0;
        pontosJoao = 0;
        atualizarPlacar();
        iniciarNovaRodada();
    } else {
        alert('⚠️ Termine a rodada primeiro!');
    }
});

document.getElementById('botao-sair').addEventListener('click', function() {
    if (confirm('🚪 Sair do jogo?')) {
        telaMaquina1x1.style.display = 'none';
        telaMatricula.style.display = 'block';
        campoNome.value = '';
        avisoMatricula.textContent = '';
    }
});
