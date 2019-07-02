import React, { Component } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button, Image, Input, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import AsyncStorage from '@react-native-community/async-storage';

import Api from '../../utils/api';

export default class Home extends Component {

  static navigationOptions = {
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: '#E67E22',
    },
    containerStyle:{
      flex:1,
    },
    headerLeft: (
      <Image 
        style={{width: 75, height: 50, marginLeft:5, resizeMode:'contain'}} 
        source={require('../img/logo.png')}
      />
    ),
    headerTitle: (
      <Image 
        style={{ width: 100, height: 80, marginLeft: 78, resizeMode:'contain'}} 
        source={require('../img/texto.png')}
      />
    )
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: false,
      text: '',
      series: []
    }
  }
  
  handleButtonPress = async () => {
    if(this.state.data){
      this.setState({data: false, text:''})
    } 
    else{
      this.setState({loading: true})
      const token = await AsyncStorage.getItem('@userToken');
      const response = await Api.getSearchSeries(token, this.state.text);
      const responseJSON = await response.json(); 
      this.setState({series: responseJSON.data});
      this.setState({loading: false, data: true})
    }                     
  }

  handleChange (text){
    this.setState({text});
  }

  loader = () => {
    return(
      <ActivityIndicator color='#E67E22' size='large'/>
    );
  }

  emptyList = () => {
    return(
      <View style={styles.emptyList}>
        <Icon name='database' size={100} color='gray'/>
        <Text style={{paddingTop:10, fontSize: 18, fontWeight: 'bold' }}>Sin resultados</Text>
      </View>
    );
  }
  
  emptyComponent = () => {
    return(<View/>);
  }

  renderSerie = ({item}) => {
    return (
      <TouchableOpacity 
        style={{flex:1}}
        onPress={() => {
          this.props.navigation.navigate('Results', {itemId: item.id, itemName: item.seriesName});
        }
        }>
        <View style={styles.container} > 
          <Text style={styles.title} > {item.seriesName} </Text>
          <Image 
            style={styles.banner}
            PlaceholderContent={this.loader} 
            source={{
              uri: item.banner
                ? `https://www.thetvdb.com/banners/${item.banner}`
                : 'https://www.profesionalcerca.com/imgs/no-img.jpg'
            }}
          />
        </View> 
      </TouchableOpacity>
    );
  }

  renderSeries = () => {
    return(
      <FlatList
        data = {this.state.series}
        renderItem = {this.renderSerie}
        keyExtractor = {(item) => item.id.toString()}
        ListEmptyComponent = {this.emptyList}
      />
    );
  }

  iconChange = () =>{
    if(this.state.data){
      return(
        <Icon name='remove' size={35} color='#E74C3C'/>
      );
    }
    return(
      <Icon name='search' size={35} color='#828282'/>
    );
  }

  render() {
    return(
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Input
            value= {this.state.text}
            placeholder= 'Serie a buscar...'
            containerStyle={styles.searchBar}
            onChangeText = {value => this.handleChange(value)}
          />
          <Button 
            raised 
            type='outline'
            buttonStyle={styles.searchButton}
            onPress={this.handleButtonPress}
            icon={this.iconChange}
          />
        </View>
        <View style={{flex:1}}>            
          {
            this.state.loading
            ? this.loader()
            : this.state.data
              ? this.renderSeries()
              : this.emptyComponent()
          }
        </View>
      </View>
    );    
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F0EB',
  },
  header:{
    backgroundColor:'#E67E22',
    paddingBottom:10
  },
  searchContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginBottom: 20,
    paddingTop:10
  },
  searchButton: {
    width: 50,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'gray'
  },
  searchBar:{
    width: '80%'
  },
  emptyList:{
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center"
  },
  title:{
    paddingLeft: 20,
    paddingBottom: 5
  },
  banner:{
    alignSelf: 'center',
    width: '85%', 
    height: 120, 
    marginBottom: 25
  }
});
