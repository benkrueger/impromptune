import React from "react";
import ROUTES from "Constants/routes";
import { useNavigate } from "react-router-dom";
import {
  validateLicenseRequest,
  validateLicenseResponse,
} from "secure-electron-license-keys";

class Nav extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mobileMenuActive: false,
      licenseModalActive: false,

      // license-specific
      licenseValid: false,
      allowedMajorVersions: "",
      allowedMinorVersions: "",
      appVersion: "",
      licenseExpiry: "",
    };

    this.toggleMenu = this.toggleMenu.bind(this);
    this.navigate = this.navigate.bind(this);
  }

  componentWillUnmount() {
    window.api.licenseKeys.clearRendererBindings();
  }

  componentDidMount() {
    // Set up binding to listen when the license key is
    // validated by the main process
    const _ = this;

    window.api.licenseKeys.onReceive(validateLicenseResponse, function (data) {
      // If the license key/data is valid
      if (data.success) {
        // Here you would compare data.appVersion to
        // data.major, data.minor and data.patch to
        // ensure that the user's version of the app
        // matches their license
        _.setState({
          licenseValid: true,
          allowedMajorVersions: data.major,
          allowedMinorVersions: data.minor,
          allowedPatchVersions: data.patch,
          appVersion: data.appVersion,
          licenseExpiry: data.expire,
        });
      } else {
        _.setState({
          licenseValid: false,
        });
      }
    });
  }

  toggleMenu(_event) {
    this.setState({
      mobileMenuActive: !this.state.mobileMenuActive,
    });
  }

  // Using a custom method to navigate because we
  // need to close the mobile menu if we navigate to
  // another page
  navigate(url) {
    this.setState(
      {
        mobileMenuActive: false,
      },
      function () {
        this.props.navigate(url);
      }
    );
  }

  render() {
    return (
      <nav
        className="navbar is-dark"
        role="navigation"
        aria-label="main navigation">
        <div className="navbar-brand">
          <a
            role="button"
            className={`navbar-burger ${
              this.state.mobileMenuActive ? "is-active" : ""
            }`}
            data-target="navbarBasicExample"
            aria-label="menu"
            aria-expanded="false"
            onClick={this.toggleMenu}
            onKeyDown={this.toggleMenu}>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
        <div
          id="navbarBasicExample"
          className={`navbar-menu ${
            this.state.mobileMenuActive ? "is-active" : ""
          }`}>
          <div className="navbar-start">
            <a
              className="navbar-item"
              onClick={() => this.props.navigate(ROUTES.COMPOSITION)}
              onKeyDown={() => this.props.navigate(ROUTES.COMPOSITION)}>
              Composition
            </a>
            <a
              className="navbar-item"
              onClick={() => this.props.navigate(ROUTES.OUTPUT_PLAN)}
              onKeyDown={() => this.props.navigate(ROUTES.OUTPUT_PLAN)}>
              Composition Plan
            </a>
          </div>
          <div className="navbar-end">
          </div>
        </div>
      </nav>
    );
  }
}

function WithNavigate(props){
  const navigate = useNavigate();
  return <Nav {...props} navigate={navigate} />
}

export default WithNavigate;

