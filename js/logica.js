// ===== TRUCO MINEIRO — ARQUIVO 1 COMPLETO E CORRIGIDO =====

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
let indiceArrastado = null;
let quemJogaPrimeiro = 'jogador';
let vezDeJogar = 'jogador';
let podeJogar = true;
let rodadaEmAndamento = false;

// ===== VALORES E NAIPES DO BARALHO =====
const valores = ['4', '5', '6', '7', 'Q', 'J', 'K', 'A', '2', '3'];
const naipes = ['♦', '♥', '♠', '♣'];

// ===== ✅ FORÇA DAS CARTAS — TRUCO MINEIRO NA ORDEM CERTA! =====
function calcularForca(valor, naipe) {
    if (valor === '4' && naipe === '♣') return 14; // 🥇 ZAP — 4 de Paus (A MAIOR)
    if (valor === '7' && naipe === '♥') return 13;  // 🥈 7 de Copas
    if (valor === 'A' && naipe === '♠') return 12;   // 🥉 ESPADILHA — Ás de Espadas
    if (valor === '7' && naipe === '♦') return 11;  // 🏅 7 de Ouros
    if (valor === '3') return 10;                     // 3 (comum)
    if (valor === '2') return 9;                      // 2 (comum)
    if (valor === 'A') return 8;                       // Ás (comum)
    if (valor === 'K') return 7;                       // Rei
    if (valor === 'J') return 6;                       // Valete
    if (valor === 'Q') return 5;                       // Dama
    if (valor === '7') return 4;                       // 7 (comum)
    if (valor === '6') return 3;                       // 6
    if (valor === '5') return 2;                       // 5
    if (valor === '4') return 1;                       // 4 (comum)
    return 0;
}

// ===== ✅ COMPARA DUAS CARTAS E DIZ QUEM VENCE =====
function compararCartas(cartaA, cartaB) {
    const forcaA = calcularForca(cartaA.valor, cartaA.naipe);
    const forcaB = calcularForca(cartaB.valor, cartaB.naipe);
    
    if (forcaA > forcaB) return 1;   // Carta A vence
    if (forcaA < forcaB) return -1;  // Carta B vence
    return 0;                         // 🤝 CANGOU — empate!
}

// ===== CRIAR EMBARALHAR AS CARTAS =====
function criarBaralho() {
    baralho = [];
    for (let v = 0; v < valores.length; v++) {
        for (let n = 0; n < naipes.length; n++) {
            baralho.push({
                valor: valores[v],
                naipe: naipes[n],
                forca: calcularForca(valores[v], naipes[n])
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

// ===== ATUALIZAR PLACAR NA TELA =====
function atualizarPlacar() {
    const placarJogadorEl = document.getElementById('placar-jogador');
    const placarJoaoEl = document.getElementById('placar-joao');
    if (placarJogadorEl) placarJogadorEl.textContent = pontosJogador;
    if (placarJoaoEl) placarJoaoEl.textContent = pontosJoao;
}

// ===== LIMPAR A MESA =====
function limparMesa() {
    const cartaJogadorEl = document.getElementById('carta-jogada-jogador');
    const cartaJoaoEl = document.getElementById('carta-jogada-joao');
    if (cartaJogadorEl) cartaJogadorEl.innerHTML = '';
    if (cartaJoaoEl) cartaJoaoEl.innerHTML = '';
    cartaJogadaJogador = null;
    cartaJogadaJoao = null;
}

// ===== EXIBIR MINHAS CARTAS NA MÃO =====
function exibirCartasJogador() {
    const container = document.getElementById('minhas-cartas');
    if (!container) return;
    container.innerHTML = '';
    
    cartasJogador.forEach((carta, indice) => {
        const cartaEl = document.createElement('div');
        cartaEl.className = 'carta';
        cartaEl.dataset.indice = indice;
        cartaEl.innerHTML = `
            <span class="carta-valor">${carta.valor}</span>
            <span class="carta-naipe">${carta.naipe}</span>
        `;
        cartaEl.onclick = function() {
            document.querySelectorAll('.carta').forEach(c => c.classList.remove('selecionada'));
            this.classList.add('selecionada');
            cartaSelecionada = indice;
        };
        container.appendChild(cartaEl);
    });
}

// ===== EXIBIR CARTAS DO JOÃO (ESCONDIDAS) =====
function exibirCartasJoao() {
    const container = document.getElementById('cartas-joao');
    if (!container) return;
    container.innerHTML = '';
    
    cartasJoao.forEach(() => {
        const cartaEl = document.createElement('div');
        cartaEl.className = 'carta costa';
        cartaEl.innerHTML = '🃏';
        container.appendChild(cartaEl);
    });
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

// ===== ⏱️ SISTEMA DE TEMPO =====
function pararTempo() {
    if (temporizadorEspera) { clearTimeout(temporizadorEspera); temporizadorEspera = null; }
}

function iniciarContagem() {
    pararTempo();
    podeJogar = true;
    temporizadorEspera = setTimeout(() => {
        if (vezDeJogar === 'jogador' && cartasJogador.length > 0) {
            pararTempo();
            cartaSelecionada = Math.floor(Math.random() * cartasJogador.length);
            jogarCarta();
        }
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

// ===== ✅ NOVA RODADA =====
function iniciarNovaRodada() {
    pararTempo();
    cartaSelecionada = null;
    cartaJogadaJogador = null;
    cartaJogadaJoao = null;
    vitoriasRodadaJogador = 0;
    vitoriasRodadaJoao = 0;

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

// ===== ✅ VOCÊ JOGA → DEPOIS PASSA PRO JOÃO =====
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
    document.getElementById('carta-jogada-jogador').innerHTML =
        `<span>${cartaJogadaJogador.valor}</span><span>${cartaJogadaJogador.naipe}</span>`;
    document.getElementById('resultado-rodada').textContent =
        `🃏 Você jogou ${cartaJogadaJogador.valor} de ${cartaJogadaJogador.naipe}`;

    vezDeJogar = 'joao';
    setTimeout(() => joaoJoga(), 1500);
}

// ===== ✅ JOÃO JOGA =====
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
    document.getElementById('carta-jogada-joao').innerHTML =
        `<span>${cartaJogadaJoao.valor}</span><span>${cartaJogadaJoao.naipe}</span>`;
    document.getElementById('resultado-rodada').textContent =
        `🃏 João jogou ${cartaJogadaJoao.valor} de ${cartaJogadaJoao.naipe}`;

    setTimeout(() => verificarVencedor(), 1200);
}

// ===== ✅ VERIFICA VENCEDOR — COM TODAS AS REGRAS! =====
function verificarVencedor() {
    const comparacao = compararCartas(cartaJogadaJogador, cartaJogadaJoao);
    let vencedor;

    if (comparacao === 1) {
        vitoriasRodadaJogador++;
        vencedor = 'jogador';
        document.getElementById('resultado-rodada').textContent =
            `✅ VOCÊ GANHOU ESSA! (${vitoriasRodadaJogador} x ${vitoriasRodadaJoao})`;
    } else if (comparacao === -1) {
        vitoriasRodadaJoao++;
        vencedor = 'joao';
        document.getElementById('resultado-rodada').textContent =
            `❌ JOÃO GANHOU ESSA! (${vitoriasRodadaJogador} x ${vitoriasRodadaJoao})`;
    } else {
        // ===== 🤝 CANGOU — NÃO CONTA VITÓRIA! SÓ DECIDE QUEM JOGA! =====
        vencedor = (vezDeJogar === 'jogador') ? 'joao' : 'jogador';

        // ===== ✅ REGRA DE OURO: 1 VITÓRIA + EMPATE = GANHOU A RODADA! =====
        if (vitoriasRodadaJogador === 1 && vitoriasRodadaJoao === 0) {
            setTimeout(() => {
                pontosJogador += 2;
                document.getElementById('resultado-rodada').textContent =
                    `🏆 VOCÊ GANHOU A RODADA! Empate = você já tinha ponto! +2 PONTOS! → ${pontosJogador} x ${pontosJoao}`;
                quemJogaPrimeiro = 'jogador';
                verificarFimPartida();
            }, 1500);
            return;
        }
        if (vitoriasRodadaJoao === 1 && vitoriasRodadaJogador === 0) {
            setTimeout(() => {
                pontosJoao += 2;
                document.getElementById('resultado-rodada').textContent =
                    `😔 JOÃO GANHOU A RODADA! Empate = ele já tinha ponto! +2 PONTOS! → ${pontosJogador} x ${pontosJoao}`;
                quemJogaPrimeiro = 'joao';
                verificarFimPartida();
            }, 1500);
            return;
        }

        // Só se estiver 0x0 → empate só decide quem joga
        document.getElementById('resultado-rodada').textContent =
            `🤝 CANGOU! Quem desempata joga primeiro!`;
    }

    setTimeout(() => {
        // ===== ✅ FEZ 2 VITÓRIAS → FECHA RODADA! =====
        if (vitoriasRodadaJogador >= 2) {
            pontosJogador += 2;
            document.getElementById('resultado-rodada').textContent =
                `🏆 VOCÊ GANHOU A RODADA! +2 PONTOS! → PLACAR: ${pontosJogador} x ${pontosJoao}`;
            quemJogaPrimeiro = 'jogador';
            verificarFimPartida();
            return;
        }
        if (vitoriasRodadaJoao >= 2) {
            pontosJoao += 2;
            document.getElementById('resultado-rodada').textContent =
                `😔 JOÃO GANHOU A RODADA! +2 PONTOS! → PLACAR: ${pontosJogador} x ${pontosJoao}`;
            quemJogaPrimeiro = 'joao';
            verificarFimPartida();
            return;
        }

        // ===== ✅ SÓ VAI PARA 3ª SE ESTIVER 1 x 1 =====
        if (vitoriasRodadaJogador === 1 && vitoriasRodadaJoao === 1) {
            document.getElementById('resultado-rodada').textContent =
                `⚡ 3ª E ÚLTIMA! Quem ganhar leva! (1 x 1)`;
        }

        // ===== ✅ CONTINUA A RODADA =====
        vezDeJogar = vencedor;
        limparMesa();

        if (vezDeJogar === 'jogador') {
            podeJogar = true;
            document.getElementById('resultado-rodada').textContent += ' — SUA VEZ! 3 minutos!';
            iniciarContagem();
        } else {
            podeJogar = false;
            document.getElementById('resultado-rodada').textContent += ' — João jogando...';
            setTimeout(() => joaoJoga(), 1800);
        }
    }, 2000);
}

// ===== ✅ FIM DO JOGO — 12 PONTOS =====
function verificarFimPartida() {
    pararTempo();
    atualizarPlacar();

    if (pontosJogador >= PONTOS_PARTIDA) {
        setTimeout(() => alert(`🎉 VOCÊ GANHOU O JOGO!\n\nPLACAR FINAL:\nVOCÊ: ${pontosJogador}\nJOÃO: ${pontosJoao}`), 800);
    } else if (pontosJoao >= PONTOS_PARTIDA) {
        setTimeout(() => alert(`😔 JOÃO GANHOU O JOGO!\n\nPLACAR FINAL:\nVOCÊ: ${pontosJogador}\nJOÃO: ${pontosJoao}`), 800);
    } else {
        setTimeout(() => {
            document.getElementById('resultado-rodada').textContent = '🃏 NOVA RODADA! Quem ganhou começa!';
            setTimeout(() => iniciarNovaRodada(), 1500);
        }, 2500);
    }
}

// ===== BOTÕES =====
document.getElementById('botao-nova-rodada').addEventListener('click', function() {
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

document.getElementById('botao-sair').addEventListener('click', function() {
    pararTempo();
    if (confirm('🚪 Sair do jogo?')) {
        telaMaquina1x1.style.display = 'none';
        telaMatricula.style.display = 'block';
        campoNome.value = '';
        avisoMatricula.textContent = '';
    }
});
// ===== LIMPAR MESA =====
function limparMesa() {
    const cartaJogadorEl = document.getElementById('carta-jogada-jogador');
    const cartaJoaoEl = document.getElementById('carta-jogada-joao');
    if (cartaJogadorEl) cartaJogadorEl.innerHTML = '';
    if (cartaJoaoEl) cartaJoaoEl.innerHTML = '';
    cartaJogadaJogador = null;
    cartaJogadaJoao = null;
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
            if (cartasJogador.length > 0) {
                const indiceAleatorio = Math.floor(Math.random() * cartasJogador.length);
                cartaSelecionada = indiceAleatorio;
                jogarCarta();
            }
        }, 1500);
    }, TEMPO_ESPERA);
}

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

// ===== DISTRIBUIR CARTAS =====
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

// ===== ATUALIZAR PLACAR =====
function atualizarPlacar() {
    const placarJogadorEl = document.getElementById('pontos-jogador');
    const placarJoaoEl = document.getElementById('pontos-joao');
    if (placarJogadorEl) placarJogadorEl.textContent = pontosJogador;
    if (placarJoaoEl) placarJoaoEl.textContent = pontosJoao;
}

// ===== EXIBIR CARTAS DO JOGADOR NA TELA =====
function exibirCartasJogador() {
    const container = document.getElementById('suas-cartas');
    if (!container) return;
    container.innerHTML = '';
    
    cartasJogador.forEach((carta, indice) => {
        if (!carta) return;
        const div = document.createElement('div');
        div.className = 'carta';
        div.innerHTML = `<span class="valor">${carta.valor}</span><span class="naipe">${carta.naipe}</span>`;
        
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

// ===== EXIBIR CARTAS DO JOÃO (ESCONDIDAS) =====
function exibirCartasJoao() {
    const container = document.getElementById('cartas-joao');
    if (!container) return;
    container.innerHTML = '';
    
    cartasJoao.forEach(() => {
        const div = document.createElement('div');
        div.className = 'carta costa';
        div.innerHTML = '<span>?</span><span class="naipe">🃏</span>';
        container.appendChild(div);
    });
}
// ===== ⏱️ SISTEMA DE TEMPO =====
let temporizador = null;
const TEMPO_LIMITE = 60;

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
    }, TEMPO_LIMITE * 1000);
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

// ===== ✅ NOVA RODADA =====
function iniciarNovaRodada() {
    pararTempo();
    cartaSelecionada = null;
    cartaJogadaJogador = null;
    cartaJogadaJoao = null;
    vitoriasRodadaJogador = 0;
    vitoriasRodadaJoao = 0;

    distribuirCartas();
    vezDeJogar = quemJogaPrimeiro;
    limparMesa();

    if (vezDeJogar === 'jogador') {
        podeJogar = true;
        document.getElementById('resultado-rodada').textContent = '👉 SUA VEZ! Você tem 1 minuto!';
        iniciarContagem();
    } else {
        podeJogar = false;
        document.getElementById('resultado-rodada').textContent = '⏳ JOÃO JOGA PRIMEIRO...';
        setTimeout(() => joaoJoga(), 1800);
    }

    exibirCartasJogador();
    exibirCartasJoao();
}

// ===== ✅ VOCÊ JOGA → DEPOIS PASSA PRO JOÃO =====
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
    document.getElementById('carta-jogada-jogador').innerHTML =
        `<span>${cartaJogadaJogador.valor}</span><span>${cartaJogadaJogador.naipe}</span>`;
    document.getElementById('resultado-rodada').textContent =
        `🃏 Você jogou ${cartaJogadaJogador.valor} de ${cartaJogadaJogador.naipe}`;

    vezDeJogar = 'joao';
    setTimeout(() => joaoJoga(), 1500);
}

// ===== ✅ JOÃO JOGA =====
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
    document.getElementById('carta-jogada-joao').innerHTML =
        `<span>${cartaJogadaJoao.valor}</span><span>${cartaJogadaJoao.naipe}</span>`;
    document.getElementById('resultado-rodada').textContent =
        `🃏 João jogou ${cartaJogadaJoao.valor} de ${cartaJogadaJoao.naipe}`;

    setTimeout(() => verificarVencedor(), 1200);
}

// ===== ✅ VERIFICA VENCEDOR — COM TODAS AS REGRAS! =====
function verificarVencedor() {
    const comparacao = compararCartas(cartaJogadaJogador, cartaJogadaJoao);
    let vencedor;

    if (comparacao === 1) {
        vitoriasRodadaJogador++;
        vencedor = 'jogador';
        document.getElementById('resultado-rodada').textContent =
            `✅ VOCÊ GANHOU ESSA! (${vitoriasRodadaJogador} x ${vitoriasRodadaJoao})`;
    } else if (comparacao === -1) {
        vitoriasRodadaJoao++;
        vencedor = 'joao';
        document.getElementById('resultado-rodada').textContent =
            `❌ JOÃO GANHOU ESSA! (${vitoriasRodadaJogador} x ${vitoriasRodadaJoao})`;
    } else {
        // ===== 🤝 CANGOU — NÃO CONTA VITÓRIA! SÓ DECIDE QUEM JOGA! =====
        vencedor = (vezDeJogar === 'jogador') ? 'joao' : 'jogador';

        // ===== ✅ REGRA DE OURO: 1 VITÓRIA + EMPATE = GANHOU A RODADA! =====
        if (vitoriasRodadaJogador === 1 && vitoriasRodadaJoao === 0) {
            setTimeout(() => {
                pontosJogador += 2;
                document.getElementById('resultado-rodada').textContent =
                    `🏆 VOCÊ GANHOU A RODADA! Empate = você já tinha ponto! +2 PONTOS! → ${pontosJogador} x ${pontosJoao}`;
                quemJogaPrimeiro = 'jogador';
                verificarFimPartida();
            }, 1500);
            return;
        }
        if (vitoriasRodadaJoao === 1 && vitoriasRodadaJogador === 0) {
            setTimeout(() => {
                pontosJoao += 2;
                document.getElementById('resultado-rodada').textContent =
                    `😔 JOÃO GANHOU A RODADA! Empate = ele já tinha ponto! +2 PONTOS! → ${pontosJogador} x ${pontosJoao}`;
                quemJogaPrimeiro = 'joao';
                verificarFimPartida();
            }, 1500);
            return;
        }

        // Só se estiver 0x0 → empate só decide quem joga
        document.getElementById('resultado-rodada').textContent =
            `🤝 CANGOU! Quem desempata joga primeiro!`;
    }

    setTimeout(() => {
        // ===== ✅ FEZ 2 VITÓRIAS → FECHA RODADA! =====
        if (vitoriasRodadaJogador >= 2) {
            pontosJogador += 2;
            document.getElementById('resultado-rodada').textContent =
                `🏆 VOCÊ GANHOU A RODADA! +2 PONTOS! → PLACAR: ${pontosJogador} x ${pontosJoao}`;
            quemJogaPrimeiro = 'jogador';
            verificarFimPartida();
            return;
        }
        if (vitoriasRodadaJoao >= 2) {
            pontosJoao += 2;
            document.getElementById('resultado-rodada').textContent =
                `😔 JOÃO GANHOU A RODADA! +2 PONTOS! → PLACAR: ${pontosJogador} x ${pontosJoao}`;
            quemJogaPrimeiro = 'joao';
            verificarFimPartida();
            return;
        }

        // ===== ✅ SÓ VAI PARA 3ª SE ESTIVER 1 x 1 =====
        if (vitoriasRodadaJogador === 1 && vitoriasRodadaJoao === 1) {
            document.getElementById('resultado-rodada').textContent =
                `⚡ 3ª E ÚLTIMA! Quem ganhar leva! (1 x 1)`;
        }

        // ===== ✅ CONTINUA A RODADA =====
        vezDeJogar = vencedor;
        limparMesa();

        if (vezDeJogar === 'jogador') {
            podeJogar = true;
            document.getElementById('resultado-rodada').textContent += ' — SUA VEZ! 1 minuto!';
            iniciarContagem();
        } else {
            podeJogar = false;
            document.getElementById('resultado-rodada').textContent += ' — João jogando...';
            setTimeout(() => joaoJoga(), 1800);
        }
    }, 2000);
}

// ===== ✅ FIM DO JOGO — 12 PONTOS =====
function verificarFimPartida() {
    pararTempo();
    atualizarPlacar();

    if (pontosJogador >= 12) {
        setTimeout(() => alert(`🎉 VOCÊ GANHOU O JOGO!\n\nPLACAR FINAL:\nVOCÊ: ${pontosJogador}\nJOÃO: ${pontosJoao}`), 800);
    } else if (pontosJoao >= 12) {
        setTimeout(() => alert(`😔 JOÃO GANHOU O JOGO!\n\nPLACAR FINAL:\nVOCÊ: ${pontosJogador}\nJOÃO: ${pontosJoao}`), 800);
    } else {
        setTimeout(() => {
            document.getElementById('resultado-rodada').textContent = '🃏 NOVA RODADA! Quem ganhou começa!';
            setTimeout(() => iniciarNovaRodada(), 1500);
        }, 2500);
    }
}

// ===== BOTÕES =====
document.getElementById('botao-nova-rodada').addEventListener('click', function() {
    if (pontosJogador >= 12 || pontosJoao >= 12) {
        pararTempo();
        pontosJogador = 0;
        pontosJoao = 0;
        atualizarPlacar();
        iniciarNovaRodada();
    } else {
        alert('⚠️ Termine a rodada primeiro!');
    }
});

document.getElementById('botao-sair').addEventListener('click', function() {
    pararTempo();
    if (confirm('🚪 Sair do jogo?')) {
        telaMaquina1x1.style.display = 'none';
        telaMatricula.style.display = 'block';
        campoNome.value = '';
        avisoMatricula.textContent = '';
    }
});
