import React, { Component } from 'react';
import abcjs from 'abcjs';
import { generateRendition } from './lcutils';

class Key extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keys: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
      selectedKey: 'C'
    };
  }

  handleChange = (event) => {
    this.setState({selectedKey: event.target.value});
  }

  render() {
    return (
      <select value={this.state.selectedKey} onChange={this.handleChange}>
        {this.state.keys.map((key, index) => <option key={index} value={key}>{key}</option>)}
      </select>
    );
  }
}

class TimeSignature extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeSignatures: ['2/4', '3/4', '4/4', '5/4', '6/4', '7/4'],
      selectedTimeSignature: '4/4'
    };
  }

  handleChange = (event) => {
    this.setState({selectedTimeSignature: event.target.value});
  }

  render() {
    return (
      <select value={this.state.selectedTimeSignature} onChange={this.handleChange}>
        {this.state.timeSignatures.map((timeSignature, index) => <option key={index} value={timeSignature}>{timeSignature}</option>)}
      </select>
    );
  }
}


class Inspiration extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      inspiration: this.props.inspiration,
      temperature: 0.5,
      selectedKey: 'C',
      selectedTimeSignature: '4/4'
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleGenerate = this.handleGenerate.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleTemperatureChange = this.handleTemperatureChange.bind(this);
    this.handleKeyChange = this.handleKeyChange.bind(this);
    this.handleTimeSignatureChange = this.handleTimeSignatureChange.bind(this);
  }

  componentDidCatch(error, info) {
    console.log('Error:', error);
    console.log('Info:', info);
  }

  handleChange(event) {
    this.setState({inspiration: event.target.value});
    this.props.setInspiration(event.target.value);
  }

  handleGenerate() {
    this.props.generateOutput();
  }

  handleKeyPress(event) {
    if(event.key === 'Enter'){
      this.handleGenerate();
    }
  }

  handleTemperatureChange(event) {
    this.setState({temperature: event.target.value});
  }

  handleKeyChange(event) {
    this.setState({selectedKey: event.target.value});
  }

  handleTimeSignatureChange(event) {
    this.setState({selectedTimeSignature: event.target.value});
  }

  render() {
    return (
      <div style={{ position: 'relative', height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <textarea value={this.state.inspiration} onChange={this.handleChange} onKeyPress={this.handleKeyPress} style={{ width: '80%', height: 'calc(50% - 50px)', boxSizing: 'border-box' }} />
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', position: 'absolute', bottom: 0 }}>
          <button onClick={this.handleGenerate} style={{ height: '50px', width: '10%' }}>Generate Piece</button>
          <TimeSignature style={{ height: '50px', width: '10%' }} onChange={this.handleTimeSignatureChange} value={this.state.selectedTimeSignature} />
          <Key style={{ height: '50px', width: '10%' }} onChange={this.handleKeyChange} value={this.state.selectedKey} />
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <label style={{ marginRight: '10px' }}>Temperature: {this.state.temperature}</label>
            <input type="range" min="0" max="1" value={this.state.temperature} onChange={this.handleTemperatureChange} step="0.01" />
          </div>
        </div>
      </div>
    );
  }
}

export default Inspiration;
