// ==================================================
// TRUCO MINEIRO — ✅ TUDO COM ID ÚNICO! SEM CONFUSÃO!
// ==================================================

// ===== CONTADOR DE ID ÚNICO — GERA NÚMERO NOVO AUTOMATICAMENTE =====
let proximoIdJogador = 1000;
let proximoIdSala = 5000;

// ===== DADOS DO JOGADOR ATUAL =====
let jogadorAtual = {
    id: null,
    nome: null,
    dupla: null // 1 ou 2
};

// ===== DADOS DA SALA =====
let salaSelecionada = null;
let modoJogo = null; // '2' ou '4'

// ===== PLACAR =====
let pontosDupla1 = 0;
let pontosDupla2 = 0;

// ===== DADOS DA PARTIDA =====
let baralho = [];
let maosJogadores = [];
let cartaJogadaMesa = [];
let vitoriasRodadaDupla1 = 0;
let vitoriasRodadaDupla2 = 0;
let quemJogaPrimeiro = 1;
let vezDeJogadorId = null; // ID do jogador que joga agora

const PONTOS_PARTIDA = 12;

// ===== 📋 SALAS ONLINE — TODAS COM ID ÚNICO =====
let salasOnline = [
    { id: 5001, criadorId: 1001, nomeCriador: 'William', modo: '2', jogadores: [{id: 1001, nome: 'William'}], max: 2 },
    { id: 5002, criadorId: 1002, nomeCriador: 'João', modo: '4', jogadores: [{id: 1002, nome: 'João'}], max: 4 },
    { id: 5003, criadorId: 1003, nomeCriador: 'Pedro S.', modo: '2', jogadores: [{id: 1003, nome: 'Pedro S.'}], max: 2 }
];

// ===== VALORES E NAIPES =====
const valores = ['4', '5', '6', '7', 'Q', 'J', 'K', 'A', '2', '3'];
const naipes = ['♦', '♥', '♠', '♣'];

// ===== ✅ FORÇA DAS CARTAS — TRUCO MINEIRO OFICIAL =====
function calcularForca(valor, naipe) {
    if (valor === '4' && naipe === '♣') return 14; // 1º ZAP
    if (valor === '7' && naipe === '♥') return 13;  // 2º 7 de Copas
    if (valor === 'A' && naipe === '♠') return 12;   // 3º ESPADILHA
    if (valor === '7' && naipe === '♦') return 11;  // 4º 7 de Ouros
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

// ===== COMPARAR CARTAS =====
function compararCartas(cartaA, cartaB) {
    const forcaA = calcularForca(cartaA.valor, cartaA.naipe);
    const forcaB = calcularForca(cartaB.valor, cartaB.naipe);
    if (forcaA > forcaB) return 1;
    if (forcaA < forcaB) return -1;
    return 0; // CANGOU
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

// ===== 📋 LISTAR SALAS ONLINE — MOSTRA ID E NOME =====
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
                <span class="sala-modo">Jogo de ${sala.modo} jogadores</span>
            </div>
            <div class="sala-dono">Criado por: ${sala.nomeCriador} (#${sala.criadorId})</div>
            <div class="sala-quantidade">${sala.jogadores.length}/${sala.max} jogadores prontos</div>
            <button class="botao-entrar-sala">✅ ENTRAR E JOGAR</button>
        `;
        div.onclick = () => entrarNaSala(sala);
        lista.appendChild(div);
    });
}

// ===== 🚪 ENTRAR NA SALA =====
function entrarNaSala(sala) {
    if (!jogadorAtual.id || !jogadorAtual.nome) {
        alert('⚠️ Primeiro informe seu nome!');
        return;
    }

    // Verifica se ainda cabe jogador
    if (sala.jogadores.length >= sala.max) {
        alert('❌ Sala cheia! Escolha outra!');
        return;
    }

    // Adiciona você na sala com SEU ID ÚNICO
    sala.jogadores.push({ id: jogadorAtual.id, nome: jogadorAtual.nome });
    salaSelecionada = sala;
    modoJogo = sala.modo;

    alert(`✅ VOCÊ ENTROU!\n\n🆔 Sua ID: #${jogadorAtual.id}\n👤 Seu nome: ${jogadorAtual.nome}\n🆔 Sala: #${sala.id}\n🎮 Jogo de ${modoJogo} jogadores\n\nBora jogar!`);

    // Vai escolher sua dupla
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
    maosJogadores = [];
    
    const quantidade = (modoJogo === '2') ? 2 : 4;
    for (let i = 0; i < quantidade; i++) {
        maosJogadores.push(baralho.splice(0, 3));
    }
    
    vitoriasRodadaDupla1 = 0;
    vitoriasRodadaDupla2 = 0;
    limparMesa();
    
    // Define quem começa
    vezDeJogadorId = salaSelecionada.jogadores[quemJogaPrimeiro === 1 ? 0 : 1].id;
    
    exibirCartas();
    atualizarMensagem();
}

// ===== 🖼️ EXIBIR CARTAS DO JOGADOR DA VEZ =====
function exibirCartas() {
    const container = document.getElementById('cartas-jogador');
    if (!container) return;
    container.innerHTML = '';

    // Encontra a posição do jogador atual na lista da sala
    const indiceJogador = salaSelecionada.jogadores.findIndex(j => j.id === jogadorAtual.id);
    if (indiceJogador === -1 || !maosJogadores[indiceJogador]) return;

    // Só mostra cartas se for a vez DELE jogar
    if (vezDeJogadorId !== jogadorAtual.id) {
        container.innerHTML = '<p class="aguarde">⏳ Aguarde a vez do outro jogador...</p>';
        return;
    }

    // Mostra as cartas para ele jogar
    maosJogadores[indiceJogador].forEach((carta, i) => {
        const div = document.createElement('div');
        div.className = 'carta';
        div.innerHTML = `<span class="valor">${carta.valor}</span><span class="naipe">${carta.naipe}</span>`;
        div.onclick = () => jogarCarta(indiceJogador, i);
        container.appendChild(div);
    });
}

// ===== 🃏 JOGAR CARTA =====
function jogarCarta(indiceJogador, indiceCarta) {
    // Só joga se for a vez dele
    if (salaSelecionada.jogadores[indiceJogador].id !== vezDeJogadorId) {
        alert('⚠️ Não é a sua vez!');
        return;
    }

    // Tira a carta da mão e coloca na mesa
    const carta = maosJogadores[indiceJogador].splice(indiceCarta, 1)[0];
    cartaJogadaMesa.push({
        jogadorId: vezDeJogadorId,
        jogadorNome: salaSelecionada.jogadores.find(j => j.id === vezDeJogadorId).nome,
        dupla: jogadorAtual.dupla,
        carta: carta
    });

    // Mostra na mesa
    const mesa = document.getElementById('mesa-cartas');
    if (mesa) {
        const div = document.createElement('div');
        div.className = 'carta-jogada';
        div.innerHTML = `
            <div class="quem-jogou">#${vezDeJogadorId}</div>
            <span>${carta.valor}</span>
            <span>${carta.naipe}</span>
        `;
        mesa.appendChild(div);
    }

    // TODO: continuar lógica de trocar a vez e verificar vencedor
    exibirCartas();
}

// ===== 💬 ATUALIZAR MENSAGEM =====
function atualizarMensagem() {
    const r = document.getElementById('resultado-rodada');
    if (!r) return;

    const jogadorVez = salaSelecionada.jogadores.find(j => j.id === vezDeJogadorId);
    if (jogadorVez && jogadorVez.id === jogadorAtual.id) {
        r.textContent = `👉 SUA VEZ! Você é o #${jogadorAtual.id} — clique em uma carta!`;
    } else if (jogadorVez) {
        r.textContent = `⏳ Vez de ${jogadorVez.nome} (#${jogadorVez.id}) — aguarde...`;
    }
}

// ===== 🔘 BOTÃO DE ENTRAR / CADASTRAR =====
const botaoEntrar = document.getElementById('botao-entrar');
const campoNome = document.getElementById('campo-nome');

if (botaoEntrar) {
    botaoEntrar.addEventListener('click', () => {
        const nome = campoNome.value.trim();
        if (!nome) {
            alert('⚠️ Digite seu nome!');
            return;
        }

        // GERA ID ÚNICO AUTOMATICAMENTE
        jogadorAtual.id = proximoIdJogador++;
        jogadorAtual.nome = nome;

        alert(`✅ BEM-VINDO!\n\n🆔 Sua ID ÚNICA: #${jogadorAtual.id}\n👤 Seu nome: ${nome}\n\nNinguém tem a mesma ID que você!`);

        // Mostra lista de salas
        document.getElementById('tela-matricula').style.display = 'none';
        document.getElementById('tela-sala').style.display = 'block';
        carregarSalasOnline();
    });
}
