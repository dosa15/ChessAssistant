import React, { useEffect, useState, Component, Alert } from "react";
import { ButtonGroup, Button } from 'react-bootstrap';
import { auth } from "../services/firebase";
import { db } from "../services/firebase";
import { Modal } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Popup from 'reactjs-popup';
import * as tf from "@tensorflow/tfjs";

export default class ClientUser1 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// user: auth().currentUser,
			user: "CLIENT2",
			chats: [],
			value: '',
			client: true,
			master: {
				data: {
					user: "MASTER",
					value: "",
					timestamp: 0
				}
			},
			client1: {
				data: {
					user: "CLIENT1",
					value: "",
					timestamp: 0
				}
			},
			client2: {
				data: {
					user: "CLIENT2",
					value: "",
					timestamp: 0
				}
			},
			pieces: null,
			computed1: false,
			computed2: false, 
			readError: null,
			writeError: null,
			loadingChats: false,
			roleChosen: false,
			showModal: true
		};
		this.handleChange = this.handleChange.bind(this);
		// this.handleSubmit = this.handleSubmit.bind(this);
		this.loadMasterData = this.loadMasterData.bind(this);
		this.myRef = React.createRef();
	}
	
	async clearServerData() {
		await db.ref("MASTER/data").set({
			// data: {
				user: "",
				value: "",
				timestamp: 0
			// }
		});
		await db.ref("CLIENT1/data").set({
			// data: {
				user: "",
				value: "",
				timestamp: 0
			// }
		});
		await db.ref("CLIENT2/data").set({
			// data: {
				user: "",
				value: "",
				timestamp: 0
			// }
		});
	}

	async loadModels() {
		try {
			// var model = await tf.loadLayersModel('https://firebasestorage.googleapis.com/v0/b/chessassistant-adams.appspot.com/o/models%2Fmodel_alpha%2Fmodel.json?alt=media&token=541bb76f-26b8-4251-8b53-656a0cb3fb51');
			var model = await tf.loadLayersModel('http://127.0.0.1:8080/model_pieces/model.json')
			this.setState({ pieces: model });
			console.log(this.state.pieces);
		} catch(e) {
			console.log(e);
		}
	}

	async loadMasterData() {
		console.log("master data loaded from " + this.state.user);

		// if(!this.state.user) {
		// 	window.setTimeout(this.state.user, 10);
		// 	return;
		// }

		this.setState({ readError: null, loadingChats: true, showModal: false });
		const chatArea = this.myRef.current;
		try {
			db.ref("MASTER").on("child_changed", (snapshot, _) => {
				// snapshot.forEach((snap) => {
				//   chats.push(snap.val());
				// });

				if(snapshot.exists()) {
					// chats.push(snapshot.val());
					console.log(`Value got from Master: ${snapshot.toJSON()}`);
					var newData = { ...this.state.client2, data: snapshot.val() }
					this.setState({ client2: newData, master: newData });
					console.log(this.state.client2);
					// if(initial) {
					// 	this.setState({ client1: snapshot.val() });
					// 	this.setState({ client2: snapshot.val() });
					// }
					this.computeClientData(this.state.client2.data);
				}
			});
			
			// chats.sort(function (a, b) { return a.timestamp - b.timestamp })
			chatArea.scrollBy(0, chatArea.scrollHeight);
			this.setState({ loadingChats: false });
			
			// this.setState({ chats });
		} catch (error) {
			this.setState({ readError: error.message, loadingChats: false });
		}
	}
	
	async computeClientData(clientData) {
		console.log(clientData) 
		console.log(clientData.value);
		var movelist = clientData.value;
		console.log(`Client2 movelist: ${movelist}`);
		// Client 2's computation
		movelist += " gives the 2nd best move: .b2";
		clientData.value = movelist;
		this.setState({ client2: { ...this.state.client2, data: clientData } });

		await db.ref("CLIENT2").child('data').set({
			user: "CLIENT2",
			value: clientData.value,
			timestamp: Date.now()
		});
	}

	// This function is in-built, and is the first to automatically execute every time the page loads
	async componentDidMount() {
		// this.clearServerData();
		await this.loadModels();
		this.loadMasterData();
	}

	handleChange(event) {
		this.setState({
			value: event.target.value
		});
	}
	
	// This function handles the form that is used to submit data to the server
	/*
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
			
			// if (this.state.user === "MASTER")
			// 	this.getClientData();
		} catch (error) {
			this.setState({ writeError: error.message });
		}
	}
	*/

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
				{/* Allow users to pick their role */}
				<div>
					{/* <input id="masterUser" className="mx-3" type="button" value="MASTER" onClick={this.setUser}/><input id="clientUser" className="mx-3" type="button" value="CLIENT" /> */}
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
						// If master is not null
						this.state.master // && this.state.user === "MASTER"
						?	<p className={"chat-bubble"}>
								{/* <span className="chat-time float-left">{this.state.master.user}</span> */}
								<span className="chat-time float-left">MASTER</span>
								<br />
								{ this.state.master.data.value }
								<br />
								<span className="chat-time float-right">{this.formatTime(this.state.master.data.timestamp)}</span>
							</p>
						: null
					}
					{
						// If client1 is not null
						this.state.client1 // && this.state.user === "CLIENT1"
						?	<p className={"chat-bubble"}>
								{/* <span className="chat-time float-left">{this.state.client1.user}</span> */}
								<span className="chat-time float-left">CLIENT1</span>
								<br />
								{ this.state.client1.data.value }
								<br />
								<span className="chat-time float-right">{this.formatTime(this.state.client1.data.timestamp)}</span>
							</p>
						: null
					}
					{
						// If client2 is not null
						this.state.client2 // && this.state.user === "CLIENT2"
						?	<p className={"chat-bubble current-user"}>
								{/* <span className="chat-time float-left">{this.state.client2.user}</span> */}
								<span className="chat-time float-left">CLIENT2</span>
								<br />
								{ this.state.client2.data.value }
								<br />
								<span className="chat-time float-right">{this.formatTime(this.state.client2.data.timestamp)}</span>
							</p>
						: null
					}
				</div>
		
				<form id="sendDataForm" onSubmit={this.handleSubmit} className="mx-3">
					{/* {console.log("Submitting form...")} */}
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
