import React from 'react';
import './page.css';
import '../index.css';
import '../hover.css';
import { v4 } from 'uuid';
import Display from './components/Display';
import AddData from './components/AddData';
import NavBar from '../../components/NavBar/NavBar';


class Page extends React.Component {
  state = {
      data: [],
  }

  // Delete Item
  delItem = (id) => {
      this.setState({ data: [...this.state.data.filter((d) => d.id !== id)] });
  }

  // Add Item
  addData = (title, labels, data, isChart) => {
      const newData = {
          id: v4(),
          title,
          labels,
          data,
          isChart,
      };
      this.setState({ data: [...this.state.data, newData] });
  }

  render() {
      return (
          <div className="App">
              <NavBar isLoggedIn = {false}/>
              <div className="container">
                  <AddData addData={this.addData} />
                  <Display data={this.state.data} delItem={this.delItem}/>
              </div>
          </div>
      );
  }
}

export default Page;
