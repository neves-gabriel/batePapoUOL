let nome = "";


perguntarNome();

function perguntarNome() {
    nome = prompt("Qual é o seu nome?");
    login();
}

function login() {
    const dados = {name: nome};
    axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants', dados)
    .then(response => {
        console.log('Conectado com sucesso');
        buscarMsgs();
    })
    .catch(erro => {
        location.reload();
        alert('Nome de usuário indisponível');
    });
}

function buscarMsgs() {
    let msgs = [];
    axios.get('https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages')
        .then(response => {
            msgs = response.text;
            console.log(msgs);
            let msgsToSee = verifyPrivacy(msgs);
            rendermsgs(msgsToSee);
        })
        .catch(error => {
            console.error(error.response);
        });
}