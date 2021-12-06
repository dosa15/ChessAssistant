import React, { useEffect, useState, Component, Alert } from "react";
import { ButtonGroup, Button } from 'react-bootstrap';
import { auth } from "../services/firebase";
import { db } from "../services/firebase";
import { Modal } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Popup from 'reactjs-popup';
// import {loadLayersModel} from 'react-tensorflow';
import * as tf from "@tensorflow/tfjs"


const sleep = (milliseconds) => {
	return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const alpha_dict = {
    'a': [0, 0, 0, 0, 0, 0, 0],
    'b': [1, 0, 0, 0, 0, 0, 0],
    'c': [0, 1, 0, 0, 0, 0, 0],
    'd': [0, 0, 1, 0, 0, 0, 0],
    'e': [0, 0, 0, 1, 0, 0, 0],
    'f': [0, 0, 0, 0, 1, 0, 0],
    'g': [0, 0, 0, 0, 0, 1, 0],
    'h': [0, 0, 0, 0, 0, 0, 1],
};

const new_alpha_dict = {
    '1,0,0,0,0,0,0': 'b',
    '0,1,0,0,0,0,0': 'c',
    '0,0,1,0,0,0,0': 'd',
    '0,0,0,1,0,0,0': 'e',
    '0,0,0,0,1,0,0': 'f',
    '0,0,0,0,0,1,0': 'g',
    '0,0,0,0,0,0,1': 'h',
    '0,0,0,0,0,0,0': 'a',
};
	 
export default class MasterUser extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// user: auth().currentUser,
			user: "MASTER",
			chats: [],
			value: '',
			client: true,
			master: {
				data: {
					user: "MASTER",
					value: [],
					timestamp: 0
				}
			},
			client1: {
				data: {
					user: "CLIENT1",
					value: [],
					timestamp: 0
				}
			},
			client2: {
				data: {
					user: "CLIENT2",
					value: [],
					timestamp: 0
				}
			},
			alpha: null,
			moveAlpha: "",
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
			data: {
				user: "",
				value: "",
				timestamp: 0
			}
		});
		await db.ref("CLIENT1").set({
			data: {
				user: "",
				value: "",
				timestamp: 0
			}
		});
		await db.ref("CLIENT2").set({
			data: {
				user: "",
				value: "",
				timestamp: 0
			}
		});
	}

	async loadModels() {
		try {
			// var model = await tf.loadLayersModel('https://firebasestorage.googleapis.com/v0/b/chessassistant-adams.appspot.com/o/models%2Fmodel_alpha%2Fmodel.json?alt=media&token=541bb76f-26b8-4251-8b53-656a0cb3fb51');
			var model = await tf.loadLayersModel('http://127.0.0.1:8080/model_alpha/model.json')
			this.setState({ alpha: model });
			console.log(this.state.alpha);
		} catch(e) {
			console.log(e);
		}
	}

	async loadMasterData() {
		// console.log("master data loaded from " + this.state.user);

		// if(!this.state.user) {
		// 	window.setTimeout(this.state.user, 10);
		// 	return;
		// }

		this.setState({ readError: null, loadingChats: true, computed1: false, computed2: false });
		const chatArea = this.myRef.current;
		try {
			// let chats = [];
			db.ref("MASTER").on("child_changed", snapshot => {
				// snapshot.forEach((snap) => {
				//   chats.push(snap.val());
				// });

				if(snapshot.exists()) {
					// chats.push(snapshot.val());
					this.setState({ master: snapshot.val() });
					
					if (this.state.master) {
						console.log(this.state.master.data.value);
					}
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
					var newData = { ...this.state.client1, data: snapshot.val() }
					this.setState({ client1: newData, computed1: true });
					console.log(`Client1 data: ${this.state.client1.data.value}`);
				}
			});

			db.ref("CLIENT2").on("child_changed", (snapshot, _) => {
				if (snapshot.exists()) {
					var newData = { ...this.state.client1, data: snapshot.val() }
					this.setState({ client2: newData, computed2: true });
					console.log(`Client2 data: ${this.state.client2.data.value}`);
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
		this.clearServerData();
		await this.loadModels();
		//console.log(getAlpha());
		this.loadMasterData();
	}

	handleChange(event) {
		this.setState({
			value: event.target.value
		});
	}
	
	// This function handles the form that is used to submit data to the server
	async handleSubmit(event) {
		console.log("Submitting form...")
		event.preventDefault();

		this.setState({ writeError: null });
		const chatArea = this.myRef.current;
		try {
			await db.ref("MASTER").child('data').set({
				user: "MASTER",
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

	translate_pred(pred) {
		//pred is a numpy array
		//translation = Array.from(new Array(pred.length), _ => Array(pred[0].length).fill(0));
		// console.log("Pred", pred);
		var dimensionsPred = [pred.length, pred[0].length];
		// console.log("Pred dimensions: " + dimensionsPred)
		var translation = Array(pred.length).fill().map(() =>
		Array(pred[0].length).fill(0));
		// var translation = tf.zeros([pred.length, pred[0].length]);
		
		// console.log("Translation: " + translation);
		// translation.print();
		// console.log(translation.length + " " + translation[0].length);

		// var index = pred[0].indexOf(Math.max(pred[0]));
		var index = pred[0].indexOf(Math.max(...pred[0]));
		console.log(index);
		translation[0][index] = 1;
		return translation[0];
	}
	
	render() {
		if(this.state.computed1 && this.state.computed2) {
			var masterData = this.state.master.data;
			var translatedMatrix = masterData.value;
			// Master's computation
			var t1 = tf.reshape(translatedMatrix, [1, 8, 8, 12]);
			console.log("predicting...")
			this.state.alpha.predict(t1).array().then(function (move) {
					// Translated to R code from ipynb.
					console.log("M Alpha: ", move);
					var tMove = this.translate_pred(move);
					// console.log("T Alpha: ", tMove);
					this.setState({ moveAlpha: new_alpha_dict[tMove.toString()] });
				});
			masterData.value = this.state.moveAlpha;
			this.setState({ master: {...this.state.master, data: masterData}, computed1: false, computed2: false });
		}
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
								{ console.log(this.state.master.data.value)}
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
								<span className="chat-time float-right">{this.formatTime( this.state.client1.data.timestamp)}</span>
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
								{ this.state.client2.data.value }
								<br />
								<span className="chat-time float-right">{this.formatTime(this.state.client2.data.timestamp)}</span>
							</p>
						: null
					}
				</div>
		
				<form id="sendDataForm" onSubmit={this.handleSubmit} className="mx-3">
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
