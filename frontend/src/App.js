import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './home'
import Parcel from './parcel'
import './App.css';


class App extends Component {
	render() {
		return (
			<div>
				<BrowserRouter>
					<Routes>
						<Route exact path="/" element={<Home />} />
						<Route path = "/parcel/:id" element={<Parcel />} />
					</Routes>
				</BrowserRouter>
			</div>
		);
	}
}

export default App;