import React, { Component, useState } from 'react';
import Alert from "react-bootstrap/Alert"
import Button from 'react-bootstrap/Button';
function ErrorAlert(props) {
  const [show, setShow] = useState(true);
  if (show) {
    return (
      <Alert variant="danger" onClose={() => setShow(false)} dismissible>
        <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
        <p>
          Change this and that and try again. Duis mollis, est non commodo
          luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
          Cras mattis consectetur purus sit amet fermentum.
        </p>
      </Alert>
    );
  }
  return <Button onClick={() => setShow(true)}>Show Alert</Button>;
}

// class ErrorAlert extends Component {
//   constructor(props) {
//     super(props)
//   }

//   render() {
//     return (
//       <div className="alert alert-danger alert-dismissible">
//         <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
//         <span>{this.props.msg}</span>
//       </div>
//     )
//   }
// }

export default ErrorAlert
