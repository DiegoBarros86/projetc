function adicionarTarefa() {
    let mensagem = "Tarefa adicionada com sucesso!";

    let inputTarefa = document.getElementById("inputTarefa");
    let tarefa = inputTarefa.value;

    if (tarefa.trim() === "") {
        document.getElementById("mensagem").textContent = "Por favor, digite uma tarefa.";
        return;
    }

    // Mostrar a mensagem
    document.getElementById("mensagem").textContent = mensagem;

    // Criar e adicionar a nova tarefa
    let listaTarefas = document.getElementById("listaTarefas");
    let novaTarefa = document.createElement("li");
    novaTarefa.textContent = tarefa;
    listaTarefas.appendChild(novaTarefa);

    // Limpar o campo de entrada
    inputTarefa.value = "";
}