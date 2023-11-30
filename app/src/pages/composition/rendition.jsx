import React, { Component } from 'react';
import abcjs from 'abcjs';

class Rendition extends Component {
  constructor(props) {
    super(props);
    this.visualObj = React.createRef();
    this.exportSVG = this.exportSVG.bind(this);
    this.parseTitle = this.parseTitle.bind(this);
  }

  componentDidCatch(error, info) {
    console.log('Error:', error);
    console.log('Info:', info);
  }

  componentDidMount() {
    abcjs.renderAbc(this.visualObj.current, this.props.abcString);
  }

  parseTitle() {
    const tunebook = new abcjs.TuneBook(this.props.abcString);
    const firstTune = tunebook.tunes[0];
    return firstTune.title;
  }

  exportSVG() {
    const svgData = this.visualObj.current.innerHTML;
    const blob = new Blob([svgData], {type: "image/svg+xml"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.parseTitle()}.svg`;
    link.click();
  }

  render() {
    return (
      <div style={{ flex: 1, border: '1px solid black' }}>
        <h2>Output</h2>
        <div ref={this.visualObj} style={{ width: '100%', height: '90%' }} />
        <button onClick={this.exportSVG}>Export</button>
      </div>
    );
  }
}

export default Rendition;
