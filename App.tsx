/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
// import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import Tts from 'react-native-tts';

type Histroy = {
  id: number,
  text: string
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [text, onChangeText] = React.useState('');
  const [history, setHistory] = React.useState<Histroy[]>([]);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
    fontSize: 24,
  };

  useEffect(()=>{
    Tts.getInitStatus().then(()=>{
      Tts.setDefaultLanguage('ja-JP');
      Tts.setDefaultRate(1);
      Tts.addEventListener('tts-finish',()=>onChangeText(''));
    }).catch(err=>console.error(err))
  },[]);

  const handleRemoveItem = (id:number) => {
    setHistory(history.filter(item => item.id !== id));
  };
  
  const handleAddItem = (data:string) => {
    const newItem = { id: new Date().getTime(), text: data };
    setHistory([...history, newItem]);
  };
  
  const handleKeyPress = (event: any) => {
    if (event.nativeEvent.key === 'Enter' && !event.nativeEvent.shiftKey) {
      try {
        Tts.speak(text);
        handleAddItem(text);
      } catch (err) {
        console.error(err);
      }
    }
  };
  
  const handlePress = (item:string) => {
    try {
      Tts.speak(item);
    } catch (err) {
      console.error(err);
    }
  };
  const renderItem = ({item}:any) => {
    // 一日前の日付を取得
    const yesterday = new Date();
    yesterday.setDate(new Date().getDate() - 1);
    if (item.id>yesterday.getTime()){
      return (
      <TouchableOpacity onPress={() => handlePress(item.text)}>
        <View style={{ padding: 10 }}>
          <Text 
            style={{
              textAlign: 'center',
              color: isDarkMode ? Colors.white:Colors.black
            }}
          >{item.text}</Text>
        </View>
      </TouchableOpacity>);
    } else {
      handleRemoveItem(item.id);
      return null;
    }
};
  
  return (
    <SafeAreaView style={backgroundStyle}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          >
            <Text style={{
              fontSize: 30,
              textAlign: 'center',
              color: isDarkMode ? Colors.white:Colors.black
            }}>入力履歴</Text>
            <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              style={{
                flex:3,
                backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
                height:'50%'
              }}>
                <FlatList
                  style={{
                    flex:3,
                    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
                    height:'50%'
                  }}
                  data={history}
                  renderItem={renderItem}
                  keyExtractor={item => item.id.toString()}
                />
            </ScrollView>
            <Text style={{
              textAlign: 'center',
              fontSize: 30,
              color: isDarkMode ? Colors.white:Colors.black
            }}>音声に変換します</Text>
            <TextInput
            style={{
              backgroundColor: Colors.white,
              width: '100%',
              height: '50%'
            }}
            onChangeText={onChangeText}
            value={text}
            placeholder="Type here..."
            onKeyPress={handleKeyPress}
            multiline
            ></TextInput>
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
