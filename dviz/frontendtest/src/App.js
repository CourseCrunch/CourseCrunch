import React from 'react';
import './App.css';
import Display from './components/Display';
import Header from './components/layout/Header';
import AddData from './components/AddData'
import uuid from 'uuid'

class App extends React.Component {
  state = {
    data: []
  }

  // Delete Item
  delItem = (id) => {
    this.setState({ data: [...this.state.data.filter(d => 
      d.id !== id)]});
  }

  // Add Item
  addData = (title, labels, data) => {
    const newData = {
      id: uuid.v4(),
      title,
      labels,
      data
    }
    this.setState({ data: [...this.state.data, newData]})
  }

  render () {
    return (
      <div className="App">
        <div className="container"> 
          <Header />
          <AddData addData={this.addData} />
          <Display data={this.state.data} delItem={this.delItem}/>
        </div>
      </div>
    );
  }
}

export default App;