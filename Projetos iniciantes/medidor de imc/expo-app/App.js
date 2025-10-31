import React, {useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'imc_historico_v1';

export default function App(){
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');
  const [historico, setHistorico] = useState([]);

  useEffect(()=>{
    carregarHistorico();
  },[]);

  async function carregarHistorico(){
    try{
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) setHistorico(JSON.parse(raw));
    }catch(e){
      console.warn('Erro ao ler histórico', e);
    }
  }

  async function salvarHistoricoItem(item){
    try{
      const arr = [item, ...historico].slice(0,10);
      setHistorico(arr);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    }catch(e){
      console.warn('Erro ao salvar histórico', e);
    }
  }

  function calcularIMC(){
    setErro('');
    const p = parseFloat(peso.replace(',', '.'));
    const a = parseFloat(altura.replace(',', '.'));
    if (!p || p <= 0){
      setErro('Informe um peso válido (kg).');
      return;
    }
    if (!a || a <= 0){
      setErro('Informe uma altura válida (cm).');
      return;
    }
    const alturaM = a / 100;
    const imc = p / (alturaM * alturaM);
    if (!isFinite(imc) || isNaN(imc)){
      setErro('Erro ao calcular IMC.');
      return;
    }
    const imcFmt = Number(imc.toFixed(1));
    const faixa = faixaIMC(imc);
    const item = {
      peso: p.toFixed(1),
      altura: a.toFixed(1),
      imc: imcFmt.toFixed(1),
      faixa: faixa.label,
      when: new Date().toISOString()
    };
    setResultado({imc: imcFmt, faixa});
    salvarHistoricoItem(item);
  }

  function faixaIMC(imc){
    if (imc < 18.5) return {label: 'Abaixo do peso', style: styles.abaixo};
    if (imc < 25) return {label: 'Peso normal', style: styles.normal};
    if (imc < 30) return {label: 'Sobrepeso', style: styles.sobrepeso};
    return {label: 'Obesidade', style: styles.obesidade};
  }

  function limpar(){
    setPeso('');
    setAltura('');
    setResultado(null);
    setErro('');
  }

  async function limparHistorico(){
    Alert.alert('Confirmar', 'Deseja limpar o histórico?', [
      {text:'Cancelar', style:'cancel'},
      {text:'OK', onPress: async ()=>{
        try{ await AsyncStorage.removeItem(STORAGE_KEY); setHistorico([]);}catch(e){console.warn(e)}
      }}
    ]);
  }

  async function removerHistoricoItem(when){
    try{
      const novo = historico.filter(h => h.when !== when);
      setHistorico(novo);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novo));
    }catch(e){
      console.warn('Erro ao remover item', e);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Calculadora de IMC</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Peso (kg)</Text>
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            value={peso}
            onChangeText={setPeso}
            placeholder="Ex: 70.5"
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Altura (cm)</Text>
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            value={altura}
            onChangeText={setAltura}
            placeholder="Ex: 175"
          />
        </View>

        {erro ? <Text style={styles.error}>{erro}</Text> : null}

        <View style={styles.actions}>
          <TouchableOpacity style={[styles.btn, styles.primary]} onPress={calcularIMC}>
            <Text style={styles.btnText}>Calcular</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn} onPress={limpar}>
            <Text>Limpar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.subTitle}>Resultado</Text>
        {resultado ? (
          <View>
            <Text style={styles.resultValue}>IMC: {resultado.imc.toFixed(1)}</Text>
            <View style={[styles.faixa, resultado.faixa.style]}>
              <Text style={styles.faixaText}>{resultado.faixa.label}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.muted}>Nenhum cálculo ainda.</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.subTitle}>Histórico (últimos 10)</Text>
        {historico.length === 0 ? (
          <Text style={styles.muted}>Nenhum registro.</Text>
        ) : (
          <FlatList
            data={historico}
            keyExtractor={(item)=>item.when}
            renderItem={({item})=> (
              <View style={styles.histItem}>
                <View style={{flex:1}}>
                  <Text style={styles.histTitle}>{item.imc} — {item.faixa}</Text>
                  <Text style={styles.histMeta}>{new Date(item.when).toLocaleString()}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.btn, {marginLeft:8}]}
                  onPress={() => {
                    Alert.alert('Remover', 'Deseja remover este registro?', [
                      {text: 'Cancelar', style: 'cancel'},
                      {text: 'Remover', style: 'destructive', onPress: ()=> removerHistoricoItem(item.when) }
                    ]);
                  }}
                >
                  <Text style={{color:'#ef4444'}}>Remover</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}

        <View style={[styles.actions, {marginTop:8}]}> 
          <TouchableOpacity style={styles.btn} onPress={limparHistorico}>
            <Text>Limpar histórico</Text>
          </TouchableOpacity>
        </View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, padding:16, backgroundColor:'#f4f6f8'},
  title:{fontSize:20, fontWeight:'700', marginBottom:12, color:'#0f172a'},
  card:{backgroundColor:'#fff', padding:12, borderRadius:10, marginBottom:12, shadowColor:'#000', shadowOpacity:0.05, shadowRadius:6},
  row:{flexDirection:'row', alignItems:'center', marginBottom:10},
  label:{width:110, color:'#6b7280'},
  input:{flex:1, borderWidth:1, borderColor:'#e6e9ef', padding:8, borderRadius:8, fontSize:16},
  actions:{flexDirection:'row', gap:8},
  btn:{paddingVertical:8, paddingHorizontal:12, borderRadius:8, borderWidth:1, borderColor:'#d1d5db', backgroundColor:'transparent'},
  primary:{backgroundColor:'#2563eb', borderColor:'transparent'},
  btnText:{color:'#fff'},
  error:{color:'#ef4444', marginTop:6},
  subTitle:{fontWeight:'600', marginBottom:8},
  resultValue:{fontSize:18, fontWeight:'700'},
  faixa:{marginTop:8, padding:8, borderRadius:6, alignSelf:'flex-start'},
  faixaText:{color:'#fff'},
  abaixo:{backgroundColor:'#6b7280'},
  normal:{backgroundColor:'#16a34a'},
  sobrepeso:{backgroundColor:'#f59e0b'},
  obesidade:{backgroundColor:'#ef4444'},
  muted:{color:'#6b7280'},
  histItem:{paddingVertical:8, borderBottomWidth:1, borderBottomColor:'#f1f5f9'},
  histTitle:{fontWeight:'600'},
  histMeta:{color:'#6b7280', fontSize:12}
});
