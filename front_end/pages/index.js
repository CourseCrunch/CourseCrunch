class Welcome extends React.Component {
    render() {
      return <h1>Hello, {this.props.name}</h1>;
    }
  }


const Index = () => (
    <div>
        <h1>Welcome to Course Cruch</h1>
        <Welcome name = "Sara"/>
    </div>
);

export default Index;