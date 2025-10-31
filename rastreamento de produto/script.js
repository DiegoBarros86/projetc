function rastrearProduto(rastrearProduto) {
  // Lógica para rastrear o produto com o ID fornecido
  console.log("Rastreando produto com ID:", rastrearProduto)
}

module.exports = rastrearProduto

window.documentById = function (id) {
  return document.getElementById(id)
}
window.atualizarResultado = function (texto) {
  const resultadoElemento = document.getElementById("resultadoTexto")
  resultadoElemento.textContent = texto
}
window.adicionarEventoRastrear = function (callback) {
  const botaoRastrear = document.querySelector(".btnRastrear")
  botaoRastrear.addEventListener("click", function () {
    const inputRastrear = document.querySelector(".txtRastrear")
    const idProduto = inputRastrear.value
    callback(idProduto)
  })
}   

