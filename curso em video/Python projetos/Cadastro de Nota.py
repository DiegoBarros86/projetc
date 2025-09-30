# Função para cadastrar notas
def cadastrar_notas():
    notas = []
    while True:
        try:
            nota = float(input("Digite a nota do aluno (ou -1 para finalizar): "))
            if nota == -1:  # condição de parada
                break
            elif 0 <= nota <= 10:
                notas.append(nota)
            else:
                print("❌ Nota inválida! Digite um valor entre 0 e 10.")
        except ValueError:
            print("❌ Entrada inválida! Digite um número.")
    return notas

# Função para calcular a média
def calcular_media(notas):
    if len(notas) == 0:
        return 0
    return sum(notas) / len(notas)

# Função para determinar situação
def situacao(media):
    if media >= 7:
        return "✅ Aprovado"
    else:
        return "❌ Reprovado"

# Função principal
def sistema_notas():
    print("=== Sistema de Gestão de Notas ===")
    notas = cadastrar_notas()
    media = calcular_media(notas)
    status = situacao(media)

    print("\n=== Relatório Final ===")
    print("Notas inseridas:", notas)
    print(f"Média: {media:.2f}")
    print("Situação:", status)

# Executar o sistema
sistema_notas()
