"use strict";

var socket = io();

function ispratiPolinom() {
  //var msg = document.getElementById('message').value;

  // Ако копчето за испраќање е кликнато повеќепати во рок од 5 секунди, нема
  // потреба за повеќекратни споделувања
  if (ispratiKopche.classList.contains("strelkiNadesno")) return;

  ispratiKopche.classList.add("strelkiNadesno");
  setTimeout(function () {
    ispratiKopche.classList.remove("strelkiNadesno");
  }, 5200);

  var ispratenPolinom_soKS = {
    Ax: pText,
    KS: aktivenKS,
  };
  socket.emit("ispratiPolinom", ispratenPolinom_soKS);
}

socket.on("spodeliPolinom", function (primenPolinom_soKS) {
  //document.write(polinomZadaden);
  // alert(polinomZadaden);

  // Зелениот сјај свети секогаш кога има споделување
  dozvoliPriemText.classList.add("zelenSjaj");
  setTimeout(function () {
    dozvoliPriemText.classList.remove("zelenSjaj");
  }, 307);

  // Споделувањето на полиномот настанува само ако е ДОЗВОЛЕНО со штиклирање
  if (dozvoliPriem_checkBox.checked)
    aktiviranPrimer(primenPolinom_soKS.Ax, primenPolinom_soKS.KS);
});

// Пробна функција за споделување на полиномот
socket.on("spodeliPolinomPROBNO", function (primenPolinom_soKS) {
  //document.write(polinomZadaden);
  // alert(polinomZadaden);
  pText = primenPolinom_soKS.pText;
  aktivenPolinom = Polinom.generiraj(pText);
  //document.write(polinomZadaden);
  // alert(polinomZadaden);

  grafik.izberiKS(primenPolinom_soKS.KS);
});

// Готов пример од скрипта за чат
/*
function setUsername() {
  socket.emit('setUsername', document.getElementById('name').value);
};

var user;
socket.on('userExists', function(data) {
  document.getElementById('error-container').innerHTML = data;
});
socket.on('userSet', function(data) {
  user = data.username;
  document.body.innerHTML = '<input type = "text" id = "message">\
         <button type = "button" name = "button" onclick = "sendMessage()">Send</button>\
         <div id = "message-container"></div>';
});

function sendMessage() {
  var msg = document.getElementById('message').value;
  if(msg) {
    socket.emit('msg', {message: msg, user: user});
  }
};

socket.on('newmsg', function(data) {
  if(user) {
    document.getElementById('message-container').innerHTML += '<div><b>' +
               data.user + '</b>: ' + data.message + '</div>'
  }
})

*/
