
// ===== LÓGICA DO JOGO TRUCO MINEIRO ONLINE =====

let contadorJogadores = 0;
let jogadorAtual = null;
let listaJogadoresNaFila = [];

// PEGA OS ELEMENTOS DA TELA
const campoNome = document.getElementById('campo-nome');
const botaoMatricular = document.getElementById('botao-matricular');
const avisoMatricula = document.getElementById('aviso-matricula');
const telaMatricula = document.getElementById('tela-matricula');
const telaJogo = document.getElementById('tela-jogo');
const meuIdMostrar = document.getElementById('meu-id');
const listaJogando = document.getElementById('lista-jogando');
const listaEspera = document.getElementById('lista-espera');

// AO CLICAR NO BOTÃO DE MATRÍCULA
botaoMatricular.addEventListener('click', function() {
    let nome = campoNome.value.trim();
    
    // VALIDAÇÕES
    if (nome.length === 0) {
        avisoMatricula.innerHTML = '<span style="color:#ff6b6b;">⚠️ Digite seu nome primeiro!</span>';
        return;
    }
    if (nome.length < 2) {
        avisoMatricula.innerHTML = '<span style="color:#ff6b6b;">⚠️ Nome muito curto!</span>';
        return;
    }

    // GERA O NÚMERO DO IDENTIFICADOR
    contadorJogadores++;
    let identificador = nome + ' #' + contadorJogadores;

    // GUARDA OS DADOS DO JOGADOR
    jogadorAtual = {
        nome: nome,
        id: identificador,
        parceiro: null,
        formatoJogo: null
    };

    // MOSTRA A TELA PRINCIPAL
    telaMatricula.style.display = 'none';
    telaJogo.style.display = 'block';
    meuIdMostrar.textContent = identificador;

    // COLOCA NA FILA DE ESPERA
    listaJogadoresNaFila.push(jogadorAtual);
    atualizarListasTela();

    // MENSAGEM DE SUCESSO
    avisoMatricula.innerHTML = '<span style="color:#51cf66;">✅ Matrícula realizada com sucesso!</span>';
});

// ATUALIZA AS LISTAS NA TELA
function atualizarListasTela() {
    // FILA DE ESPERA
    if (listaJogadoresNaFila.length === 0) {
        listaEspera.innerHTML = '<p>Ninguém na fila de espera.</p>';
    } else {
        let html = '';
        listaJogadoresNaFila.forEach(function(jogador) {
            html += `<p>⏳ ${jogador.id} — Aguardando parceiro...</p>`;
        });
        listaEspera.innerHTML = html;
    }
}

// BOTÕES DE FORMATO DE PARTIDA
const botao2 = document.getElementById('botao-2jogadores');
const botao4 = document.getElementById('botao-4jogadores');

botao2.addEventListener('click', function() {
    if (jogadorAtual) {
        jogadorAtual.formatoJogo = '2jogadores';
        alert('🎯 Você escolheu partida de 2 jogadores! Aguardando adversário...');
    }
});

botao4.addEventListener('click', function() {
    if (jogadorAtual) {
        jogadorAtual.formatoJogo = '4jogadores';
        alert('🎯 Você escolheu partida de 4 jogadores! Agora escolha seu parceiro!');
    }
});
