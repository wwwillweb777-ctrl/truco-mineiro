// ===== VALORES E NAIPES DO BARALHO =====
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

const PONTOS_PARTIDA = 12;

// ===== ELEMENTOS DA TELA =====
const telaMatricula = document.getElementById('tela-matricula');
const telaModo = document.getElementById('tela-modo');
const telaMaquina1x1 = document.getElementById('tela-maquina-1x1');
const campoNome = document.getElementById('campo-nome');
const botaoMatricular = document.getElementById('botao-matricular');
const avisoMatricula = document.getElementById('aviso-matricula');
const meuIdMostrar = document.getElementById('meu-id');
const botaoModoMaquina1x1 = document.getElementById('modo-maquina-1x1');

// ===== ✅ BOTÃO MATRICULAR — AGORA FUNCIONANDO! =====
botaoMatricular.addEventListener('click', function() {
    let nome = campoNome.value.trim();
    if (nome.length === 0) {
        avisoMatricula.innerHTML = '<span style="color:#ffc107;">⚠️ Digite seu nome!</span>';
        return;
    }
    contadorJogadores++;
    jogadorAtual = { nome: nome, id: nome + ' #' + contadorJogadores };
    meuIdMostrar.textContent = jogadorAtual.id;
    // TROCA DE TELA
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

// ===== ATUALIZAR PLACAR =====
function atualizarPlacar() {
    document.getElementById('pontos-jogador').textContent = pontosJogador;
    document.getElementById('pontos-joao').textContent = pontosJoao;
}

// ===== CRIAR EMBARALHAR =====
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
function distribuirCartas() {
    criarBaralho();
    cartasJogador = baralho.splice(0, 3);
    cartasJoao = baralho.splice(0, 3);
    vitoriasRodadaJogador = 0;
    vitoriasRodadaJoao = 0;
}

// ===== NOVA RODADA =====
function iniciarNovaRodada() {
    distribuirCartas();
    cartaSelecionada = null;
    cartaJogadaJogador = null;
    cartaJogadaJoao = null;
    vezDeJogar = quemJogaPrimeiro;
    podeJogar = true;

    document.getElementById('carta-jogada-jogador').innerHTML = '';
    document.getElementById('carta-jogada-joao').innerHTML = '';
    document.getElementById('resultado-rodada').textContent = 
        (vezDeJogar === 'jogador') ? '👉 SUA VEZ! Escolha uma carta!' : '⏳ João está jogando...';

    exibirCartasJogador();
    exibirCartasJoao();

    if (vezDeJogar === 'joao') {
        podeJogar = false;
        setTimeout(() => joaoJoga(), 1500);
    }
}

// ===== EXIBIR SUAS CARTAS =====
function exibirCartasJogador() {
    const container = document.getElementById('suas-cartas');
    container.innerHTML = '';
    cartasJogador.forEach((carta, i) => {
        if (!carta) return;
        const div = document.createElement('div');
        div.className = 'carta';
        div.innerHTML = `<span>${carta.valor}</span><span class="naipe">${carta.naipe}</span>`;
        div.onclick = () => {
            if (vezDeJogar !== 'jogador' || !podeJogar) return;
            // Destaca carta selecionada
            document.querySelectorAll('#suas-cartas .carta').forEach(el => el.classList.remove('selecionada'));
            div.classList.add('selecionada');
            cartaSelecionada = i;
            setTimeout(() => jogarCarta(), 200);
        };
        container.appendChild(div);
    });
}

// ===== EXIBIR CARTAS DE JOÃO (VIRA-CARTAS) =====
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

// ===== JOGADOR JOGA A CARTA =====
function jogarCarta() {
    podeJogar = false;
    cartaJogadaJogador = cartasJogador.splice(cartaSelecionada, 1)[0];
    document.getElementById('carta-jogada-jogador').innerHTML = 
        `<span>${cartaJogadaJogador.valor}</span><span>${cartaJogadaJogador.naipe}</span>`;
    document.getElementById('resultado-rodada').textContent = 
        `🃏 Você jogou ${cartaJogadaJogador.valor} de ${cartaJogadaJogador.naipe}`;
    
    setTimeout(() => joaoJoga(), 1500);
}

// ===== JOÃO JOGA A MELHOR CARTA =====
function joaoJoga() {
    let melhorForca = Math.max(...cartasJoao.map(c => c.forca));
    let indiceMelhor = cartasJoao.findIndex(c => c.forca === melhorForca);
    cartaJogadaJoao = cartasJoao.splice(indiceMelhor, 1)[0];
    
    document.getElementById('carta-jogada-joao').innerHTML = 
        `<span>${cartaJogadaJoao.valor}</span><span>${cartaJogadaJoao.naipe}</span>`;
    document.getElementById('resultado-rodada').textContent = 
        `🃏 João jogou ${cartaJogadaJoao.valor} de ${cartaJogadaJoao.naipe}`;

    setTimeout(() => verificarVencedor(), 1200);
}

// ===== ✅ COMPARAR CARTAS E VERIFICAR VENCEDOR =====
function verificarVencedor() {
    let vencedor;

    if (cartaJogadaJogador.forca > cartaJogadaJoao.forca) {
        vitoriasRodadaJogador++;
        vencedor = 'jogador';
        document.getElementById('resultado-rodada').textContent = 
            `✅ VOCÊ VENCEU A JOGADA! (${vitoriasRodadaJogador} x ${vitoriasRodadaJoao})`;
    } else if (cartaJogadaJogador.forca < cartaJogadaJoao.forca) {
        vitoriasRodadaJoao++;
        vencedor = 'joao';
        document.getElementById('resultado-rodada').textContent = 
            `❌ JOÃO VENCEU A JOGADA! (${vitoriasRodadaJogador} x ${vitoriasRodadaJoao})`;
    } else {
        // EMPATE — quem jogou por último joga primeiro
        vencedor = vezDeJogar;
        document.getElementById('resultado-rodada').textContent = 
            '🤝 EMPATE! Quem jogou por último joga primeiro!';
    }

    setTimeout(() => {
        // ✅ PRECISA DE 2 VITÓRIAS PARA GANHAR A RODADA
        if (vitoriasRodadaJogador === 2) {
            pontosJogador += 2;
            document.getElementById('resultado-rodada').textContent = 
                `🏆 VOCÊ VENCEU A RODADA! +2 pontos!`;
            quemJogaPrimeiro = 'jogador';
            verificarFimPartida();
            return;
        }
        if (vitoriasRodadaJoao === 2) {
            pontosJoao += 2;
            document.getElementById('resultado-rodada').textContent = 
                `😔 JOÃO VENCEU A RODADA! +2 pontos!`;
            quemJogaPrimeiro = 'joao';
            verificarFimPartida();
            return;
        }

        // CONTINUA JOGANDO
        vezDeJogar = vencedor;
        exibirCartasJogador();
        exibirCartasJoao();
        
        if (vezDeJogar === 'jogador') {
            podeJogar = true;
            document.getElementById('resultado-rodada').textContent += ' — Sua vez!';
        } else {
            podeJogar = false;
            setTimeout(() => joaoJoga(), 1500);
        }
    }, 1800);
}

// ===== VERIFICA SE ALGUÉM CHEGOU A 12 PONTOS =====
function verificarFimPartida() {
    atualizarPlacar();
    if (pontosJogador >= PONTOS_PARTIDA) {
        setTimeout(() => {
            alert(`🎉 PARABÉNS! VOCÊ VENCEU A PARTIDA!\n\nPlacar Final:\nVocê: ${pontosJogador} x ${pontosJoao} :João`);
        }, 600);
    } else if (pontosJoao >= PONTOS_PARTIDA) {
        setTimeout(() => {
            alert(`😔 JOÃO VENCEU A PARTIDA!\n\nPlacar Final:\nVocê: ${pontosJogador} x ${pontosJoao} :João`);
        }, 600);
    } else {
        // NOVA RODADA
        setTimeout(() => {
            document.getElementById('resultado-rodada').textContent = '🃏 Preparando nova rodada...';
            setTimeout(() => iniciarNovaRodada(), 1000);
        }, 2500);
    }
}

// ===== BOTÕES DE AÇÃO =====
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
    if (confirm('🚪 Tem certeza que deseja sair do jogo?')) {
        telaMaquina1x1.style.display = 'none';
        telaMatricula.style.display = 'block';
        campoNome.value = '';
        avisoMatricula.textContent = '';
    }
});
