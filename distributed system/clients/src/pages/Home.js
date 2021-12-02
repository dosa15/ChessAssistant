import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ButtonGroup, Button, Modal } from 'react-bootstrap';
import { db } from "../services/firebase";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import { useHistory } from 'react-router-dom';

// function NavUser(path) {
// 	let history = useHistory();

// 	const redirect = () => {
// 		history.push('/' + path);
// 	}
  
// 	return (
// 		<Button className={ (path === 'master' ? "btn btn-dark" : "") + "mx-2"} id="masterUser" type="checkbox" onClick={redirect}>
// 			{path.toUpperCase()}
// 		</Button>
// 	)
// }


export default class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// user: auth().currentUser,
			user: "",
			chats: [],
			value: '',
			client: true,
			master: null,
			client1: null,
			client2: null,
			computed1: false,
			computed2: false, 
			readError: null,
			writeError: null,
			loadingChats: false,
			roleChosen: false,
			showModal: true
		};
	}

  	render() {
		return (
			// <div className="home">
			// 	<Header></Header>
			// 	<section>
			// 		<div className="jumbotron jumbotron-fluid py-5">
			// 		<div className="container text-center py-5">
			// 			<h1 className="display-4">Welcome to Chatty</h1>
			// 			<p className="lead">A great place to share your thoughts with friends</p>
			// 			<div className="mt-4">
			// 			<Link className="btn btn-primary px-5 mr-3" to="/signup">Create New Account</Link>
			// 			<Link className="btn px-5" to="/login">Login to Your Account</Link>
			// 			</div>
			// 		</div>
			// 		</div>
			// 	</section>
			// 	<Footer></Footer>
			// </div>
			<Modal
				show={true}
				dialogClassName="modal-90w"
				aria-labelledby="contained-modal-title-vcenter"
			>
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-vcenter">
						Choose User
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Row className="text-center justify-content-center">
						<ButtonGroup>
							<Link to="/master">
								<Button className="btn btn-dark mx-2" id="masterUser" type="checkbox" checked={!this.state.client} onClick={(e) => {
									this.setState({ client: false, user: "MASTER"});
									// this.loadMasterData();
									// e.currentTarget.style.className = "mx-2"
									document.getElementById("masterUser").style.className = "mx-2";
									document.getElementById("clientUser1").style.className = "btn btn-dark mx-2";
									document.getElementById("clientUser2").style.className = "btn btn-dark mx-2";
								}}>
									MASTER
								</Button>
							</Link>
							<Link to="/client1">
								<Button className="mx-2" id="clientUser1" type="checkbox" checked={this.state.client} onClick={(e) => {
									this.setState({ client: true, user: "CLIENT1" });
									// this.loadMasterData();
									// e.currentTarget.style.className = "mx-2"
									document.getElementById("masterUser").style.className = "btn btn-dark mx-2";
									document.getElementById("clientUser1").style.className = "mx-2";
									document.getElementById("clientUser2").style.className = "btn btn-dark mx-2";
								}}>
									CLIENT 1
								</Button>
							</Link>
							<Link to="/client2">
								<Button className="mx-2" id="clientUser2" type="checkbox" checked={this.state.client} onClick={(e) => {
									this.setState({ client: true, user: "CLIENT2" });
									// this.loadMasterData();
									// e.currentTarget.style.className = "mx-2"
									document.getElementById("masterUser").style.className = "btn btn-dark mx-2";
									document.getElementById("clientUser1").style.className = "btn btn-dark mx-2";
									document.getElementById("clientUser1").style.className = "mx-2";
								}}>
									CLIENT 2
								</Button>
							</Link>
						</ButtonGroup>
						{/* <Col>
							<Button value="Master" onClick={(e) => {this.loadMasterData(e)}} value = "Master"> Master</Button>
						</Col>
						<Col>
							<Button value="Client1" onClick={(e) => { this.loadMasterData(e) }} value="Client1">Client1</Button>
						</Col>
						<Col>
							<Button onClick={(e) => { this.loadMasterData(e) }} value="Client2">Client2</Button>
						</Col> */}
					</Row>
				</Modal.Body>
			</Modal>
		)
	}
}
