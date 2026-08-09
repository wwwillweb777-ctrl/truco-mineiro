// ==================================================
// TRUCO MINEIRO — ✅ SALAS ONLINE! ENTRA E SALA DESAPARECE!
// ==================================================

// ===== CONTADOR DE ID ÚNICO =====
let proximoIdJogador = 1000;
let proximoIdSala = 5000;

// ===== DADOS DO JOGADOR =====
let jogadorAtual = { id: null, nome: null, dupla: null };
let salaSelecionada = null;

// ===== PLACAR E JOGO =====
let pontosDupla1 = 0;
let pontosDupla2 = 0;
let baralho = [];
let maosJogadores = [];
let cartaJogadaMesa = [];
let vitoriasRodadaDupla1 = 0;
let vitoriasRodadaDupla2 = 0;
let quemJogaPrimeiro = 1;
let vezDeJogador = 1;

const PONTOS_PARTIDA = 12;

// ===== 📋 SALAS ONLINE — SIMULADAS =====
let salasOnline = [
    { id: 5001, criadorId: 1001, nomeCriador: 'João', jogadores: [{id: 1001, nome: 'João'}], max: 2 },
    { id: 5002, criadorId: 1002, nomeCriador: 'Maria', jogadores: [{id: 1002, nome: 'Maria'}], max: 2 },
    { id: 5003, criadorId: 1003, nomeCriador: 'Pedro', jogadores: [{id: 1003, nome: 'Pedro'}], max: 2 }
];

// ===== VALORES E NAIPES =====
const valores = ['4', '5', '6', '7', 'Q', 'J', 'K', 'A', '2', '3'];
const naipes = ['♦', '♥', '♠', '♣'];

// ===== ✅ FORÇA DAS CARTAS =====
function calcularForca(valor, naipe) {
    if (valor === '4' && naipe === '♣') return 14;
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

function compararCartas(cartaA, cartaB) {
    const forcaA = calcularForca(cartaA.valor, cartaA.naipe);
    const forcaB = calcularForca(cartaB.valor, cartaB.naipe);
    if (forcaA > forcaB) return 1;
    if (forcaA < forcaB) return -1;
    return 0;
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

// ===== 📊 PLACAR =====
function atualizarPlacar() {
    const el1 = document.getElementById('pontos-dupla1');
    const el2 = document.getElementById('pontos-dupla2');
    if (el1) el1.textContent = pontosDupla1;
    if (el2) el2.textContent = pontosDupla2;
}

// ===== ✅ LIMPAR MESA =====
function limparMesa() {
    cartaJogadaMesa = [];
    const mesa = document.getElementById('mesa-cartas');
    if (mesa) mesa.innerHTML = '';
}

// ===== 💬 ATUALIZAR MENSAGEM =====
function atualizarMensagem() {
    const r = document.getElementById('resultado-rodada');
    if (!r) return;

    const nomeVez = vezDeJogador === 1 
        ? jogadorAtual.nome.toUpperCase() 
        : salaSelecionada.nomeCriador.toUpperCase();
    
    r.textContent = `👉 VEZ DE ${nomeVez} — Clique em uma carta!`;
}

// ===== 📋 CARREGAR SALAS NA TELA =====
function carregarSalasOnline() {
    const lista = document.getElementById('lista-salas');
    if (!lista) return;
    lista.innerHTML = '';

    salasOnline.forEach(sala => {
        const div = document.createElement('div');
        div.className = 'sala-item';
        div.innerHTML = `
            <div class="sala-cabecalho">
                <span class="sala-id">🆔 Sala #${sala.id}</span>
            </div>
            <div class="sala-dono">👤 Quer jogar: ${sala.nomeCriador} (#${sala.criadorId})</div>
            <div class="sala-quantidade">Aguardando adversário...</div>
            <button class="botao-entrar-sala">✅ ENTRAR E JOGAR</button>
        `;
        div.onclick = () => entrarNaSala(sala);
        lista.appendChild(div);
    });
}

// ===== 🚪 ENTRAR NA SALA — SALA DESAPARECE! =====
function entrarNaSala(sala) {
    if (!jogadorAtual.id || !jogadorAtual.nome) {
        alert('⚠️ Digite seu nome primeiro!');
        return;
    }

    // ✅ REMOVE A SALA DA LISTA → DESAPARECE!
    salasOnline = salasOnline.filter(s => s.id !== sala.id);
    salaSelecionada = sala;

    alert(`✅ VOCÊ ENTROU NA SALA!\n\n🆔 Sala #${sala.id}\n👤 Adversário: ${sala.nomeCriador}\n\nAgora escolha sua dupla!`);

    // Vai escolher dupla
    document.getElementById('tela-sala').style.display = 'none';
    document.getElementById('tela-dupla').style.display = 'block';
}

// ===== 🎮 ESCOLHER DUPLA E COMEÇAR =====
function escolherDupla(numeroDupla) {
    jogadorAtual.dupla = numeroDupla;
    pontosDupla1 = 0;
    pontosDupla2 = 0;
    quemJogaPrimeiro = 1;
    atualizarPlacar();
    iniciarNovaRodada();

    document.getElementById('tela-dupla').style.display = 'none';
    document.getElementById('tela-jogo').style.display = 'block';
}

// ===== 🔄 NOVA RODADA =====
function iniciarNovaRodada() {
    criarBaralho();
    maosJogadores = [
        baralho.splice(0, 3),  // Jogador 1
        baralho.splice(0, 3)   // Jogador 2
    ];
    
    vitoriasRodadaDupla1 = 0;
    vitoriasRodadaDupla2 = 0;
    limparMesa();
    vezDeJogador = quemJogaPrimeiro;
    
    exibirCartas();
    atualizarMensagem();
}

// ===== 🖼️ EXIBIR CARTAS =====
function exibirCartas() {
    const container = document.getElementById('cartas-jogador');
    if (!container) return;
    container.innerHTML = '';

    const indice = vezDeJogador - 1;
    let nomeVez = indice === 0 ? jogadorAtual.nome : salaSelecionada.nomeCriador;

    if (!maosJogadores[indice] || maosJogadores[indice].length === 0) {
        container.innerHTML = `<p>✅ ${nomeVez} não tem mais cartas!</p>`;
        return;
    }

    // Se for a vez do adversário → avisa
    if (indice === 1) {
        container.innerHTML = `<p>⏳ VEZ DE ${nomeVez.toUpperCase()} — é a vez dele jogar!</p>`;
        return;
    }

    // Mostra suas cartas
    maosJogadores[indice].forEach((carta, i) => {
        const div = document.createElement('div');
        div.className = 'carta';
        div.innerHTML = `<span class="valor">${carta.valor}</span><span class="naipe">${carta.naipe}</span>`;
        div.onclick = () => jogarCarta(indice, i);
        container.appendChild(div);
    });
}

// ===== 🃏 JOGAR CARTA =====
function jogarCarta(indiceJogador, indiceCarta) {
    const carta = maosJogadores[indiceJogador].splice(indiceCarta, 1)[0];
    cartaJogadaMesa.push({ jogador: indiceJogador + 1, carta: carta });

    const mesa = document.getElementById('mesa-cartas');
    if (mesa) {
        const div = document.createElement('div');
        div.className = 'carta-jogada';
        div.innerHTML = `<span>${carta.valor}</span><span>${carta.naipe}</span>`;
        mesa.appendChild(div);
    }

    // Se os dois jogaram → compara!
    if (cartaJogadaMesa.length === 2) {
        setTimeout(() => verificarVencedor(), 1000);
    } else {
        // Passa a vez
        vezDeJogador = 2;
        atualizarMensagem();
        exibirCartas();
        
        // SIMULA ADVERSÁRIO JOGANDO (no mesmo aparelho)
        setTimeout(() => {
            const idxAdversario = 1;
            if (maosJogadores[idxAdversario].length > 0) {
                const cartaAdversario = maosJogadores[idxAdversario].splice(0, 1)[0];
                cartaJogadaMesa.push({ jogador: 2, carta: cartaAdversario });
                
                const m = document.getElementById('mesa-cartas');
                if (m) {
                    const d = document.createElement('div');
                    d.className = 'carta-jogada';
                    d.innerHTML = `<span>${cartaAdversario.valor}</span><span>${cartaAdversario.naipe}</span>`;
                    m.appendChild(d);
                }
                setTimeout(() => verificarVencedor(), 1000);
            }
        }, 2000);
    }
}

// ===== 🏆 VERIFICAR VENCEDOR =====
function verificarVencedor() {
    const c1 = cartaJogadaMesa[0].carta;
    const c2 = cartaJogadaMesa[1].carta;
    const comp = compararCartas(c1, c2);
    
    let vencedor;
    const r = document.getElementById('resultado-rodada');

    if (comp === 1) {
        vencedor = 1;
        vitoriasRodadaDupla1++;
        r.textContent = `✅ ${jogadorAtual.nome} GANHOU ESSA! (${vitoriasRodadaDupla1} x ${vitoriasRodadaDupla2})`;
    } else if (comp === -1) {
        vencedor = 2;
        vitoriasRodadaDupla2++;
        r.textContent = `✅ ${salaSelecionada.nomeCriador} GANHOU ESSA! (${vitoriasRodadaDupla1} x ${vitoriasRodadaDupla2})`;
    } else {
        vencedor = 2;
        r.textContent = `🤝 CANGOU! ${salaSelecionada.nomeCriador} joga de novo!`;
    }

    setTimeout(() => {
        if (vitoriasRodadaDupla1 >= 2) {
            pontosDupla1 += 2;
            r.textContent = `🏆 VOCÊ GANHOU A RODADA! +2 PONTOS!`;
            quemJogaPrimeiro = 1;
            verificarFimPartida();
            return;
        }
        if (vitoriasRodadaDupla2 >= 2) {
            pontosDupla2 += 2;
            r.textContent = `🏆 ${salaSelecionada.nomeCriador} GANHOU A RODADA! +2 PONTOS!`;
            quemJogaPrimeiro = 2;
            verificarFimPartida();
            return;
        }

        limparMesa();
        vezDeJogador = vencedor;
        atualizarPlacar();
        atualizarMensagem();
        exibirCartas();
    }, 2000);
}

// ===== 🏁 FIM DE PARTIDA =====
function verificarFimPartida() {
    atualizarPlacar();
    if (pontosDupla1 >= PONTOS_PARTIDA) {
        alert(`🎉 VOCÊ GANHOU O JOGO!\n\nPLACAR:\nVOCÊ: ${pontosDupla1}\n${salaSelecionada.nomeCriador}: ${pontosDupla2}`);
    } else if (pontosDupla2 >= PONTOS_PARTIDA) {
        alert(`😔 ${salaSelecionada.nomeCriador} GANHOU O JOGO!\n\nPLACAR:\nVOCÊ: ${pontosDupla1}\n${salaSelecionada.nomeCriador}: ${pontosDupla2}`);
    } else {
        setTimeout(() => iniciarNovaRodada(), 2500);
    }
}

// ===== 🔘 BOTÃO MATRICULAR =====
const botaoEntrar = document.getElementById('botao-entrar');
const campoNome = document.getElementById('campo-nome');
const telaMatricula = document.getElementById('tela-matricula');
const telaSala = document.getElementById('tela-sala');

if (botaoEntrar) {
    botaoEntrar.addEventListener('click', () => {
        const nome = campoNome.value.trim();
        if (!nome) {
            alert('⚠️ Digite seu nome!');
            return;
        }

        jogadorAtual.id = proximoIdJogador++;
        jogadorAtual.nome = nome;

        alert(`✅ BEM-VINDO, ${nome}!\n\n🆔 Seu ID: #${jogadorAtual.id}\n\nEscolha uma sala abaixo!`);

        if (telaMatricula) telaMatricula.style.display = 'none';
        if (telaSala) telaSala.style.display = 'block';
        carregarSalasOnline();
    });
}

// ===== ✅ BOTÃO SAIR — FUNCIONANDO! =====
const botaoSair = document.getElementById('botao-sair');
if (botaoSair) {
    botaoSair.addEventListener('click', () => {
        if (confirm('🚪 Tem certeza que deseja sair?')) {
            // Reseta tudo
            jogadorAtual = { id: null, nome: null, dupla: null };
            salaSelecionada = null;
            pontosDupla1 = 0;
            pontosDupla2 = 0;
            
            // Volta salas que foram removidas
            salasOnline = [
                { id: 5001, criadorId: 1001, nomeCriador: 'João', jogadores: [{id: 1001, nome: 'João'}], max: 2 },
                { id: 5002, criadorId: 1002, nomeCriador: 'Maria', jogadores: [{id: 1002, nome: 'Maria'}], max: 2 },
                { id: 5003, criadorId: 1003, nomeCriador: 'Pedro', jogadores: [{id: 1003, nome: 'Pedro'}], max: 2 }
            ];

            // Volta para tela inicial
            document.getElementById('tela-jogo').style.display = 'none';
            document.getElementById('tela-dupla').style.display = 'none';
            document.getElementById('tela-sala').style.display = 'none';
            if (campoNome) campoNome.value = '';
            if (telaMatricula) telaMatricula.style.display = 'block';
        }
    });
}
