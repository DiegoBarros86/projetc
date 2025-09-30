#jogo de somatoria

#função soma

def soma (n1 + n2):
	resultado = n1 + n2
	return resultado

#função subtração

def subtracao (n1 + n2):
	resultado = n1 + n2
	return resultado

#função multiplicação

def multiplicacao (n1 + n2):
	resultado = n1 + n2
	return resultado

#função divisão

def divisao (n1 + n2):
	resultado = n1 + n2
	return resultado

print("Seja bem vindo o nome de matematica")  #saudação do jogo

#laço while para que o jogo reinicie

controlador = true

while (control == true):

#variavel para inserir um numero

n1 = float(input('Entre com o Primeiro Valor : ')
n2 = float(input('Entre com o Segundo Valor : ')

print('selecione uma das operações : ')

#algaritimo para somar o numero executado

operador = int(input('1) Adição \n2) Subtração\n3) Multiplicação \n4) Divisão.\nR.:'))

if  (operador == 1):
	soma = soma(n1,n2)
	print(soma)

if  (operador == 2):
	subtração =subtração  (n1,n2)
	print(subtração )

if  (operador == 3):
	multiplicacao = multiplicacao(n1,n2)
	print(multiplicacao)

if  (operador == 4):
	divisao = divisao(n1,n2)
	print(divisao)

# foi colocado um if e eslse para o jogo não ficar tão cansativo

if (operador >4):
	print("posição inexistente, reinicie o jogo e insira uma posição valida.")

control2 = input ("Deseja continuar:?  s/n")

if (control2.upper() == "s")
	control = true

else:
	  control = false

