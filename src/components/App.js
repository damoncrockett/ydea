import React, { Component } from 'react';
import Field from './Field';
import { select } from 'd3-selection';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { // global state
      nav: null,
      data: null,
      coords: null,
      nn: null,
      nnToggle: false
    };

    this.getNav = this.getNav.bind(this);
    this.getData = this.getData.bind(this);
    this.getCoords = this.getCoords.bind(this);
    this.getNN = this.getNN.bind(this);
    this.handleNN = this.handleNN.bind(this);

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

  getNN() {
    //fetch('http://localhost:8888/nn.json')
    fetch('nn.json')
      .then(response => response.json())
      .then(data => this.setState({ nn: data }))
  }

  handleNN() {
    this.setState(state => ({
      nnToggle: !this.state.nnToggle
    }));
  }

  componentDidMount() {
    this.getNav();
    this.getData();
    this.getCoords();
    this.getNN();
  }

  render() {

    const stroke = '#424242'; // dark
    const bkgd = '#dddddd'; // light

    const nnStyle = {
      backgroundColor: this.state.nnToggle ? stroke : bkgd,
      color: this.state.nnToggle ? bkgd : stroke
    };

    return (
      <div className='app'>
        <div className='buttonStrip'>
          <button onClick={this.handleNN} style={nnStyle}>NEAREST NEIGHBORS</button>
        </div>
        <div>
          <Field
            nav={this.state.nav}
            data={this.state.data}
            coords={this.state.coords}
            nnToggle={this.state.nnToggle}
            nn={this.state.nn}
          />
        </div>
      </div>
    );
  }
}

export default App;
