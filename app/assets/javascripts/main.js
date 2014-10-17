/** @jsx React.DOM */

//STYLES//

var tableCellStyle = {
	fontFamily: 'monospace',
	fontWeight: 'bold',
	fontSize: '12px',
};

var tableSpacer = {
	width: '50px',
}

var cellPadding = {
	padding: '.55%',
};

var titleRow = {
	color: '#DC143C',
	fontSize: '14px',
	fontFamily: 'monospace',
	fontWeight: 'bold',
}

var inputField = {
	border: '1px solid #B0B0B0',
  	borderRadius: '2px',
  	WebkitAppearance: 'none',
  	marginBottom: '30px',
  	marginTop:'30px'
}

//STYLES//

var JobBox = React.createClass({
	loadCommentsFromServer: function(){
		$.ajax({
			url: 'http://localhost:3000/jobs/',
			//url: this.props.url,
			dataType: 'json',
			success: function(data){
				this.setState({data: data});
        console.log("GET SUCCESS!");
			}.bind(this),
			error: function(xhr, status,err){
			console.log(arguments);
			//console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	//handle comment submit within this component because it 
	//owns the state that represents the job table
	handleCommentSubmit: function(job){
		//submit to the server and refresh list
		$.ajax({
			url:'http://localhost:3000/jobs/',
			//url: this.props.url,
			dataType: 'json',
			type: 'POST',
			data: job, 
			success: function(data) {
				console.log("POST SUCCESS!");
				this.setState({data: data});
			}.bind(this), 
			error: function(xhr, status, err) {
			     console.log(arguments);  
           console.error(this.props.url, status, err.toString());
			}.bind(this) 
		});
	},
	getInitialState: function(){
		return {data: []};
	},
	componentDidMount: function() {
		this.loadCommentsFromServer();
		setInterval(this.loadCommentsFromServer, this.props.pollInterval);	
	},
	render: function(){
		return(
			<div className="jobLogContainer">
			<h1 style={titleRow} className="title">AH! Job Log</h1>
			<InputForm onCommentSubmit={this.handleCommentSubmit} />
			<JobList data={this.state.data} />
			</div>
		);		
	}
});

var InputForm = React.createClass({
	handleSubmit: function (e) {
		e.preventDefault();
		//get the inputs, minus the white space (trim)
		var artist = this.refs.artist.getDOMNode().value.trim();
		var client = this.refs.client.getDOMNode().value.trim();
		var title = this.refs.title.getDOMNode().value.trim();
		var contact = this.refs.contact.getDOMNode().value.trim();
		var fee = this.refs.fee.getDOMNode().value.trim();
		var expenses = this.refs.expenses.getDOMNode().value.trim();
		if (!artist || !client || !contact || !fee || !expenses) {
			return;
		}
		//send request to the server
		this.props.onCommentSubmit({job:{artist: artist, client: client, title: title, contact: contact, fee: fee, expenses: expenses}})
		//clear fields
		this.refs.artist.getDOMNode().value = "";
		this.refs.client.getDOMNode().value = "";
		this.refs.title.getDOMNode().value = "";
		this.refs.contact.getDOMNode().value = "";
		this.refs.fee.getDOMNode().value = "";
		this.refs.expenses.getDOMNode().value = "";
		return;
	},
	render: function(){
		return(
			<div className="inputForm">
				<form className="jobForm" onSubmit={this.handleSubmit}>
        			<select ref="artist" name="Artist">
		                <option value="TL">TL</option>
		                <option value="KZ">KZ</option>
		                <option value="LS">LS</option>
		                <option value="ML">ML</option>
        			</select>
					<input ref="client" style={inputField} type="text" placeholder=" Client" />
					<input ref="title" style={inputField} type="text" placeholder=" Job Title" />
					<input ref="contact" style={inputField} type="text" placeholder=" Contact" />
					<input ref="fee" style={inputField} type="number" placeholder=" Fees" />
					<input ref="expenses" style={inputField} type="number" placeholder=" Expenses" />
					<input type="submit" value="Submit" />
				</form>
			</div>
		);
	}
});

var JobList = React.createClass({
	render: function(){
		var jobNodes = this.props.data.map(function (job) {
			return(
				<Job artist={job.artist} 
				client={job.client} 
				title={job.title}
				contact={job.contact}
				fee={job.fee}
				expenses={job.expenses}>
				</Job>
			);
		});
		return(
			<table className="jobList">
				<thead style={titleRow}>
					<tr>
						<td style={tableCellStyle} className='jobArtist'>Artist</td>
						<td style={tableSpacer}></td>
						<td style={tableCellStyle} className='jobClient'>Client</td>
						<td style={tableSpacer}></td>
						<td style={tableCellStyle} className='jobTitle'>Job Title</td>
						<td style={tableSpacer}></td>
						<td style={tableCellStyle} className='jobContact'>Contact</td>
						<td style={tableSpacer}></td>
						<td style={tableCellStyle} className='jobFee'>Fees</td>
						<td style={tableSpacer}></td>
						<td style={tableCellStyle} className='jobExp'>Expenses</td>
					</tr>
				</thead>
				<tbody>
					{jobNodes}
				</tbody>
			</table>
		);
	}
});

var Job = React.createClass({
	render: function(){
		return(
			<tr>
			<td style={tableCellStyle} className='jobArtist'>
				{this.props.artist}
			</td>
			<td></td>
			<td style={tableCellStyle} className='jobClient'>
				{this.props.client} 
			</td>
			<td></td>
			<td style={tableCellStyle} className='jobTitle'>
				{this.props.title} 
			</td>
			<td></td>
			<td style={tableCellStyle} className='jobContact'>
				{this.props.contact} 
			</td>
			<td></td>
			<td style={tableCellStyle} className='jobFee'>
				{this.props.fee} 
			</td>
			<td></td>
			<td style={tableCellStyle} className='jobExp'>
				{this.props.expenses} 
			</td>
			</tr>
		);
	}
});

React.renderComponent(
	//call this to pass the data into the jobList via props
	<JobBox url="jobs.json" pollInterval={2000} />,
	document.getElementById('container')
);

