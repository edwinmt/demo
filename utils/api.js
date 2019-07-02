import React, {Component} from 'react'

const BASE_API = 'https://api.thetvdb.com'

class Api {

  async postLogin(){
    const headers= {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
    
    const credentials= {
        apikey: 'PPDZ39EGKOEHNR3R',
        userkey: 'JOEZYXMFGR0RDBXA',
        username: 'tavromero2yu',
    }
    const query = await fetch(`${BASE_API}/login`, {
        method: 'POST',
        headers,
        body: JSON.stringify(credentials),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson.token;
    })
    .catch((error)=>{
      console.log(error);
      error;
    })
    return query;
  }

  async getSearchSeries(token, search) {
    return fetch(`${BASE_API}/search/series?name=${search}`, {
      headers: {
        Accept: 'application/json',
       'Authorization': 'Bearer ' + token 
      }
    })
    .catch((error)=> {
      console.log("error getSearchSeries ",error);
    })
  }
  
  async getDetails(token, id) {
    return fetch(`${BASE_API}/series/${id}`, {
      headers: {
        Accept: 'application/json',
       'Authorization': 'Bearer ' + token 
      }
    })
    .catch((error)=> {
      console.log("error getDetails ",error);
    })
  }

  async getDetailsExtends(imbdId, apikey) {
    return fetch(`${BASE_API}/?i=${imbdId}&apikey=${apikey}&plot=full`)
    .catch((error)=> {
      console.log("error getDetailsExtends ",error);
    })
  }
  
  async getActors(token,id) {
    return fetch(`${BASE_API}/series/${id}/actors`, {
      headers: {
        Accept: 'application/json',
       'Authorization': 'Bearer ' + token 
      }
    })
    .catch((error)=> {
      console.log("error getActors ",error);
    })
  }
  
  async getEpisodes(token, id, temporada) {
    return fetch(`${BASE_API}/series/${id}/episodes/query?airedSeason=${temporada}`,{
      headers: {
        Accept: 'application/json',
        'Authorization': 'Bearer ' + token 
      }
    })
    .catch((error)=> {
      console.log("error getActors ",error);
    })
  }
}

export default new Api()
