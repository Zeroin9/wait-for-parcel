import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './home'
import Parcel from './parcel'
import './App.css';


class App extends Component {
	render() {
		return (
            <div class="container-fluid">
	            <div class="row">
		            <div class="col-md-12">
			            <ul class="nav">
				            <li class="nav-item">
					            <a class="nav-link active" href="/">На главную</a>
				            </li>
			            </ul>
		            </div>
	            </div>
	            <div class="row">
		            <div class="col-md-2">
		            </div>
		            <div class="col-md-8">
						<BrowserRouter>
							<Routes>
								<Route exact path="/" element={<Home />} />
								<Route path = "/parcel/:id" element={<Parcel />} />
							</Routes>
						</BrowserRouter>
					</div>
		            <div class="col-md-2">
		            </div>
	            </div>
            </div>
		);
	}
}

export default App;