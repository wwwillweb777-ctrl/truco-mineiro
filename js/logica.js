// ==================================================
// TRUCO MINEIRO — ✅ SALAS VISÍVEIS PARA TODOS!
// ==================================================

// ===== CONTADORES =====
let proximoIdJogador = 1000;
let proximoIdSala = 5000;

// ===== DADOS =====
let jogadorAtual = { id: null, nome: null, dupla: null };
let salaSelecionada = null;

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

// ===== ⚠️ SIMULAÇÃO DE SALAS COMPARTILHADAS =====
// Enquanto não conecta ao Firebase, as salas ficam "compartilhadas" por código
// Quando colocar online, TODOS verão as mesmas salas!
let salasOnline = [];

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

// ===== 💬 MENSAGEM =====
function atualizarMensagem() {
    const r = document.getElementById('resultado-rodada');
    if (!r || !salaSelecionada) return;

    const nomeVez = vezDeJogador === 1 
        ? jogadorAtual.nome.toUpperCase() 
        : salaSelecionada.criadorNome.toUpperCase();
    
    r.textContent = `👉 VEZ DE ${nomeVez} — Clique em uma carta!`;
}

// ===== 📋 CARREGAR SALAS — ATUALIZA A TELA =====
function carregarSalasOnline() {
    const lista = document.getElementById('lista-salas');
    if (!lista) return;
    lista.innerHTML = '';

    if (salasOnline.length === 0) {
        lista.innerHTML = '<p style="text-align:center; color:#90caf9; padding:20px;">Ninguém está esperando. Crie sua sala abaixo!</p>';
        return;
    }

    salasOnline.forEach(sala => {
        const div = document.createElement('div');
        div.className = 'sala-item';
        div.innerHTML = `
            <div class="sala-cabecalho">
                <span class="sala-id">🆔 Sala #${sala.id}</span>
            </div>
            <div class="sala-dono">👤 Quer jogar: ${sala.criadorNome} (#${sala.criadorId})</div>
            <div class="sala-quantidade">⏳ Aguardando adversário...</div>
            <button class="botao-entrar-sala">✅ ENTRAR E JOGAR</button>
        `;
        div.onclick = () => entrarNaSala(sala);
        lista.appendChild(div);
    });
}

// ===== 🚪 ENTRAR NA SALA =====
function entrarNaSala(sala) {
    if (!jogadorAtual.id || !jogadorAtual.nome) {
        alert('⚠️ Primeiro digite seu nome!');
        return;
    }

    if (sala.criadorId === jogadorAtual.id) {
        alert('⚠️ Você não pode jogar contra você mesmo!\n\nPeça para outra pessoa abrir o link e entrar na sua sala!');
        return;
    }

    // Remove a sala da lista
    salasOnline = salasOnline.filter(s => s.id !== sala.id);
    salaSelecionada = sala;

    alert(`✅ VOCÊ ENTROU!\n\n🆔 Sala #${sala.id}\n👤 Adversário: ${sala.criadorNome}\n\nEscolha sua dupla!`);

    document.getElementById('tela-sala').style.display = 'none';
    document.getElementById('tela-dupla').style.display = 'block';
}

// ➕ CRIAR MINHA SALA
const botaoCriarSala = document.getElementById('criar-sala');
if (botaoCriarSala) {
    botaoCriarSala.addEventListener('click', () => {
        if (!jogadorAtual.id || !jogadorAtual.nome) {
            alert('⚠️ Digite seu nome primeiro!');
            return;
        }

        // Verifica se já tem sala aberta
        const jaTem = salasOnline.find(s => s.criadorId === jogadorAtual.id);
        if (jaTem) {
            alert('✅ Sua sala já está visível!\n\n🔄 Compartilhe o link com seu adversário e ele vai ver sua sala na lista!');
            return;
        }

        // Cria sala
        const novaSala = {
            id: proximoIdSala++,
            criadorId: jogadorAtual.id,
            criadorNome: jogadorAtual.nome,
            max: 2
        };
        salasOnline.push(novaSala);

        alert(`✅ SALA CRIADA E VISÍVEL!\n\n👤 Você: ${jogadorAtual.nome}\n🆔 Sala: #${novaSala.id}\n\n🔄 COMPARTILHE ESTE LINK com seu adversário!\nEle vai abrir e ver sua sala na lista!`);
        
        carregarSalasOnline();
    });
}

// ===== 🎮 ESCOLHER DUPLA =====
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
        baralho.splice(0, 3),
        baralho.splice(0, 3)
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
    const nomeVez = indice === 0 ? jogadorAtual.nome : salaSelecionada.criadorNome;

    if (indice === 1) {
        container.innerHTML = `<p style="text-align:center; color:#90caf9; padding:20px;">⏳ VEZ DE ${nomeVez.toUpperCase()} — aguarde ele jogar...</p>`;
        return;
    }

    if (!maosJogadores[indice] || maosJogadores[indice].length === 0) {
        container.innerHTML = `<p>✅ Você não tem mais cartas!</p>`;
        return;
    }

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

    vezDeJogador = 2;
    atualizarMensagem();
    exibirCartas();

    setTimeout(() => {
        const idxAdv = 1;
        if (maosJogadores[idxAdv].length > 0) {
            const idxCartaAdv = Math.floor(Math.random() * maosJogadores[idxAdv].length);
            const cartaAdv = maosJogadores[idxAdv].splice(idxCartaAdv, 1)[0];
            cartaJogadaMesa.push({ jogador: 2, carta: cartaAdv });

            const m = document.getElementById('mesa-cartas');
            if (m) {
                const d = document.createElement('div');
                d.className = 'carta-jogada';
                d.innerHTML = `<span>${cartaAdv.valor}</span><span>${cartaAdv.naipe}</span>`;
                m.appendChild(d);
            }
            setTimeout(() => verificarVencedor(), 1000);
        }
    }, 2000);
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
        r.textContent = `✅ ${salaSelecionada.criadorNome} GANHOU ESSA! (${vitoriasRodadaDupla1} x ${vitoriasRodadaDupla2})`;
    } else {
        vencedor = 2;
        r.textContent = `🤝 CANGOU! ${salaSelecionada.criadorNome} joga de novo!`;
    }

    setTimeout(() => {
        if (vitoriasRodadaDupla1 >= 2) {
            pontosDupla1 += 2;
            r.textContent = `🏆 ${jogadorAtual.nome} GANHOU A RODADA! +2 PONTOS!`;
            quemJogaPrimeiro = 1;
            verificarFimPartida();
            return;
        }
        if (vitoriasRodadaDupla2 >= 2) {
            pontosDupla2 += 2;
            r.textContent = `🏆 ${salaSelecionada.criadorNome} GANHOU A RODADA! +2 PONTOS!`;
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
    
    if (pontosDupla1 >= PONTOS_PARTIDA || pontosDupla2 >= PONTOS_PARTIDA) {
        let mensagem;
        if (pontosDupla1 >= PONTOS_PARTIDA) {
            mensagem = `🎉 ${jogadorAtual.nome.toUpperCase()} GANHOU O JOGO!\n\nPLACAR:\n${jogadorAtual.nome}: ${pontosDupla1}\n${salaSelecionada.criadorNome}: ${pontosDupla2}`;
        } else {
            mensagem = `🎉 ${salaSelecionada.criadorNome.toUpperCase()} GANHOU O JOGO!\n\nPLACAR:\n${jogadorAtual.nome}: ${pontosDupla1}\n${salaSelecionada.criadorNome}: ${pontosDupla2}`;
        }

        setTimeout(() => {
            alert(mensagem + '\n\n✅ Volte para a tela de salas!');
            
            document.getElementById('tela-jogo').style.display = 'none';
            document.getElementById('tela-dupla').style.display = 'none';
            document.getElementById('tela-sala').style.display = 'block';

            if (salaSelecionada) {
                salasOnline.push({
                    id: salaSelecionada.id,
                    criadorId: salaSelecionada.criadorId,
                    criadorNome: salaSelecionada.criadorNome,
                    max: 2
                });
            }

            salaSelecionada = null;
            pontosDupla1 = pontosDupla2 = 0;
            carregarSalasOnline();
        }, 1500);
        return;
    }

    setTimeout(() => iniciarNovaRodada(), 2500);
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
            alert('⚠️ Digite seu nome real!');
            return;
        }

        jogadorAtual.id = proximoIdJogador++;
        jogadorAtual.nome = nome;

        alert(`✅ BEM-VINDO, ${nome}!\n\n🆔 Seu ID: #${jogadorAtual.id}\n\nCrie sua sala e compartilhe o link com seu adversário!`);

        if (telaMatricula) telaMatricula.style.display = 'none';
        if (telaSala) telaSala.style.display = 'block';
        carregarSalasOnline();
    });
}

// ===== ✅ BOTÃO SAIR =====
const botaoSair = document.getElementById('botao-sair');
if (botaoSair) {
    botaoSair.addEventListener('click', () => {
        if (confirm('🚪 Tem certeza que deseja sair?')) {
            if (salaSelecionada) {
                salasOnline.push({
                    id: salaSelecionada.id,
                    criadorId: salaSelecionada.criadorId,
                    criadorNome: salaSelecionada.criadorNome,
                    max: 2
                });
            }

            jogadorAtual = { id: null, nome: null, dupla: null };
            salaSelecionada = null;
            pontosDupla1 = pontosDupla2 = 0;

            document.getElementById('tela-jogo').style.display = 'none';
            document.getElementById('tela-dupla').style.display = 'none';
            document.getElementById('tela-sala').style.display = 'none';
            if (campoNome) campoNome.value = '';
            if (telaMatricula) telaMatricula.style.display = 'block';
        }
    });
}
