/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import Tts from 'react-native-tts';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';


type Log = {
  id: number,
  text: string
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [text, onChangeText] = React.useState('');
  const [selected, setSelected] = React.useState('');
  const [history, setHistory] = React.useState<Log[]>([]);
  const [play, setPlay] = React.useState('play-arrow');

  const Item = ({ onPress, name, size, style }:any) => {
    return (
      <TouchableOpacity onPress={onPress} style={style}>
        <Icon name={name} size={size} color={isDarkMode ? Colors.white:Colors.black} />
      </TouchableOpacity>
    );
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
    fontSize: 24,
  };

  useEffect(()=>{
    Tts.getInitStatus().then(()=>{
      Tts.setDefaultLanguage('ja-JP');
      Tts.setDefaultRate(1);
      Tts.addEventListener('tts-start',()=>setPlay('pause'));
      Tts.addEventListener('tts-cancel',()=>setPlay('play-arrow'));
      Tts.addEventListener('tts-finish',()=>{onChangeText(''); setPlay('play-arrow')});
    }).catch(err=>console.error(err))
  },[]);
  
  const handleAddItem = (data:string) => {
    // 今日の日付を取得
    const today = new Date();
    const newItem = { id: today.getTime(), text: data };
    // 一日前の日付を取得
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    setHistory([...history.filter(item=>item.id>=yesterday.getTime()), newItem]);
  };
  
  const handleKeyPress = (event: any) => {
    if (event.nativeEvent.key === 'Enter') {
      try {
        Tts.speak(text);
        handleAddItem(text);
      } catch (err) {
        console.error(err);
      }
    }
  };
  
  const handleTTS = () => {
    if (play==='play-arrow'){
      Tts.speak(selected);
    } else {
      Tts.stop();
    }
  };
  
  const handlePress = (item:string) => {
    try {
      Tts.speak(item);
    } catch (err) {
      console.error(err);
    }
  };
  
  return (
    <SafeAreaView style={backgroundStyle}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View>
            <Text style={{
              fontSize: 30,
              textAlign: 'center',
              color: isDarkMode ? Colors.white:Colors.black
            }}>入力履歴</Text>
            <Picker
              selectedValue={selected}
              onValueChange={(itemValue, itemIndex) => {
                handlePress(itemValue);
                setSelected(itemValue);
              }}
              itemStyle={{color: isDarkMode ? Colors.white:Colors.black}}
            >
              {history.map(item=><Picker.Item label={item.text} value={item.text} />)}
            </Picker>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <View style={{flexDirection: 'row', justifyContent:'center'}}>
                <Text style={{
                  textAlign: 'center',
                  fontSize: 30,
                  color: isDarkMode ? Colors.white:Colors.black
                }}>音声に変換します
                </Text>
                <Item name={play} size={40} onPress={handleTTS} style={{marginBottom: 10, marginLeft: 5}}/>
              </View>
              <TextInput
              style={{
                backgroundColor: Colors.white,
                width: '90%',
                height: '100%',
                margin: 5,
                borderRadius: 10,
                padding: 10
              }}
              onChangeText={onChangeText}
              value={text}
              placeholder="Type here..."
              onKeyPress={handleKeyPress}
              multiline
              />
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default App;
