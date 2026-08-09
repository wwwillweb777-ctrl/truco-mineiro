document.addEventListener('DOMContentLoaded', function() {
    const db = firebase.database();
    let proximoIdJogador = 1000;
    let proximoIdSala = 5000;
    let jogadorAtual = { id: null, nome: null };
    let salaSelecionada = null;

    // ===== MOSTRAR SALAS =====
    function carregarSalasOnline() {
        const lista = document.getElementById('lista-salas');
        if (!lista) return;

        db.ref('salas/').on('value', (snapshot) => {
            lista.innerHTML = '';
            const dados = snapshot.val();

            if (!dados) {
                lista.innerHTML = '<p style="text-align:center; color:#90caf9; padding:20px;">Ninguém criou sala ainda. Crie a sua!</p>';
                return;
            }

            Object.values(dados).forEach(sala => {
                if (!sala.ocupada) {
                    const div = document.createElement('div');
                    
                    if (sala.jogadorId === jogadorAtual.id) {
                        div.style = "border:3px solid #ff9800; padding:15px; margin:10px; border-radius:8px; background:#2a2a2a; color:white;";
                        div.innerHTML = `
                            <div style="font-weight:bold; font-size:18px;">🆔 Sala #${sala.id}</div>
                            <div>👤 Você: ${sala.nome}</div>
                            <div style="color:orange; margin-top:8px;">⏳ Aguardando alguém entrar...</div>
                            <div style="color:#ff6b6b; margin-top:5px;">❌ COMPARTILHE O LINK COM QUEM VAI JOGAR!</div>
                        `;
                    } else {
                        div.style = "border:3px solid #4CAF50; padding:15px; margin:10px; border-radius:8px; background:#1a1a1a; color:white; cursor:pointer;";
                        div.innerHTML = `
                            <div style="font-weight:bold; font-size:18px;">🆔 Sala #${sala.id}</div>
                            <div>👤 Quer jogar: ${sala.nome}</div>
                            <div style="color:lightgreen; margin-top:8px;">⏳ Aguardando...</div>
                            <div style="color:lightgreen; font-weight:bold; margin-top:10px;">✅ CLIQUE AQUI PARA ENTRAR!</div>
                        `;
                        div.onclick = () => entrarNaSala(sala);
                    }
                    lista.appendChild(div);
                }
            });
        });
    }

    // ===== CRIAR SALA =====
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
        alert(`✅ SALA CRIADA!\n\n🆔 Sala #${novaSala.id}\n👤 ${novaSala.nome}\n\n🔄 COMPARTILHE O LINK COM SEU ADVERSÁRIO!`);
    }

    // ===== ✅ ENTRAR NA SALA — AGORA VAI PRA TELA DO JOGO! =====
    async function entrarNaSala(sala) {
        if (sala.jogadorId === jogadorAtual.id) {
            alert('⚠️ Esta é a SUA sala!\n\nEspere alguém entrar ou compartilhe o link!');
            return;
        }

        // ✅ MARCA A SALA COMO OCUPADA
        await db.ref('salas/' + sala.id).update({ ocupada: true });
        salaSelecionada = sala;

        alert(`✅ VOCÊ ENTROU!\n\n🆔 Sala #${sala.id}\n👤 Adversário: ${sala.nome}\n\n🎮 INICIANDO O JOGO...`);

        // ✅ ESCONDE TELA DE SALAS → MOSTRA TELA DO JOGO
        document.getElementById('tela-salas').style.display = 'none';
        document.getElementById('tela-jogo').style.display = 'block';

        // ✅ QUEM CRIOU A SALA JOGARÁ PRIMEIRO
        if (sala.jogadorId === jogadorAtual.id) {
            document.getElementById('mensagem-jogo').innerHTML = `🎮 Olá ${jogadorAtual.nome}! Você começa jogando!`;
        } else {
            document.getElementById('mensagem-jogo').innerHTML = `🎮 Você entrou! Seu adversário é ${sala.nome}! Ele começa jogando!`;
        }
    }

    // ===== BOTÕES =====
    const botaoCriarSala = document.getElementById('criar-sala');
    const botaoMatricular = document.getElementById('botao-matricular');
    const campoNome = document.getElementById('campo-nome');
    const telaMatricula = document.getElementById('tela-matricula');
    const telaSalas = document.getElementById('tela-salas');

    if (botaoMatricular) {
        botaoMatricular.addEventListener('click', () => {
            const nome = campoNome.value.trim();
            if (!nome) { alert('⚠️ Digite seu nome!'); return; }
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
});
