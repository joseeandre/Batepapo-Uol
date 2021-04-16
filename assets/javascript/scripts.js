let usuarios = [];
let mensagens = [];
let mensagensServidor = document.querySelector(".mensagens");
let usuariosServidor = document.querySelector(".usuarios");
let k = 1;
let m = 1;
let nomeUsuario;
let selecionadosLista = [];
let selecionadosVisibilidade = [];

document.querySelector(".mensagem").addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("enviar").click();
    }
});

document.querySelector(".nome").addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("entrar").click();
    }
});

function aoEntrar() {
    criarUsuario();
    setInterval(pegarUsuarios, 10000);
    setInterval(pegarMensagens, 3000);
}

function criarUsuario() {
    const novoUsuario = enviarUsuario();
    novoUsuario.catch(recarregar);
    setInterval(lembreteServidor, 5000);
}

function enviarUsuario() {
    const nomeInput = document.querySelector(".nome").value;
    const novoNome = { name: nomeInput };
    const promessa = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants", novoNome);
    nomeUsuario = nomeInput;

    document.querySelector(".login").classList.add("oculto");
    document.querySelector(".carregando").classList.remove("oculto");
    return promessa;
}

function pegarUsuarios() {
    const promessa = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants");
    promessa.then(popularUsuarios);
}

function popularUsuarios(promessa) {
    if (usuarios != promessa.data) {
        m = 1;
    } else {
        m = 0;
    }
    usuarios = promessa.data;

    if (m === 1) {
        usuariosServidor.innerHTML = "";
        for (let i = 0; i < usuarios.length; i++) {
            renderizarUsuarios(usuarios[i]);
        }
    }
}

function popularMensagens(promessa) {
    if (mensagens != promessa.data) {
        k = 1;
    } else {
        k = 0;
    }
    mensagens = promessa.data;

    if (k === 1) {
        mensagensServidor.innerHTML = "";
        for (let i = 0; i < mensagens.length; i++) {
            renderizarMensagem(mensagens[i]);
        }
    }

    const ultimoFilho = document.querySelector(".mensagens").lastElementChild;
    ultimoFilho.scrollIntoView();

    document.querySelector(".entrada").style.display = "none";
    document.querySelector(".chat").classList.remove("oculto");
    document.body.classList.add("fundo-chat");
}

function pegarMensagens() {
    const promessa = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages");
    promessa.then(popularMensagens);
}

function recarregar() {
    location.reload();
}

function renderizarMensagem(objeto) {
    const nome = objeto.from;
    const hora = objeto.time;
    const destino = objeto.to;
    const texto = objeto.text;

    let smsVermelho = '<div class="caixa-mensagem vermelho"><p><horario>[' + hora + ']</horario><strong>  ' + nome + '</strong> para <strong> ' + destino + ' </strong>: ' + texto + '</p></div>';
    let smsCinza = '<div class="caixa-mensagem cinza"><p><horario>[' + hora + ']</horario><strong>  ' + nome + '</strong> para <strong> ' + destino + ' </strong>: ' + texto + '</p></div>';
    let sms = '<div class="caixa-mensagem"><p><horario>[' + hora + ']</horario><strong>  ' + nome + '</strong> para <strong> ' + destino + ' </strong>: ' + texto + '</p></div>';

    if (objeto.type === "private_message") {
        if (destino === nomeUsuario) {
            mensagensServidor.innerHTML += smsVermelho;
        }
    } else {
        if (objeto.type === "status") {
            mensagensServidor.innerHTML += smsCinza;
        } else {
            mensagensServidor.innerHTML += sms;
        }
    }
}

function renderizarUsuarios(objeto) {
    const nome = objeto.name;
    let conteudo = '<div class="caixa-lateral" onclick="selecionarUsuario(this)"><div class="nome-usuario"><ion-icon name="person-circle-outline"></ion-icon><h1>' + nome + '</h1></div><ion-icon id="' + nome + '" name="checkmark-outline" class="usuario oculto"></ion-icon></div>';
    let conteudoSelecionado = '<div class="caixa-lateral" onclick="selecionarUsuario(this)"><div class="nome-usuario"><ion-icon name="person-circle-outline"></ion-icon><h1>' + nome + '</h1></div><ion-icon id="' + nome + '" name="checkmark-outline" class="usuario selecionado"></ion-icon></div>';

    if (selecionadosLista.length === 1) {
        if (selecionadosLista[0].id != "Todos" && selecionadosLista[0].id === nome) {
            usuariosServidor.innerHTML += conteudoSelecionado;
        } else {
            usuariosServidor.innerHTML += conteudo;
        }
    } else {
        usuariosServidor.innerHTML += conteudo;
    }

}

function lembreteServidor() {
    const novoNome = { name: nomeUsuario };
    axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/status", novoNome);
}

function enviarMensagem() {
    let mensagemInput = document.querySelector(".mensagem");
    let usuariosLista = document.querySelector(".contato");
    let visibilidadeLista = document.querySelector(".visibilidade");
    let destinoUsuario;
    let tipoMensagem;
    let usuarioSelecionado = usuariosLista.querySelector('.selecionado');
    let visibilidadeSelecionado = visibilidadeLista.querySelector('.selecionado');

    if (usuarioSelecionado != null) {
        destinoUsuario = usuarioSelecionado.id;
    } else {
        destinoUsuario = "Todos";
    }

    if (visibilidadeSelecionado != null) {
        tipoMensagem = visibilidadeSelecionado.id;
    } else {
        tipoMensagem = "message";
    }

    let objetoMensagem = { from: nomeUsuario, to: destinoUsuario, text: mensagemInput.value, type: tipoMensagem };

    axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages", objetoMensagem);
    mensagemInput.value = "";
}

function barraLateral() {
    document.querySelector(".tela-preta").classList.remove("oculto");
    document.querySelector(".lateral").classList.remove("oculto");
}

function sairLateral() {
    document.querySelector(".tela-preta").classList.add("oculto");
    document.querySelector(".lateral").classList.add("oculto");
}

function selecionarUsuario(id) {
    const selecionado = id.querySelector(".usuario");
    let selecionadoAnterior;

    if (selecionadosLista.length === 1) {
        selecionadoAnterior = document.getElementById(selecionadosLista[0].id);
        selecionadoAnterior.classList.remove("selecionado");
        selecionadoAnterior.classList.add("oculto");
        selecionadosLista.pop();
    }

    selecionado.classList.add("selecionado");
    selecionado.classList.remove("oculto");
    selecionadosLista.push(selecionado);
}

function selecionarVisibilidade(id) {
    const selecionado = id.querySelector(".usuario");

    if (selecionadosVisibilidade.length === 1) {
        selecionadosVisibilidade[0].classList.remove("selecionado");
        selecionadosVisibilidade[0].classList.add("oculto");
        selecionadosVisibilidade.pop();
    }

    selecionado.classList.add("selecionado");
    selecionado.classList.remove("oculto");
    selecionadosVisibilidade.push(selecionado);
}