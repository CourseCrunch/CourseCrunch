import React from 'react';
import './App.css';
import Dataq from './components/Dataq';
import Header from './components/layout/Header';
import AddTodo from './components/AddTodo'
import uuid from 'uuid'

class App extends React.Component {
  state = {
    dataq: [
      {
        id: uuid.v4(),
        chart: "chart1",
        title: "My query",
        script: ""
      }
    ]
  }

  // Toggle Complete
  markComplete = (id) => {
    this.setState({ todos: this.state.todos.map(todo => {
      if(todo.id === id) {
        todo.completed = !todo.completed
      }
      return todo;
    })})
  }

  // Delete Todo
  delTodo = (id) => {
    this.setState({ todos: [...this.state.todos.filter(todo => 
      todo.id !== id)]});
  }

  // Add Todo
  addTodo = (title) => {
    const newTodo = {
      id: uuid.v4(),
      title,
      completed: false
    }
    this.setState({ todos: [...this.state.todos, newTodo]})
  }

    // Adds Chart Js
  componentWillMount() {
    const s = document.createElement('script');
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js";
    s.async = false;
    document.body.appendChild(s);
  }


  render () {
    return (
      <div className="App">
        <div className="container"> 
          <Header />
          <AddTodo addTodo={this.addTodo} />
          <Dataq dataq={this.state.dataq} />
        </div>
      </div>
    );
  }
}

export default App;