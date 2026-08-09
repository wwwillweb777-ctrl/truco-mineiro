// ==================================================
// TRUCO MINEIRO — ✅ VERSÃO CORRIGIDA
// ==================================================

// ⚠️ ESPERAR A PÁGINA CARREGAR TUDO PRIMEIRO
document.addEventListener('DOMContentLoaded', function() {

    // ✅ PEGAR O FIREBASE QUE ESTÁ NO index.html
    const db = firebase.database();

    // ===== CONTADORES =====
    let proximoIdJogador = 1000;
    let proximoIdSala = 5000;

    // ===== DADOS =====
    let jogadorAtual = { id: null, nome: null, dupla: null };
    let salaSelecionada = null;
    let salasOnline = [];

    let pontosDupla1 = 0;
    let pontosDupla2 = 0;
    let baralho = [];
    let cartasJogador = [];
    let cartasAdversario = [];
    let cartaSelecionada = null;
    let cartaJogadaJogador = null;
    let cartaJogadaAdversario = null;
    let vitoriasRodadaJogador = 0;
    let vitoriasRodadaAdversario = 0;
    let quemJogaPrimeiro = 'criador';
    let vezDeJogar = 'criador';
    let podeJogar = true;

    const PONTOS_PARTIDA = 12;

    // ===== VALORES E NAIPES =====
    const valores = ['4', '5', '6', '7', 'Q', 'J', 'K', 'A', '2', '3'];
    const naipes = ['♦', '♥', '♠', '♣'];

    // ===== ✅ FORÇA DAS CARTAS =====
    function calcularForca(valor, naipe) {
        if (valor === '4' && naipe === '♣') return 14; // Zap
        if (valor === '7' && naipe === '♥') return 13;  // 7 de Copas
        if (valor === 'A' && naipe === '♠') return 12;  // Espadilha
        if (valor === '7' && naipe === '♦') return 11;  // 7 de Ouro
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
        return 0; // Cangou
    }

    // ===== 📋 CARREGAR SALAS DO FIREBASE =====
    function carregarSalasOnline() {
        const lista = document.getElementById('lista-salas');
        if (!lista) return;

        db.ref('salas/').on('value', (snapshot) => {
            lista.innerHTML = '';
            salasOnline = [];

            const dados = snapshot.val();
            if (!dados) {
                lista.innerHTML = '<p style="text-align:center; color:#90caf9; padding:20px;">Ninguém está esperando. Crie sua sala!</p>';
                return;
            }

            Object.values(dados).forEach(sala => {
                if (!sala.ocupada) {
                    salasOnline.push(sala);
                    const div = document.createElement('div');
                    div.style = "border:1px solid #ccc; padding:15px; margin:10px; border-radius:8px; cursor:pointer; background:#2a2a2a; color:white;";
                    div.innerHTML = `
                        <div style="font-weight:bold; margin-bottom:5px;">🆔 Sala #${sala.id}</div>
                        <div>👤 Quer jogar: ${sala.nome} (#${sala.jogadorId})</div>
                        <div style="color:#90caf9; margin-top:5px;">⏳ Aguardando adversário...</div>
                        <div style="margin-top:10px; color:lightgreen;">✅ ENTRAR E JOGAR</div>
                    `;
                    div.onclick = () => entrarNaSala(sala);
                    lista.appendChild(div);
                }
            });
        });
    }

    // ===== ➕ CRIAR SALA =====
    async function criarSala() {
        if (!jogadorAtual.id || !jogadorAtual.nome) {
            alert('⚠️ Digite seu nome primeiro!');
            return;
        }

        const novaSala = {
            id: proximoIdSala++,
            jogadorId: jogadorAtual.id,
            nome: jogadorAtual.nome,
            ocupada: false
        };

        await db.ref('salas/' + novaSala.id).set(novaSala);
        alert(`✅ SALA CRIADA!\n\n👤 ${novaSala.nome}\n🆔 Sala #${novaSala.id}\n\n🔄 Compartilhe o link!`);
    }

    // ===== 🚪 ENTRAR NA SALA =====
    async function entrarNaSala(sala) {
        if (sala.jogadorId === jogadorAtual.id) {
            alert('⚠️ Não pode jogar contra você mesmo!');
            return;
        }

        await db.ref('salas/' + sala.id).update({ ocupada: true });
        salaSelecionada = sala;

        alert(`✅ VOCÊ ENTROU!\n\n🆔 Sala #${sala.id}\n👤 Adversário: ${sala.nome}`);

        document.getElementById('tela-salas').style.display = 'none';
        document.getElementById('tela-dupla').style.display = 'block';
    }

    // ===== 🔘 BOTÕES =====
    const botaoCriarSala = document.getElementById('criar-sala');
    const botaoMatricular = document.getElementById('botao-matricular');
    const campoNome = document.getElementById('campo-nome');
    const telaMatricula = document.getElementById('tela-matricula');
    const telaSalas = document.getElementById('tela-salas');

    if (botaoMatricular) {
        botaoMatricular.addEventListener('click', () => {
            const nome = campoNome.value.trim();
            if (!nome) {
                alert('⚠️ Digite seu nome!');
                return;
            }
            jogadorAtual.id = proximoIdJogador++;
            jogadorAtual.nome = nome;

            alert(`✅ BEM-VINDO, ${nome}!\n\n🆔 Seu ID: #${jogadorAtual.id}`);

            if (telaMatricula) telaMatricula.style.display = 'none';
            if (telaSalas) telaSalas.style.display = 'block';
            carregarSalasOnline();
        });
    }

    if (botaoCriarSala) {
        botaoCriarSala.addEventListener('click', criarSala);
    }

}); // ✅ FIM DO DOMContentLoaded
