import React, { Component } from 'react';
import ABCJS from 'abcjs/midi';

class Synthesizer extends Component {
  state = {
    isAudioSupported: true
  };

  componentDidMount() {
    this.checkAudioSupport();
  }

  checkAudioSupport = () => {
    const isSupported = ABCJS.synth.supportsAudio();
    this.setState({ isAudioSupported: isSupported });
  }

  render() {
    const { isAudioSupported } = this.state;
    return (
      <div>
        {isAudioSupported ? "Audio is supported" : "Audio is not supported"}
      </div>
    );
  }
}
export default Synthesizer;
