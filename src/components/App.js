import React, { Component } from 'react';
import Field from './Field';
import { select } from 'd3-selection';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { // global state
      nav: null,
      data: null,

    };

    this.getNav = this.getNav.bind(this);
    this.getData = this.getData.bind(this);
    this.getCoords = this.getCoords.bind(this);

  }

  getNav() {
    //fetch('http://localhost:8888/nav.json')
    fetch('nav.json')
      .then(response => response.json())
      .then(data => this.setState({ nav: data }))
  }

  getData() {
    //fetch('http://localhost:8888/ydea.json')
    fetch('ydea.json')
      .then(response => response.json())
      .then(data => this.setState({ data: data }))
  }

  getCoords() {
    //fetch('http://localhost:8888/coords.json')
    fetch('coords.json')
      .then(response => response.json())
      .then(data => this.setState({ coords: data }))
  }

  componentDidMount() {
    this.getNav();
    this.getData();
    this.getCoords();
  }

  render() {


    return (
      <div className='app'>
        <Field
          nav={this.state.nav}
          data={this.state.data}
          coords={this.state.coords}
        />
      </div>
    );
  }
}

export default App;
