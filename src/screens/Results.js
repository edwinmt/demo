import React, {Component} from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator } from 'react-native';
import { ButtonGroup, Text, Image }from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import AsyncStorage from '@react-native-community/async-storage';
import Api from '../../utils/api'

export default class Results extends Component{

  static navigationOptions = {
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: '#E67E22',
    },
    containerStyle:{
      flex:1,
    },
    headerRight: (
      <Image 
        style={{width: 75, height: 50, marginRight: 5, }} 
        source={require('../img/logo.png')}
      />
    ),
    headerTitle: (
      <Image 
        style={{ width: 100, height: 80, resizeMode:'contain' ,marginLeft: 70}} 
        source={require('../img/texto.png')}
      />
    )
  }

  constructor () {
    super()
    this.state = {
      index: 0,
      loading: false,
      details: [],
      detailsExtends: [],
      episodes: [],
      actors: []
    }
    this.updateIndex = this.updateIndex.bind(this)
    this.renderDetails = this.renderDetails.bind(this)
    this.renderEpisodes = this.renderEpisodes.bind(this)
    this.renderActors = this.renderActors.bind(this)
  }
  
  getDetails = async () => {
    this.setState({loading: true})
    const token = await AsyncStorage.getItem('@userToken');
    const serieId = this.props.navigation.getParam('itemId','No paso Id')
    const response = await Api.getDetails(token, serieId);   
    const responseJSON = await response.json()  
    this.setState({details: responseJSON.data});
    const apiKey= 'PPDZ39EGKOEHNR3R';
    const Response = await Api.getDetailsExtends(this.state.details.imdbId, token);
    const ResponseJSON = await Response.json()
    this.setState({detailsExtends: ResponseJSON, loading: false});
    console.log(ResponseJSON); 
  }

  getEpisodes = async () => {
    this.setState({loading: true})
    const token = await AsyncStorage.getItem('@userToken');
    const serieId = this.props.navigation.getParam('itemId','No paso Id');
    const response = await Api.getEpisodes(token, serieId, 1);
    const responseJSON = await response.json(); 
    this.setState({episodes: responseJSON.data, loading: false}); 
  }

  getActors = async () => {
    this.setState({loading: true})
    const token = await AsyncStorage.getItem('@userToken');
    const serieId = this.props.navigation.getParam('itemId','No paso Id');
    const response = await Api.getActors(token, serieId);
    const responseJSON = await response.json(); 
    this.setState({actors: responseJSON.data, loading: false});                   
  }

  componentDidMount(){
    this.getDetails();
    this.getActors();
    this.getEpisodes();
  }

  updateIndex (index) {
    this.setState({index})
  }
  
  loader = () => {
    return(
      <ActivityIndicator color='#E67E22' size='large'/>
    );
  }

  emptyList = () => {
    return(
      <View style={styles.emptyList}>
        <Icon name='tv' size={80} color='gray'/>
        <Text style={styles.textEmptyList}>Sin resultados</Text>
      </View>
    );
  }

  renderDetails = () => {
    const details=this.state.details;
    const detailsExtends=this.state.detailsExtends;
    return (
      <View style={styles.renderDetails}> 
        <View style={styles.renderDetailsImgContainer}>
          <Image 
            style={styles.renderDetailsImg}
            PlaceholderContent={this.loader} 
            source={{uri: detailsExtends.banner 
                    ? `https://www.thetvdb.com/banners/${detailsExtends.Poster}`
                    : 'https://www.trzcacak.rs/myfile/detail/203-2033863_aws-simple-icons-non-service-specific-user-default.png'
                    }} 
          />
          <View style={styles.renderDetailsText}>
            <Text>Genero: {detailsExtends.Genre} </Text>
            <Text>Primera Emision: {details.firstAired}</Text>
            <Text>Horario: {details.airsTime} {details.airsDayOfWeek} </Text>
            <Text>Numero de temporadas: {detailsExtends.totalSeasons} </Text>
            <Text>Calificación: {detailsExtends.imbdRating}</Text>
          </View>
        </View>
        <Text>Sinopsis:</Text>
        <Text>{details.overview}</Text>
      </View> 
    );
  }

  renderEpisode = ({item}) => {
    return (
      <View style={styles.renderEpisode}> 
        <Image 
          style={styles.renderEpisodeImg}
          PlaceholderContent={this.loader} 
          source={{uri: item.filename
                  ? `https://www.thetvdb.com/banners/${item.filename}`
                  : 'https://www.profesionalcerca.com/imgs/no-img.jpg'
          }}  
        />
        <View  style={styles.renderEpisodeTextContainer} >
          <Text style={styles.renderEpisodeName}>{item.episodeName}</Text>
          <Text style={styles.renderEpisodeOverview}>{item.overview}</Text>
          <View style={styles.renderEpisodeTextSubContainer}>
            <Text style={styles.renderEpisodeSubText}>Emitido: {item.firstAired}</Text>
            <Text style={styles.renderEpisodeSubText}>Calificación: {item.siteRating}</Text>
          </View>
        </View>
      </View> 
    );
  }
  
  renderActor = ({item}) => {
    return (
      <View style={styles.renderActor}>  
        <Image 
          style={styles.renderActorImg}
          PlaceholderContent={this.loader} 
          source={{uri: item.image
                  ? `https://www.thetvdb.com/banners/${item.image}`
                  : 'https://www.trzcacak.rs/myfile/detail/203-2033863_aws-simple-icons-non-service-specific-user-default.png'
          }} 
        />
        <Text style={styles.renderActorName}>{item.name}</Text>
        <Text style={styles.renderActorCharacter}>{item.role}</Text>
      </View> 
    );
  }

  renderEpisodes = () => {
    return (
      <View style={styles.container}>
        <FlatList
          data = {this.state.episodes}
          renderItem = {this.renderEpisode}
          keyExtractor = {(item) => item.id.toString()}
          ListEmptyComponent = {this.emptyList}
        />
      </View>
    )
  }
  
  renderActors = () => {
    return (    
      <FlatList
        key={(this.state.index ? 'h' : 'v')}
        numColumns={3}
        data = {this.state.actors}
        renderItem = {this.renderActor}
        keyExtractor = {(item) => item.id.toString()} 
        ListEmptyComponent = {this.emptyList}
      />
    )
  }
  
  render () {
    const serieName = this.props.navigation.getParam('itemName','error')
    const buttons =['Detalles','Capitulos','Actores'];
    const Index = this.state.index;
    return (
      <View style={styles.container}>
        <Text h3 style={styles.alignName}>{serieName}</Text>
        <ButtonGroup
          onPress={this.updateIndex}
          selectedIndex={Index}
          buttons={buttons}
          containerStyle={styles.buttonGroup}
          selectedButtonStyle={{backgroundColor: '#E67E22'}}
        />
        <View style={styles.container}>
          {
          this.state.loading
          ? this.loader()
          : Index===0 
            ? this.renderDetails()
            : Index===1 
              ? this.renderEpisodes()
              : this.renderActors()
          }
        </View>  
      </View>       
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F0EB',
    paddingTop: 5
  },
  emptyList:{
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    alignContent:'center'
  },
  textEmptyList:{
    paddingTop:10, 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  renderDetails:{
    flex: 1, paddingHorizontal: 5
  },
  renderDetailsImgContainer:{
    flexDirection: 'row', 
    paddingBottom: 10
  },
  renderDetailsImg:{
    width: 100, 
    height: 130
  },
  renderDetailsText:{
    flex: 1, 
    paddingLeft: 10, 
    justifyContent: 'space-between'
  },
  renderEpisode:{
    flex: 1, 
    flexDirection: 'row', 
    marginHorizontal: 10, 
    marginBottom: 5
  },
  renderEpisodeImg:{
    width: 150, 
    height: 90
  },
  renderEpisodeTextContainer:{
    flex: 1, 
    marginHorizontal: 5
  },
  renderEpisodeName:{
    fontSize: 16, 
    height: 20, 
    fontWeight:'bold'
  },
  renderEpisodeOverview:{
    fontSize: 12, height: 60
  },
  renderEpisodeTextSubContainer:{
    flexDirection: 'row',
    justifyContent:'space-between'
  },
  renderEpisodeSubText:{
    fontSize: 10, 
    fontWeight:'bold'
  },
  renderActor:{
    flex: 1, 
    alignItems:'center',
    justifyContent: 'space-evenly', 
    marginBottom: 5
  },
  renderActorImg:{
    width: 100, 
    height: 130
  },
  renderActorName:{
    fontSize: 10
  },
  renderActorCharacter:{
    fontSize: 8
  },
  buttonGroup:{
    height: 40, 
    backgroundColor: 'white',
    marginBottom: 15
  },
  alignName:{
    alignSelf:'center'
  },
});