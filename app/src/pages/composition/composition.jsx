import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import { Tabs, Tab } from 'react-bootstrap';
import { generateCompositionPlan, generateMusicalRendition } from './lcutils';
import Inspiration from './inspiration';
import CompositionPlan from './CompositionPlan';
import path from 'path';

class Composition extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      inspiration: '', 
      compositionPlan: '',
      title: 'Untitled'
    };
    
    // Set up the path for the application data
    this.impromptunePath = path.join(ipcRenderer.sendSync('getAppPath'), '.impromptune');
    // Check if the directory exists and create it if it doesn't
    // This is done in the main process via IPC
    ipcRenderer.send('checkAndCreateDirectory', this.impromptunePath);
  }

  componentDidCatch(error, info) {
    console.log('Error:', error);
    console.log('Info:', info);
  }

  persistState = () => {
    const filePath = path.join(this.impromptunePath, `${this.state.title}.json`);
    // Send a message to the main process to write the current state to a file
    ipcRenderer.send('writeFile', { filePath, content: JSON.stringify(this.state) });
  };

  generateOutput = async () => {
    console.log("Generating..")
    let compositionPlan = await generateCompositionPlan(this.state.inspiration, 'C', '4/4');
    console.log(compositionPlan)
    this.setState({compositionPlan: compositionPlan}, this.persistState);

  };

  render() {
    return (
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
        <Inspiration 
          style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
          inspiration={this.state.inspiration} 
          setInspiration={async (inspiration) => {
            this.setState({inspiration});
            const compositionPlan = await generateCompositionPlan(inspiration, 'C', '4/4');
            this.setState({output: compositionPlan}, this.persistState);
            // Assuming there is a ref to the CompositionPlan component
            this.compositionPlanRef.current.updateCompositionPlan(compositionPlan);
          }} 
          generateOutput={this.generateOutput} 
        />
      </div>
    );
  }
}

export default Composition;
