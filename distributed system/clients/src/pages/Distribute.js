import React, { useEffect, useState, Component, Alert } from "react";
import { ButtonGroup, Button } from 'react-bootstrap';
import Header from "../components/Header";
import { auth } from "../services/firebase";
import { db } from "../services/firebase";
import { Modal } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Popup from 'reactjs-popup';

const EventEmitter = require('events');

const bus = new EventEmitter();
let lock = false;

async function lockable(userState) {
    if (lock) await new Promise(resolve => bus.once('unlocked', resolve));
    
    lock = true;
    if(userState != null)
    	lock = false;
    bus.emit('unlocked');
}

export default class Distribute extends Component {
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
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.loadMasterData = this.loadMasterData.bind(this);
		this.myRef = React.createRef();
	}
	async clearServerData() {
		await db.ref("MASTER").set({
			user: null,
			value: null,
			timestamp: null
		});
		await db.ref("CLIENT1").set({
			user: null,
			value: null,
			timestamp: null
		});
		await db.ref("CLIENT2").set({
			user: null,
			value: null,
			timestamp: null
		});
	}

	async loadMasterData() {
		this.setState({
			showModal: false
		})

		// if(!this.state.user) {
		// 	window.setTimeout(this.state.user, 10);
		// 	return;
		// }

		this.setState({ readError: null, loadingChats: true });
		const chatArea = this.myRef.current;
		try {
			// let chats = [];
			// if (this.state.user === "MASTER") {
				db.ref("MASTER").on("value", snapshot => {
					// snapshot.forEach((snap) => {
					//   chats.push(snap.val());
					// });

					if(snapshot.exists()) {
						// chats.push(snapshot.val());
						this.setState({ master: snapshot.val() });
						// if(initial) {
						// 	this.setState({ client1: snapshot.val() });
						// 	this.setState({ client2: snapshot.val() });
						// }
						// console.log(`Master Value: ${this.state.master.value}`);
					}
				});

			//} else 
			if(this.state.user === "CLIENT1") {
				console.log("This is client 1");

				db.ref("MASTER").on("value", snapshot => {
					if(snapshot.exists()) {
						this.setState({ client1: snapshot.val() });
						this.computeClientData(this.state.client1, 1);
					}
				})

				
			} else if (this.state.user === "CLIENT2") {
				console.log("This is client 2");
				
				db.ref("MASTER").on("value", snapshot => {
					if(snapshot.exists()) {
						this.setState({ client2: snapshot.val() });
						this.computeClientData(this.state.client2, 2);
					}
				});

				
			}
			/*
			db.ref("CLIENT1").on("value", snapshot => {
				// snapshot.forEach((snap) => {
				//   chats.push(snap.val());
				// });
				if(snapshot.exists()) {
					// chats.push(snapshot.val());
					this.setState({ client1: snapshot.val() })
					console.log(`Client1 Value: ${this.state.client1.value}`);
				}
			});
		
			db.ref("CLIENT2").on("value", snapshot => {
				// snapshot.forEach((snap) => {
				//   chats.push(snap.val());
				// });
				if (snapshot.exists()) {
					// chats.push(snapshot.val());
					this.setState({ client2: snapshot.val() });
					console.log(`Client2 Value: ${this.state.client2.value}`);
				}
			});
			*/
		
			// while(this.state.master.value === this.state.client1.value);
			// console.log("While over");
			
			// chats.sort(function (a, b) { return a.timestamp - b.timestamp })
			chatArea.scrollBy(0, chatArea.scrollHeight);
			this.setState({ loadingChats: false });//, computed1: false, computed2: false });

			// if(this.state.user == "MASTER") {
				
			// }
			
			// this.setState({ chats });
		} catch (error) {
			this.setState({ readError: error.message, loadingChats: false });
		}
	}

	async loadClientData() {
		this.setState({ readError: null, loadingChats: true });
		const chatArea = this.myRef.current;
		try {
			// let chats = [];
			db.ref("CLIENT1").on("value", snapshot => {
				// snapshot.forEach((snap) => {
				//   chats.push(snap.val());
				// });

				if(snapshot.exists()) {
					// chats.push(snapshot.val());
					this.setState({ client1: snapshot.val() })
				}
				// console.log(this.state.client1);
			});
			db.ref("CLIENT2").on("value", snapshot => {
				// snapshot.forEach((snap) => {
				//   chats.push(snap.val());
				// });

				if(snapshot.exists()) {
					// chats.push(snapshot.val());
					this.setState({ client2: snapshot.val() })
				}
				// console.log(this.state.client2);
			});
			// chats.sort(function (a, b) { return a.timestamp - b.timestamp })
			chatArea.scrollBy(0, chatArea.scrollHeight);
			this.setState({ loadingChats: false });
			// this.setState({ chats });
		} catch (error) {
			this.setState({ readError: error.message, loadingChats: false });
		}
	}

	async getClientData() {
		if(this.state.master == null) {
			this.loadMasterData();
			return;
		}
		var movelist = this.state.master.value;
		movelist += " gives the master best move: .h8";
		await db.ref("MASTER").set({
			user: this.state.user,
			value: movelist,
			timestamp: Date.now()
		}); 
		console.log("Master: " + this.state.master.value);
		// console.log("Client1: " + this.state.client1.value);
		// console.log("Client2: " + this.state.client2.value);
	}
	
	async computeClientData(clientData, clientNo) {
		var movelist = clientData.value;
		console.log(`Client${clientNo} movelist: ${movelist}`);
		clientData.value = movelist;
		if (clientNo === 1) {
			movelist += " gives the 1st best move: .a1";
			this.setState({ client1: clientData });
		} else if (clientNo === 2) {
			movelist += " gives the 2nd best move: .a2";
			this.setState({ client2: clientData });
		}

		await db.ref("CLIENT"+clientNo).set({
			user: this.state.user,
			value: clientData.value,
			timestamp: Date.now()
		}).then(() => {
			document.getElementById("sendDataForm").submit();
		}); 

		/* Replaced with code within loadMasterData() */
		// this.loadClientData();
		
		// db.ref("CLIENT"+clientNo).on("value", snapshot => {
		// 	if(snapshot.exists()) {
		// 		if (clientNo === 1) {
		// 			this.setState({ client1: snapshot.val() });
		// 		}
		// 		else if (clientNo === 2) {
		// 			this.setState({ client2: snapshot.val() });
		// 		}
		// 	}
		// });
	}

	/* replaced with computeClientData() */
	async computeClient1Data() {
		if (!this.state.computed1) {
			var c1 = this.state.client1;
			var movelist = c1.value;
			console.log("C1 movelist: " + movelist);
			movelist += " gives the best move: .a1";
			c1.value = movelist;
			this.setState({ client1: c1 });
			await db.ref("CLIENT1").set({
				user: this.state.user,
				value: this.state.value,
				timestamp: Date.now()
			}); 
			// this.loadClientData();
			this.setState({ computed1: true })
		}
	}

	/* replaced with computeClientData() */
	async computeClient2Data() {
		if (!this.state.computed1) {
			var c2 = this.state.client2;
			var movelist = c2.value;
			console.log("C2 movelist: " + movelist);
			movelist += " gives the best move: .a2";
			c2.value = movelist;
			this.setState({ client2: c2 });
			await db.ref("CLIENT2").set({
				user: this.state.user,
				value: this.state.value,
				timestamp: Date.now(),
			}); 
			// this.loadClientData();
			this.setState({ computed2: true })
		}
	}

	// This function is in-built, and is the first to automatically execute every time the page loads
	async componentDidMount() {
		/* Add some sort of pop-up box or manipulate existing ButtonGroup such that allows us to pick the user role. 
		If a pop-up, the function should return a Promise<void> or Promise<String> such that we can await for its response and only then proceed to loadMasterData() */
		this.clearServerData();
		// await this.loadMasterData();
	}

	handleChange(event) {
		this.setState({
			value: event.target.value
		});
	}
	
	// This function handles the form that is used to submit data to the server
	async handleSubmit(event) {
		if (event)
			event.preventDefault();
		else
			console.log("Client invoked");
		this.setState({ writeError: null });
		const chatArea = this.myRef.current;
		try {
			await db.ref(this.state.user).set({
				user: this.state.user,
				value: this.state.value,
				timestamp: Date.now()
			}); 
			this.setState({ value: ''});
			chatArea.scrollBy(0, chatArea.scrollHeight);
			
			await this.loadMasterData();
			// this.loadClientData();
			
			if (this.state.user === "MASTER")
				this.getClientData();
		} catch (error) {
			this.setState({ writeError: error.message });
		}
	}

	formatTime(timestamp) {
		const d = new Date(timestamp);
		const time = `${d.getDate()}/${(d.getMonth()+1)}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
		return time;
	}

	render() {
		// if(this.state.client1 && !this.state.computed1)
		// 	this.computeClient1Data();
		// else if(this.state.client2 && !this.state.computed2)
		// 	this.computeClient2Data();
		return (
		//Preliminary modal
			<div>
				<Modal
					show={this.state.showModal}
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
								<Button className="btn btn-dark mx-2" id="masterUser" type="checkbox" checked={!this.state.client} onClick={(e) => {
									this.setState({ client: false, user: "MASTER"});
									this.loadMasterData();
									// e.currentTarget.style.className = "mx-2"
									document.getElementById("masterUser").style.className = "mx-2";
									document.getElementById("clientUser1").style.className = "btn btn-dark mx-2";
									document.getElementById("clientUser2").style.className = "btn btn-dark mx-2";
								}}>
									MASTER
								</Button>
								<Button className="mx-2" id="clientUser1" type="checkbox" checked={this.state.client} onClick={(e) => {
									this.setState({ client: true, user: "CLIENT1" });
									this.loadMasterData();
									// e.currentTarget.style.className = "mx-2"
									document.getElementById("masterUser").style.className = "btn btn-dark mx-2";
									document.getElementById("clientUser1").style.className = "mx-2";
									document.getElementById("clientUser2").style.className = "btn btn-dark mx-2";
								}}>
									CLIENT 1
								</Button>
								<Button className="mx-2" id="clientUser2" type="checkbox" checked={this.state.client} onClick={(e) => {
									this.setState({ client: true, user: "CLIENT2" });
									this.loadMasterData();
									// e.currentTarget.style.className = "mx-2"
									document.getElementById("masterUser").style.className = "btn btn-dark mx-2";
									document.getElementById("clientUser1").style.className = "btn btn-dark mx-2";
									document.getElementById("clientUser1").style.className = "mx-2";
								}}>
									CLIENT 2
								</Button>
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
				{/* Allow users to pick their role */}
				<div>
					{/* <input id="masterUser" className="mx-3" type="button" value="MASTER" onClick={this.setUser}/><input id="clientUser" className="mx-3" type="button" value="CLIENT" /> */}
					{/* <ButtonGroup>
						<Button className="btn btn-dark mx-2" id="masterUser" type="checkbox" checked={!this.state.client} onClick={(e) => {
							this.setState({client: false, user: "MASTER"});
							this.loadMasterData();
							// e.currentTarget.style.className = "mx-2"
							document.getElementById("masterUser").style.className = "mx-2";
							document.getElementById("clientUser1").style.className = "btn btn-dark mx-2";
							document.getElementById("clientUser2").style.className = "btn btn-dark mx-2";
						}}>
							MASTER
						</Button>
						<Button className="mx-2" id="clientUser1" type="checkbox" checked={this.state.client} onClick={(e) => {
							this.setState({client: true, user: "CLIENT1"});
							this.loadMasterData();
							// e.currentTarget.style.className = "mx-2"
							document.getElementById("masterUser").style.className = "btn btn-dark mx-2";
							document.getElementById("clientUser1").style.className = "mx-2";
							document.getElementById("clientUser2").style.className = "btn btn-dark mx-2";
						}}>
							CLIENT 1
						</Button>
						<Button className="mx-2" id="clientUser2" type="checkbox" checked={this.state.client} onClick={(e) => {
							this.setState({client: true, user: "CLIENT2"});
							this.loadMasterData();
							// e.currentTarget.style.className = "mx-2"
							document.getElementById("masterUser").style.className = "btn btn-dark mx-2";
							document.getElementById("clientUser1").style.className = "btn btn-dark mx-2";
							document.getElementById("clientUser1").style.className = "mx-2";
						}}>
							CLIENT 2
						</Button>
					</ButtonGroup> */}
					<br />
					<span>Current User: {this.state.user} </span>
				</div>

				<div className="chat-area" ref={this.myRef}>
					{/* loading indicator */}
					{
						this.state.loadingChats 
						?	<div className="spinner-border text-success" role="status">
								<span className="sr-only">Loading...</span>
							</div>
						:	""
					}

					{/* chat area */}
					
					{
						/* Old chat interface */
						/* {
							this.state.chats.map(chat => {
								// console.log("Chat: " + chat.user + "//" + chat.value + "//" + chat.timestamp);
								return <p key={chat.timestamp} className={"chat-bubble " + (this.state.user === chat.user ? "current-user" : "")}>
											<span className="chat-time float-left">{chat.user}</span>
											<br />
											{chat.value}
											<br />
											<span className="chat-time float-right">{this.formatTime(chat.timestamp)}</span>
										</p>
							})
						}
						*/
					}

					{
						// If master is not null
						this.state.master // && this.state.user === "MASTER"
						?	<p className={"chat-bubble " + (this.state.user === this.state.master.user ? "current-user" : "")}>
								{/* <span className="chat-time float-left">{this.state.master.user}</span> */}
								<span className="chat-time float-left">MASTER</span>
								<br />
								{this.state.master.value}
								<br />
								<span className="chat-time float-right">{this.formatTime(this.state.master.timestamp)}</span>
							</p>
						: null
					}
					{
						// If client1 is not null
						this.state.client1 // && this.state.user === "CLIENT1"
						?	<p className={"chat-bubble " + (this.state.user === this.state.client1.user ? "current-user" : "")}>
								{/* <span className="chat-time float-left">{this.state.client1.user}</span> */}
								<span className="chat-time float-left">CLIENT1</span>
								<br />
								{this.state.client1.value}
								<br />
								<span className="chat-time float-right">{this.formatTime(this.state.client1.timestamp)}</span>
							</p>
						: null
					}
					{
						// If client2 is not null
						this.state.client2 // && this.state.user === "CLIENT2"
						?	<p className={"chat-bubble " + (this.state.user === this.state.client2.user ? "current-user" : "")}>
								{/* <span className="chat-time float-left">{this.state.client2.user}</span> */}
								<span className="chat-time float-left">CLIENT2</span>
								<br />
								{this.state.client2.value}
								<br />
								<span className="chat-time float-right">{this.formatTime(this.state.client2.timestamp)}</span>
							</p>
						: null
					}
				</div>
		
				<form id="sendDataForm" onSubmit={this.handleSubmit} className="mx-3">
					{console.log("Submitting form...")}
					<textarea className="form-control" name="content" onChange={this.handleChange} value={this.state.value} disabled={this.state.user !== "MASTER"}></textarea>
					{this.state.readError ? <p className="text-danger">{this.state.readError}</p> : null}
					{this.state.writeError ? <p className="text-danger">{this.state.writeError}</p> : null}
					<button type="submit" className="btn btn-submit px-5 mt-4">Send</button>
				</form>
				{/* 
				<div className="py-5 mx-3">
					Login in as: <strong className="text-info">abc@chat.com</strong>
				</div> 
				*/}
    		</div>
    	);
  }
}
