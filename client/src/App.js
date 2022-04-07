import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import './App.css';

import { Route, Routes } from 'react-router-dom';

import UserDataService from './services/user.service'

import Header from './components/Header';
import Profile from './components/Profile';
import Workouts from './components/Workouts';

class App extends Component {

  state = {
    userInfo: {},
  }

  getUserInfo() {
      UserDataService.getAuthenticatedUser()
        .then((response) => {
          this.setState( { userInfo: response.data } );
        })
        .catch((e) => {
          console.log(e);
        });
  }

  componentDidMount() {
      this.getUserInfo();
  }

  render() {
    return (
      <div className="App fill-window">
        <Header profile_image={this.state.userInfo.profile_image}/>
        <Routes>
          <Route path='profile' element={<Profile userInfo={this.state.userInfo} />} />
          <Route path='workouts' element={<Workouts />} />
        </Routes>
      </div>
    );
  }
}

export default App;
