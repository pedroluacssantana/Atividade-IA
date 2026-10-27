const USUARIO_CORRETO = "Pedro";
const SENHA_CORRETA = "01042010";

let temaAtual = "claro";
let usuarioLogado = "";

function validarLogin(event) {
    event.preventDefault();
    
    const campoUsr = document.getElementById("campo-usuario");
    const campoPwd = document.getElementById("campo-senha");
    const alertaErro = document.getElementById("mensagem-erro");

    const usuario = campoUsr.value.trim();
    const senha = campoPwd.value.trim();

    if (usuario === USUARIO_CORRETO && senha === SENHA_CORRETA) {
        usuarioLogado = usuario;
        document.getElementById("perfil-nome").innerText = usuario;
        
        document.getElementById("ecra-login").classList.add("escondido");
        document.getElementById("ecra-principal").classList.remove("escondido");
        alertaErro.classList.add("escondido");
    } else {
        alertaErro.classList.remove("escondido");
    }
}

function mudarAba(aba) {
    const chatBox = document.getElementById("conteudo-chat");
    const perfilBox = document.getElementById("conteudo-perfil");
    const btnChat = document.getElementById("aba-btn-chat");
    const btnPerfil = document.getElementById("aba-btn-perfil");

    if (aba === 'chat') {
        chatBox.classList.remove("escondido");
        perfilBox.classList.add("escondido");
        btnChat.classList.add("ativa");
        btnPerfil.classList.remove("ativa");
    } else {
        chatBox.classList.add("escondido");
        perfilBox.classList.remove("escondido");
        btnPerfil.classList.add("ativa");
        btnChat.classList.remove("ativa");
    }
}

function enviarMensagem() {
    const campo = document.getElementById("campo-mensagem");
    const texto = campo.value.trim();
    if (!texto) return;

    campo.value = "";
    adicionarMensagem(`[USER] ${usuarioLogado}`, texto, "user");

    const btnEnviar = document.getElementById("btn-enviar");
    btnEnviar.disabled = true;

    setTimeout(async () => {
        const resposta = await buscarRespostaAPI(texto);
        adicionarMensagem("[BOT] Assistente TI", resposta, "bot");
        btnEnviar.disabled = false;
    }, 1200);
}

function verificarTecla(event) {
    if (event.key === "Enter") {
        enviarMensagem();
    }
}

function adicionarMensagem(emissor, texto, tipo) {
    const historico = document.getElementById("historico-chat");
    const divMsg = document.createElement("div");
    divMsg.className = `msg-item ${tipo}`;

    const spanAutor = document.createElement("span");
    spanAutor.className = "msg-autor";
    spanAutor.textContent = `${emissor}:`;

    const textoNo = document.createTextNode(texto);

    divMsg.appendChild(spanAutor);
    divMsg.appendChild(textoNo);

    historico.appendChild(divMsg);
    historico.scrollTop = historico.scrollHeight;
}
function limparHistorico() {
    const historico = document.getElementById("historico-chat");
    historico.innerHTML = '<div class="mensagem-sistema">Histórico limpo.</div>';
}

async function buscarRespostaAPI(pergunta) {
    try {
        const termo = encodeURIComponent(pergunta.trim());
        const url = `https://pt.wikipedia.org/w/api.php?action=query&list=search&srsearch=${termo}&format=json&origin=*`;
        
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.query && data.query.search.length > 0) {
            const primeiroResultado = data.query.search[0];
            const snippetLimpo = primeiroResultado.snippet.replace(/<[^>]*>?/gm, '');
            return `${primeiroResultado.title}: ${snippetLimpo}...`;
        }
    } catch (err) {
    }

    const p = pergunta.toLowerCase();
    if (p.includes("python")) {
        return "Python é uma linguagem de programação de alto nível, interpretada e largamente utilizada em desenvolvimento backend e Inteligência Artificial.";
    } else if (p.includes("html") || p.includes("css")) {
        return "O HTML estrutura os elementos de uma página web, enquanto o CSS é responsável pela estilização e organização do layout visual.";
    } else if (p.includes("api")) {
        return "Uma API (Application Programming Interface) permite a comunicação e integração padronizada entre diferentes aplicações.";
    } else if (p.includes("sql") || p.includes("banco")) {
        return "Bancos de dados relacionais armazenam dados estruturados em tabelas e utilizam a linguagem SQL para consultas.";
    } else {
        return "Compreendido! Como assistente de TI, posso responder a dúvidas sobre Python, APIs, HTML, CSS e Bancos de Dados.";
    }
}

function alternarTema() {
    const body = document.body;
    if (temaAtual === "claro") {
        temaAtual = "escuro";
        body.classList.add("modo-escuro");
    } else {
        temaAtual = "claro";
        body.classList.remove("modo-escuro");
    }
}