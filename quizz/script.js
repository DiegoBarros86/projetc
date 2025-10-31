    function checkAnswer(button){
    const correctAnswer = "Hyper Text Markup Language";
    const result = document.getElementById("result");

    if (button.innerText === correctAnswer) {
        result.innerText = "✅ Resposta correta!";
        result.style.color = "green";
    } else {
        result.innerText = "❌ Resposta incorreta!";
        result.style.color = "red";
    }
}