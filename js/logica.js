document.addEventListener('DOMContentLoaded', function() {
    const db = firebase.database();

    let proximoIdJogador = 1000;
    let proximoIdSala = 5000;
    let jogadorAtual = { id: null, nome: null };
    let salaCriadaPorMim = null;

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
                    div.style = "border:2px solid #4CAF50; padding:15px; margin:10px; border-radius:8px; background:#1a1a1a; color:white;";
                    
                    if (sala.jogadorId === jogadorAtual.id) {
                        div.style.borderColor = '#ff9800';
                        div.style.cursor = 'default';
                        div.innerHTML = `
                            <div style="font-weight:bold; font-size:18px;">🆔 Sala #${sala.id}</div>
                            <div>👤 Você: ${sala.nome}</div>
                            <div style="color:orange; margin-top:8px;">⏳ Aguardando adversário...</div>
                            <div style="color:gray; margin-top:5px;">— ESPERE ALGUÉM ENTRAR —</div>
                        `;
                    } else {
                        div.style.cursor = 'pointer';
                        div.innerHTML = `
                            <div style="font-weight:bold; font-size:18px;">🆔 Sala #${sala.id}</div>
                            <div>👤 Quer jogar: ${sala.nome}</div>
                            <div style="color:lightgreen; margin-top:8px;">⏳ Aguardando adversário...</div>
                            <div style="color:lightgreen; font-weight:bold; margin-top:10px;">✅ CLIQUE AQUI PARA ENTRAR!</div>
                        `;
                        div.onclick = () => entrarNaSala(sala);
                    }
                    lista.appendChild(div);
                }
            });
        });
    }

    async function criarSala() {
        if (!jogadorAtual.id || !jogadorAtual.nome) {
            alert('⚠️ Digite seu nome primeiro!');
            return;
        }
        if (salaCriadaPorMim) {
            alert('⚠️ Você já tem uma sala aberta! Espere alguém entrar!');
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
        alert(`✅ SALA CRIADA!\n\n🆔 Sala #${novaSala.id}\n👤 ${novaSala.nome}\n\n🔄 Compartilhe o link!`);
    }

    async function entrarNaSala(sala) {
        if (sala.jogadorId === jogadorAtual.id) {
            alert('⚠️ É a sua sala! Espere alguém entrar!');
            return;
        }
        await db.ref('salas/' + sala.id).update({ ocupada: true });
        alert(`✅ VOCÊ ENTROU!\n\n🆔 Sala #${sala.id}\n👤 Adversário: ${sala.nome}`);
        document.getElementById('tela-salas').style.display = 'none';
        document.getElementById('tela-dupla').style.display = 'block';
    }

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
