# funções matemáticas
def soma(n1, n2):
    return n1 + n2

def subtracao(n1, n2):
    return n1 - n2

def multiplicacao(n1, n2):
    return n1 * n2

def divisao(n1, n2):
    if n2 == 0:
        return "Erro: divisão por zero!"
    return n1 / n2


print("Seja bem-vindo ao jogo da matemática!")  # saudação do jogo

# laço while para repetir o jogo
control = True  

while control:
    # variáveis para inserir um número
    n1 = float(input('Entre com o primeiro valor: '))
    n2 = float(input('Entre com o segundo valor: '))

    print('\nSelecione uma das operações: ')
    operador = int(input('1) Adição \n2) Subtração\n3) Multiplicação \n4) Divisão\nR.: '))

    if operador == 1:
        print("Resultado:", soma(n1, n2))

    elif operador == 2:
        print("Resultado:", subtracao(n1, n2))

    elif operador == 3:
        print("Resultado:", multiplicacao(n1, n2))

    elif operador == 4:
        print("Resultado:", divisao(n1, n2))

    else:
        print("Posição inexistente, reinicie o jogo e insira uma posição válida.")

    # Perguntar se deseja continuar
    control2 = input("Deseja continuar? (s/n): ")

    if control2.lower() == "s":
        control = True
    else:
        control = False
        print("Obrigado por jogar!")
