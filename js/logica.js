// ==================================================
// TRUCO MINEIRO — ✅ SALAS FUNCIONAM! ENTRA E SAI!
// ==================================================

document.addEventListener('DOMContentLoaded', function() {
    const db = firebase.database();

    let proximoIdJogador = 1000;
    let proximoIdSala = 5000;
    let jogadorAtual = { id: null, nome: null };
    let salaSelecionada = null;
    let salaCriadaPorMim = null;

    // ===== 📋 CARREGAR SALAS — ATUALIZA SOZINHO =====
    function carregarSalasOnline() {
        const lista = document.getElementById('lista-salas');
        if (!lista) return;

        db.ref('salas/').on('value', (snapshot) => {
            lista.innerHTML = '';
            const dados = snapshot.val();

            if (!dados) {
                lista.innerHTML = '<p style="text-align:center; color:#90caf9; padding:20px;">Ninguém está esperando. Crie sua sala!</p>';
                return;
            }

            Object.values(dados).forEach(sala => {
                if (!sala.ocupada) {
                    const div = document.createElement('div');
                    div.style = "border:1px solid #ccc; padding:15px; margin:10px; border-radius:8px; cursor:pointer; background:#2a2a2a; color:white;";
                    
                    // ✅ SE FOR A MINHA SALA → NÃO PODE ENTRAR
                    if (sala.jogadorId === jogadorAtual.id) {
                        div.innerHTML = `
                            <div style="font-weight:bold; margin-bottom:5px;">🆔 Sala #${sala.id} 🔴 SUA SALA</div>
                            <div>👤 Você: ${sala.nome}</div>
                            <div style="color:#90caf9; margin-top:5px;">⏳ Aguardando adversário...</div>
                            <div style="margin-top:10px; color:#ff6b6b;">❌ VOCÊ NÃO PODE ENTRAR NA PRÓPRIA SALA</div>
                        `;
                    } else {
                        // ✅ SALA DE OUTRA PESSOA → PODE ENTRAR
                        div.innerHTML = `
                            <div style="font-weight:bold; margin-bottom:5px;">🆔 Sala #${sala.id}</div>
                            <div>👤 Quer jogar: ${sala.nome}</div>
                            <div style="color:#90caf9; margin-top:5px;">⏳ Aguardando adversário...</div>
                            <div style="margin-top:10px; color:lightgreen;">✅ CLIQUE AQUI PARA ENTRAR E JOGAR</div>
                        `;
                        div.onclick = () => entrarNaSala(sala);
                    }
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

        if (salaCriadaPorMim) {
            alert('⚠️ Você já tem uma sala aberta! Espere alguém entrar ou saia dela primeiro.');
            return;
        }

        const novaSala = {
            id: proximoIdSala++,
            jogadorId: jogadorAtual.id,
            nome: jogadorAtual.nome,
            ocupada: false
        };

        await db.ref('salas/' + novaSala.id).set(novaSala);
        salaCriadaPorMim = novaSala;

        alert(`✅ SALA CRIADA!\n\n🆔 Sala #${novaSala.id}\n👤 ${novaSala.nome}\n\n🔄 COMPARTILHE O LINK com quem vai jogar com você!`);
    }

    // ===== 🚪 ENTRAR NA SALA =====
    async function entrarNaSala(sala) {
        if (sala.jogadorId === jogadorAtual.id) {
            alert('⚠️ Esta é a SUA sala!\n\nEspere alguém entrar ou compartilhe o link!');
            return;
        }

        await db.ref('salas/' + sala.id).update({ ocupada: true });
        salaSelecionada = sala;

        alert(`✅ VOCÊ ENTROU!\n\n🆔 Sala #${sala.id}\n👤 Adversário: ${sala.nome}\n\nJogo vai começar!`);

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

            alert(`✅ BEM-VINDO, ${nome}!\n\n🆔 Seu ID: #${jogadorAtual.id}\n\nCrie sua sala ou entre em uma sala!`);

            if (telaMatricula) telaMatricula.style.display = 'none';
            if (telaSalas) telaSalas.style.display = 'block';
            carregarSalasOnline();
        });
    }

    if (botaoCriarSala) {
        botaoCriarSala.addEventListener('click', criarSala);
    }

});
