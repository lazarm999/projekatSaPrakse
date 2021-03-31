import React from 'react';
import { Translate } from "react-localize-redux";
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import DetailsArea from './DetailsArea/DetailsArea';

class GeographyDetailsModal extends React.Component {

  render() {
    return (
      <div>
        <Modal isOpen={this.props.isShown} centered={true} toggle={this.props.close}>
          <ModalHeader toggle={this.props.close} style={{ fontSize: "50px" }}>
            <p style={{ fontSize: "25px",marginBottom: "0px" }}>
              {this.props.isRegionShown ?
                this.props.selectedGeography.id === 836 ? "Grad Beograd" : <Translate id="map.region" data={{ name: this.props.selectedGeography.name }} /> :
                <Translate id="map.municipality" data={{ name: this.props.selectedGeography.name }} />}
            </p>
          </ModalHeader>
          <ModalBody>
            <DetailsArea selectedGeography={this.props.selectedGeography} isRegionShown={this.props.isRegionShown} />
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default GeographyDetailsModal;