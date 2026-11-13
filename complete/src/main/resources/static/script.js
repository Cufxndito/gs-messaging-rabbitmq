let stompClient = null;

function connect() {
    if (stompClient !== null && stompClient.connected) return;
    const serverIp = document.getElementById('serverIp').value.trim() || 'localhost';
    const socket = new SockJS('http://' + serverIp + ':8080/ws');

    stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        setConnected(true);

        stompClient.subscribe('/topic/public', function (payload) {
            showMessage(JSON.parse(payload.body));
        });

        const username = document.getElementById('username').value.trim() || 'Anonimo';
        stompClient.send('/app/chat.addUser', {}, JSON.stringify({
            usuario: username,
            tipo: 'JOIN'
        }));
    }, function (error) {
        console.error('Error de conexion: ', error);
        setConnected(false);
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect(function () {
            console.log('Disconnected');
        });
        stompClient = null;
    }
    setConnected(false);
}

function setConnected(connected) {
    const status = document.getElementById('status');
    if (connected) {
        status.className = 'connected';
        status.textContent = 'Conectado';
    } else {
        status.className = 'disconnected';
        status.textContent = 'Desconectado';
    }
    document.getElementById('message').disabled = !connected;
}

function sendMessage() {
    const username = document.getElementById('username').value.trim() || 'Anonimo';
    const content = document.getElementById('message').value;
    
    if (content.trim() === '') return;

    if (stompClient === null || !stompClient.connected) {
        console.warn('No hay conexion con el servidor');
        return;
    }

    stompClient.send('/app/chat.sendMessage', {}, JSON.stringify({
        usuario: username,
        contenido: content,
        tipo: 'CHAT'
    }));
    
    document.getElementById('message').value = '';
}

function showMessage(message) {
    const messages = document.getElementById('messages');
    const messageDiv = document.createElement('div');

    if (message.tipo === 'JOIN' || message.tipo === 'LEAVE') {
        messageDiv.className = 'message event';
        messageDiv.textContent = message.usuario +
            (message.tipo === 'JOIN' ? ' se unio al chat' : ' salio del chat');
    } else {
        messageDiv.className = 'message';
        const user = document.createElement('strong');
        user.textContent = message.usuario + ':';
        messageDiv.appendChild(user);
        messageDiv.appendChild(document.createTextNode(' ' + (message.contenido || '')));
    }
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
}

document.getElementById('message').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

setConnected(false);
