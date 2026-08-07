// ===== VALORES E NAIPES =====
const valores = ['4', '5', '6', '7', 'Q', 'J', 'K', 'A', '2', '3'];
const naipes = ['♦', '♥', '♠', '♣'];

// ===== FORÇA DAS CARTAS — TRUCO MINEIRO =====
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

// ===== ETAPAS DE VALOR =====
const ETAPAS = [
    { nome: 'truco', valor: 4, recusa: 2 },
    { nome: 'seis', valor: 8, recusa: 4 },
    { nome: 'nove', valor: 12, recusa: 6 }
];

// ===== VARIÁVEIS GLOBAIS =====
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
let quemJogaPrimeiro = 'jogador'; // ✅ QUEM GANHA JOGA PRIMEIRO
let vezDeJogar = 'jogador';
let podeJogar = true;
let valorAtualRodada = 2;
let indiceEtapa = -1;
let aguardandoResposta = false;
let quemPediu = null;
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
const areaPedidos = document.getElementById('area-pedidos');

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

function atualizarPlacar() {
    document.getElementById('pontos-jogador').textContent = pontosJogador;
    document.getElementById('pontos-joao').textContent = pontosJoao;
}

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
}

// ===== ✅ NOVA RODADA — QUEM GANHOU JOGA PRIMEIRO =====
function iniciarNovaRodada() {
    distribuirCartas();
    cartaSelecionada = null;
    cartaJogadaJogador = null;
    cartaJogadaJoao = null;
    valorAtualRodada = 2;
    indiceEtapa = -1;
    aguardandoResposta = false;
    quemPediu = null;
    areaPedidos.innerHTML = '';

    // ✅ QUEM GANHOU A ÚLTIMA JOGA PRIMEIRO
    vezDeJogar = quemJogaPrimeiro;
    podeJogar = (vezDeJogar === 'jogador');

    document.getElementById('carta-jogada-jogador').innerHTML = '';
    document.getElementById('carta-jogada-joao').innerHTML = '';
    
    if (vezDeJogar === 'jogador') {
        document.getElementById('resultado-rodada').textContent = '👉 VOCÊ JOGA PRIMEIRO! Escolha uma carta!';
    } else {
        document.getElementById('resultado-rodada').textContent = '⏳ João joga primeiro...';
    }

    exibirCartasJogador();
    exibirCartasJoao();

    // ✅ SE FOR A VEZ DE JOÃO, ELE JOGA DEPOIS
    if (vezDeJogar === 'joao') {
        podeJogar = false;
        setTimeout(() => joaoJoga(), 1800);
    }
}

// ===== EXIBIR CARTAS =====
function exibirCartasJogador() {
    const container = document.getElementById('suas-cartas');
    container.innerHTML = '';
    cartasJogador.forEach((carta, i) => {
        if (!carta) return;
        const div = document.createElement('div');
        div.className = 'carta';
        div.innerHTML = `<span>${carta.valor}</span><span class="naipe">${carta.naipe}</span>`;
        div.onclick = () => {
            // ✅ SÓ JOGA SE FOR A SUA VEZ E NÃO TIVER PEDIDO PENDENTE
            if (vezDeJogar !== 'jogador' || !podeJogar || aguardandoResposta) return;
            document.querySelectorAll('#suas-cartas .carta').forEach(el => el.classList.remove('selecionada'));
            div.classList.add('selecionada');
            cartaSelecionada = i;
            setTimeout(() => jogarCarta(), 200);
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

// ===== ✅ JOGADOR JOGA — JOÃO ESPERA =====
function jogarCarta() {
    podeJogar = false;
    cartaJogadaJogador = cartasJogador.splice(cartaSelecionada, 1)[0];
    document.getElementById('carta-jogada-jogador').innerHTML = 
        `<span>${cartaJogadaJogador.valor}</span><span>${cartaJogadaJogador.naipe}</span>`;
    document.getElementById('resultado-rodada').textContent = 
        `🃏 Você jogou ${cartaJogadaJogador.valor} de ${cartaJogadaJogador.naipe}`;

    // ✅ AGORA JOÃO JOGA DEPOIS DE VOCÊ
    setTimeout(() => joaoJoga(), 1500);
}

// ===== ✅ JOÃO JOGA SÓ DEPOIS DE VOCÊ =====
function joaoJoga() {
    // Escolhe carta mais fraca que ganha da sua, ou a mais fraca se não tiver
    let cartaParaJogar = null;
    let indiceEscolhido = -1;

    for (let i = 0; i < cartasJoao.length; i++) {
        if (cartaJogadaJogador && cartasJoao[i].forca > cartaJogadaJogador.forca) {
            if (!cartaParaJogar || cartasJoao[i].forca < cartaParaJogar.forca) {
                cartaParaJogar = cartasJoao[i];
                indiceEscolhido = i;
            }
        }
    }

    if (!cartaParaJogar) {
        let menorForca = Math.min(...cartasJoao.map(c => c.forca));
        indiceEscolhido = cartasJoao.findIndex(c => c.forca === menorForca);
        cartaParaJogar = cartasJoao[indiceEscolhido];
    }

    cartaJogadaJoao = cartasJoao.splice(indiceEscolhido, 1)[0];
    
    document.getElementById('carta-jogada-joao').innerHTML = 
        `<span>${cartaJogadaJoao.valor}</span><span>${cartaJogadaJoao.naipe}</span>`;
    document.getElementById('resultado-rodada').textContent = 
        `🃏 João jogou ${cartaJogadaJoao.valor} de ${cartaJogadaJoao.naipe}`;

    setTimeout(() => verificarVencedor(), 1200);
}

// ===== ✅ VERIFICAR VENCEDOR DA JOGADA =====
function verificarVencedor() {
    let vencedor;

    if (cartaJogadaJogador.forca > cartaJogadaJoao.forca) {
        vitoriasRodadaJogador++;
        vencedor = 'jogador';
        document.getElementById('resultado-rodada').textContent = 
            `✅ VOCÊ VENCEU! (${vitoriasRodadaJogador} x ${vitoriasRodadaJoao})`;
    } else if (cartaJogadaJogador.forca < cartaJogadaJoao.forca) {
        vitoriasRodadaJoao++;
        vencedor = 'joao';
        document.getElementById('resultado-rodada').textContent = 
            `❌ JOÃO VENCEU! (${vitoriasRodadaJogador} x ${vitoriasRodadaJoao})`;
    } else {
        vencedor = vezDeJogar;
        document.getElementById('resultado-rodada').textContent = 
            '🤝 EMPATE! Quem jogou por último joga primeiro!';
    }

    setTimeout(() => {
        // ✅ PRECISA DE 2 VITÓRIAS PARA GANHAR A RODADA
        if (vitoriasRodadaJogador === 2) {
            pontosJogador += valorAtualRodada;
            document.getElementById('resultado-rodada').textContent = 
                `🏆 VOCÊ VENCEU A RODADA! +${valorAtualRodada}pts!`;
            quemJogaPrimeiro = 'jogador'; // ✅ VOCÊ GANHOU → JOGA PRÓXIMA PRIMEIRO
            verificarFimPartida();
            return;
        }
        if (vitoriasRodadaJoao === 2) {
            pontosJoao += valorAtualRodada;
            document.getElementById('resultado-rodada').textContent = 
                `😔 JOÃO VENCEU A RODADA! +${valorAtualRodada}pts!`;
            quemJogaPrimeiro = 'joao'; // ✅ JOÃO GANHOU → ELE JOGA PRÓXIMA PRIMEIRO
            verificarFimPartida();
            return;
        }

        // ✅ CONTINUA — QUEM GANHOU JOGA A PRÓXIMA
        vezDeJogar = vencedor;
        exibirCartasJogador();
        exibirCartasJoao();

        if (vezDeJogar === 'jogador') {
            podeJogar = true;
            document.getElementById('resultado-rodada').textContent += ' — VOCÊ JOGA PRÓXIMA!';
        } else {
            podeJogar = false;
            document.getElementById('resultado-rodada').textContent += ' — João joga próxima...';
            setTimeout(() => joaoJoga(), 1800);
        }
    }, 2000);
}

// ===== VERIFICA FIM DA PARTIDA =====
function verificarFimPartida() {
    atualizarPlacar();
    if (pontosJogador >= PONTOS_PARTIDA) {
        setTimeout(() => {
            alert(`🎉 PARABÉNS! VOCÊ VENCEU A PARTIDA!\n\nPlacar Final:\nVocê: ${pontosJogador} x ${pontosJoao} João`);
        }, 600);
    } else if (pontosJoao >= PONTOS_PARTIDA) {
        setTimeout(() => {
            alert(`😔 JOÃO VENCEU A PARTIDA!\n\nPlacar Final:\nVocê: ${pontosJogador} x ${pontosJoao} João`);
        }, 600);
    } else {
        setTimeout(() => {
            document.getElementById('resultado-rodada').textContent = '🃏 Preparando nova rodada...';
            setTimeout(() => iniciarNovaRodada(), 1200);
        }, 2500);
    }
}

// ===== BOTÕES =====
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
