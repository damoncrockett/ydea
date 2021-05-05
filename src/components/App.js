import React, { Component } from 'react';
import Field from './Field';
import { select } from 'd3-selection';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { // global state
      data: null,

    };

    this.getData = this.getData.bind(this);

  }

  getData() {
    //fetch('http://localhost:8888/ydea.json')
    fetch('ydea.json')
      .then(response => response.json())
      .then(data => this.setState({ data: data }))
    }

  componentDidMount() {
    this.getData();
  }

  render() {


    return (
      <div className='app'>
        <Field
          data={this.state.data}
        />
      </div>
    );
  }
}

export default App;
