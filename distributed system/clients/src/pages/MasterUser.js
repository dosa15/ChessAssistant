import React, { useEffect, useState, Component, Alert } from "react";
import { ButtonGroup, Button } from 'react-bootstrap';
import { auth } from "../services/firebase";
import { db } from "../services/firebase";
import { Modal } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Popup from 'reactjs-popup';

export default class MasterUser extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// user: auth().currentUser,
			user: "MASTER",
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
			user: "",
			value: "",
			timestamp: 0
		});
		await db.ref("CLIENT1").set({
			user: "",
			value: "",
			timestamp: 0
		});
		await db.ref("CLIENT2").set({
			user: "",
			value: "",
			timestamp: 0
		});
	}

	async loadMasterData() {
		// console.log("master data loaded from " + this.state.user);

		// if(!this.state.user) {
		// 	window.setTimeout(this.state.user, 10);
		// 	return;
		// }

		this.setState({ readError: null, loadingChats: true });
		const chatArea = this.myRef.current;
		try {
			// let chats = [];
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

			// var key = this.state.client1.timestamp;
			db.ref("CLIENT1").on("child_changed", (snapshot, _) => {
				if (snapshot.exists()) {
					this.setState({ client1: snapshot.val() });
				}
			});

			db.ref("CLIENT2").on("child_changed", (snapshot, _) => {
				if (snapshot.exists()) {
					this.setState({ client2: snapshot.val() });
				}
			});

			// chats.sort(function (a, b) { return a.timestamp - b.timestamp })
			chatArea.scrollBy(0, chatArea.scrollHeight);
			this.setState({ loadingChats: false });//, computed1: false, computed2: false });
			
			// this.setState({ chats });
		} catch (error) {
			this.setState({ readError: error.message, loadingChats: false });
		}
	}

	// This function is in-built, and is the first to automatically execute every time the page loads
	async componentDidMount() {
		/* Add some sort of pop-up box or manipulate existing ButtonGroup such that allows us to pick the user role. 
		If a pop-up, the function should return a Promise<void> or Promise<String> such that we can await for its response and only then proceed to loadMasterData() */
		this.clearServerData();
		this.loadMasterData();
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

	formatTime(timestamp) {
		const d = new Date(timestamp);
		const time = `${d.getDate()}/${(d.getMonth()+1)}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
		return time;
	}

	render() {
		return (
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
						?	<p className={"chat-bubble current-user"}>
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
						?	<p className={"chat-bubble"}>
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
						?	<p className={"chat-bubble"}>
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
