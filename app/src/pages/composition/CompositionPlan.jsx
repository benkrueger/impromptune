import React, { Component } from 'react';

class CompositionPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      compositionPlan: "No plan generated yet.",
      numberOfRenditions: 1,
      temperature: 0.5
    };
    this.updateCompositionPlan = this.updateCompositionPlan.bind(this);
    this.handleRenditionsChange = this.handleRenditionsChange.bind(this);
    this.handleTemperatureChange = this.handleTemperatureChange.bind(this);
  }

  updateCompositionPlan(input) {
    this.setState({ compositionPlan: input });
  }

  handleRenditionsChange(event) {
    this.setState({ numberOfRenditions: event.target.value });
  }

  handleTemperatureChange(event) {
    this.setState({ temperature: event.target.value });
  }

  componentDidCatch(error, info) {
    console.log('Error:', error);
    console.log('Info:', info);
  }

  render() {
    return (
      <div style={{ flex: 1, border: '1px solid black' }}>
        <h2>Composition Plan</h2>
        <textarea 
          value={this.state.compositionPlan} 
          onChange={e => this.updateCompositionPlan(e.target.value)} 
          style={{ width: '100%', height: '90%' }} 
        />
        <button onClick={this.props.composeScore}>Compose Score</button>
        <label>
          Number of Renditions:
          <select value={this.state.numberOfRenditions} onChange={this.handleRenditionsChange}>
            {[...Array(7).keys()].map(i => 
              <option key={i+1} value={i+1}>{i+1}</option>
            )}
          </select>
        </label>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <label style={{ marginRight: '10px' }}>Temperature: {this.state.temperature}</label>
          <input type="range" min="0" max="1" value={this.state.temperature} onChange={this.handleTemperatureChange} step="0.01" />
        </div>
      </div>
    );
  }
}

export default CompositionPlan;
