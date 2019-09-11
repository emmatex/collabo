const EditorClient = ot.EditorClient;
const SocketIOAdapter = ot.SocketIOAdapter;
const CodeMirrorAdapter = ot.CodeMirrorAdapter;

//const socket = io.connect('http://localhost:3000');
const socket = io.connect('https://calm-plateau-70181.herokuapp.com');
let editor = CodeMirror.fromTextArea(document.getElementById("code-screen"), {
    lineNumbers: true,
    theme: "dracula"
});

let code = $('#code-screen').val();
let cmClient;
function init(str, revision, clients, serverAdapter) {
    if (!code) {
        editor.setValue(str);
    }
    cmClient = window.cmClient = new EditorClient(
        revision, clients, serverAdapter, new CodeMirrorAdapter(editor)
    );
}

socket.on('doc', (item) => {
    init(item.str, item.revision, item.clients, new SocketIOAdapter(socket));
});

let username = $("#chatbox-username").val();
if (username === "") {
    let userId = Math.floor(Math.random() * 9999).toString();
    username = "User" + userId;
    $("#chatbox-username").text(username);
};

let roomId = $('#roomId').val();
socket.emit('joinRoom', { room: roomId, username: username });

let userMessage = function (name, text) {
    return ('<li class="media"> <div class="media-body"> <div class="media">' +
        '<div class="media-body"' +
        '<b>' + name + '</b> : ' + text +
        '<hr/> </div></div></div></li>'
    );
};

let sendMessage = function () {
    let userMessage = $('#userMessage').val();
    socket.emit('chatMessage', { message: userMessage, username: username });
    $('#userMessage').val("");
};

socket.on('chatMessage', function (data) {
    $('#chatbox-listMessages').append(userMessage(data.username, data.message));
});
