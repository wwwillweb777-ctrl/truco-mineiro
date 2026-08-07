// ===== LÓGICA DO JOGO TRUCO MINEIRO ONLINE =====

let contadorJogadores = 0;
let jogadorAtual = null;
let listaJogadoresNaFila = [];

// PEGA OS ELEMENTOS DA TELA
const campoNome = document.getElementById('campo-nome');
const botaoMatricular = document.getElementById('botao-matricular');
const avisoMatricula = document.getElementById('aviso-matricula');
const telaMatricula = document.getElementById('tela-matricula');
const telaModo = document.getElementById('tela-modo');
const telaJogo = document.getElementById('tela-jogo');
const meuIdMostrar = document.getElementById('meu-id');
const listaJogando = document.getElementById('lista-jogando');
const listaEspera = document.getElementById('lista-espera');

// BOTÕES DE MODO DE JOGO
const botaoModoPessoas = document.getElementById('modo-pessoas');
const botaoModoMaquina1x1 = document.getElementById('modo-maquina-1x1');
const botaoModoMaquinaDuplas = document.getElementById('modo-maquina-duplas');

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
        modoJogo: null,
        parceiro: null,
        formatoJogo: null
    };

    // PASSA PARA A TELA DE ESCOLHA DE MODO
    telaMatricula.style.display = 'none';
    telaModo.style.display = 'block';
    meuIdMostrar.textContent = identificador;

    // MENSAGEM DE SUCESSO
    avisoMatricula.innerHTML = '<span style="color:#51cf66;">✅ Matrícula realizada com sucesso!</span>';
});

// ===== ESCOLHA DE MODO DE JOGO =====

botaoModoPessoas.addEventListener('click', function() {
    jogadorAtual.modoJogo = 'pessoas';
    telaModo.style.display = 'none';
    telaJogo.style.display = 'block';
    listaJogadoresNaFila.push(jogadorAtual);
    atualizarListasTela();
    alert('🌐 Você escolheu jogar com PESSOAS REAIS! Aguardando adversário...');
});

botaoModoMaquina1x1.addEventListener('click', function() {
    jogadorAtual.modoJogo = 'maquina-1x1';
    alert('🤖 Você escolheu jogar CONTRA A MÁQUINA! Em breve iniciamos a partida!');
    // Aqui no futuro abre a tela de jogo contra robô
});

botaoModoMaquinaDuplas.addEventListener('click', function() {
    jogadorAtual.modoJogo = 'maquina-duplas';
    alert('🤝 Você escolheu jogar com 3 MÁQUINAS (Duplas)! Em breve iniciamos a partida!');
    // Aqui no futuro abre a tela de duplas com robôs
});

// ===== FUNÇÕES DA TELA DE PESSOAS =====

// ATUALIZA AS LISTAS NA TELA
function atualizarListasTela() {
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
