import React from "react";

class About extends React.Component {
  render() {
    return (
      <section className="section">
          <div className="container">
              <h1 className="title is-1">About</h1>
          </div>
          <div className="container mt-2">
              This is an AI powered music Composition app. Input an inspiration for a song, and go from there.
          </div>

      </section>
    );
  }
}

export default About;
