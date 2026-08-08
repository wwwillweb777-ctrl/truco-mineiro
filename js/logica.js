// ===== VALORES E NAIPES =====
const valores = ['4', '5', '6', '7', 'Q', 'J', 'K', 'A', '2', '3'];
const naipes = ['♦', '♥', '♠', '♣'];

// ===== FORÇA DAS CARTAS =====
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

// ===== VARIÁVEIS =====
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
const TEMPO_ESPERA = 180000; // ⏱️ 3 MINUTOS
const PONTOS_PARTIDA = 12;

// ===== ELEMENTOS =====
const telaMatricula = document.getElementById('tela-matricula');
const telaModo = document.getElementById('tela-modo');
const telaMaquina1x1 = document.getElementById('tela-maquina-1x1');
const campoNome = document.getElementById('campo-nome');
const botaoMatricular = document.getElementById('botao-matricular');
const avisoMatricula = document.getElementById('aviso-matricula');
const meuIdMostrar = document.getElementById('meu-id');
const botaoModoMaquina1x1 = document.getElementById('modo-maquina-1x1');

// ===== 🚩 NOVA REGRA: SÓ LIMPA MESA NO FIM DA RODADA =====
function limparMesa() {
    document.getElementById('carta-jogada-jogador').innerHTML = '';
    document.getElementById('carta-jogada-joao').innerHTML = '';
}

// ===== PARAR CONTAGEM =====
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

// ===== ✅ NOVA RODADA — MESA LIMPA SÓ AQUI =====
function iniciarNovaRodada() {
    limparContagemEspera();
    cartaSelecionada = null;
    cartaJogadaJogador = null;
    cartaJogadaJoao = null;

    distribuirCartas();
    vezDeJogar = quemJogaPrimeiro;
    podeJogar = (vezDeJogar === 'jogador');

    limparMesa(); // ✅ SÓ LIMPA AQUI — FIM DA RODADA!

    if (vezDeJogar === 'jogador') {
        document.getElementById('resultado-rodada').textContent = '👉 SUA VEZ! Clique na carta!';
        iniciarContagemEspera();
    } else {
        document.getElementById('resultado-rodada').textContent = '⏳ João joga primeiro...';
        setTimeout(() => joaoJoga(), 1800);
    }

    exibirCartasJogador();
    exibirCartasJoao();
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
        div.onclick = function() {
            // ✅ SÓ JOGA SE FOR REALMENTE SUA VEZ
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

// ===== ✅ VOCÊ JOGA — SEM LIMPAR A MESA =====
function jogarCarta() {
    limparContagemEspera();
    podeJogar = false;

    cartaJogadaJogador = cartasJogador.splice(cartaSelecionada, 1)[0];
    document.getElementById('carta-jogada-jogador').innerHTML = 
        `<span>${cartaJogadaJogador.valor}</span><span>${cartaJogadaJogador.naipe}</span>`;
    document.getElementById('resultado-rodada').textContent = 
        `🃏 Você jogou ${cartaJogadaJogador.valor} de ${cartaJogadaJogador.naipe}`;

    setTimeout(() => joaoJoga(), 1500); // ✅ JOÃO SÓ JOGA DEPOIS DE VOCÊ
}

// ===== ✅ JOÃO JOGA — SEM LIMPAR A MESA =====
function joaoJoga() {
    // ✅ SEGURANÇA: SÓ JOÃO JOGA SE FOR A VEZ DELE
    if (vezDeJogar !== 'joao') {
        return;
    }

    let indiceEscolhido = -1;

    if (cartaJogadaJogador) {
        // TENTA MATAR A SUA CARTA
        let menorQueGanha = null;
        for (let i = 0; i < cartasJoao.length; i++) {
            if (cartasJoao[i].forca > cartaJogadaJogador.forca) {
                if (!menorQueGanha || cartasJoao[i].forca < menorQueGanha.forca) {
                    menorQueGanha = cartasJoao[i];
                    indiceEscolhido = i;
                }
            }
        }
        // SE NÃO CONSEGUE, JOGA A MAIS FRACA
        if (indiceEscolhido === -1) {
            let menorForca = Math.min(...cartasJoao.map(c => c.forca));
            indiceEscolhido = cartasJoao.findIndex(c => c.forca === menorForca);
        }
    } else {
        // SE JOÃO JOGA PRIMEIRO
        let menorForca = Math.min(...cartasJoao.map(c => c.forca));
        indiceEscolhido = cartasJoao.findIndex(c => c.forca === menorForca);
    }

    cartaJogadaJoao = cartasJoao.splice(indiceEscolhido, 1)[0];
    document.getElementById('carta-jogada-joao').innerHTML = 
        `<span>${cartaJogadaJoao.valor}</span><span>${cartaJogadaJoao.naipe}</span>`;
    document.getElementById('resultado-rodada').textContent = 
        `🃏 João jogou ${cartaJogadaJoao.valor} de ${cartaJogadaJoao.naipe}`;

    setTimeout(() => verificarVencedor(), 1200);
}

// ===== ✅ VERIFICAR VENCEDOR — MESA CONTINUA COM AS CARTAS! =====
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
        // ✅ EMPATE = CANGOU → QUEM JOGOU POR ÚLTIMO VENCE
        vencedor = vezDeJogar;
        document.getElementById('resultado-rodada').textContent = 
            '🤝 EMPATE! CANGOU! Quem jogou por último vence!';
    }

    setTimeout(() => {
        // ===== ✅ ALGUÉM FEZ 2 → FIM DA RODADA! SÓ AGORA LIMPA! =====
        if (vitoriasRodadaJogador === 2) {
            pontosJogador += 2;
            document.getElementById('resultado-rodada').textContent = 
                `🏆 VOCÊ FEZ 2! GANHOU A RODADA! +2 PONTOS!`;
            quemJogaPrimeiro = 'jogador'; // ✅ VOCÊ JOGA PRIMEIRO NA NOVA RODADA
            verificarFimPartida();
            return;
        }
        if (vitoriasRodadaJoao === 2) {
            pontosJoao += 2;
            document.getElementById('resultado-rodada').textContent = 
                `😔 JOÃO FEZ 2! GANHOU A RODADA! +2 PONTOS!`;
            quemJogaPrimeiro = 'joao'; // ✅ ELE JOGA PRIMEIRO NA NOVA RODADA
            verificarFimPartida();
            return;
        }

        // ===== ✅ AINDA NÃO FEZ 2 → CONTINUA! QUEM GANHA JOGA A PRÓXIMA =====
        vezDeJogar = vencedor; // ✅ QUEM GANHOU JOGA A PRÓXIMA CARTA EM CIMA
        podeJogar = (vezDeJogar === 'jogador'); // ✅ LIBERA SE FOR SUA VEZ

        // ✅ A MESA NÃO É LIMPA! AS CARTAS FICAM LÁ!

        exibirCartasJogador();
        exibirCartasJoao();

        if (vezDeJogar === 'jogador') {
            document.getElementById('resultado-rodada').textContent += ' — SUA VEZ! Clique na carta!';
            iniciarContagemEspera();
        } else {
            document.getElementById('resultado-rodada').textContent += ' — João jogando...';
            setTimeout(() => joaoJoga(), 1800);
        }
    }, 2000);
}

// ===== FIM DA RODADA → NOVA RODADA COM MESA LIMPA =====
function verificarFimPartida() {
    atualizarPlacar();

    if (pontosJogador >= PONTOS_PARTIDA) {
        setTimeout(() => {
            alert(`🎉 VOCÊ VENCEU A PARTIDA!\nPlacar Final:\nVocê: ${pontosJogador} x ${pontosJoao} João`);
        }, 600);
    } else if (pontosJoao >= PONTOS_PARTIDA) {
        setTimeout(() => {
            alert(`😔 JOÃO VENCEU A PARTIDA!\nPlacar Final:\nVocê: ${pontosJogador} x ${pontosJoao} João`);
        }, 600);
    } else {
        setTimeout(() => {
            document.getElementById('resultado-rodada').textContent = '🃏 NOVA RODADA!';
            setTimeout(() => iniciarNovaRodada(), 1500);
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
