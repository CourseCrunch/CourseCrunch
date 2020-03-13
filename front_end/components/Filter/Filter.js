import faker from 'faker'
import _ from 'lodash'
import React from 'react'

import { Dropdown } from 'semantic-ui-react';
    
class Filter extends React.Component{
    constructor(props){
        super(props);   
        const {onChange} = props;
        this.onChange= onChange;
        this.state={courseCodes:[]};                     
    }

    componentDidMount(){
        const styleLink = document.createElement("link");
        styleLink.rel = "stylesheet";
        styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
        document.head.appendChild(styleLink);

        fetch(`http://localhost:3001/courses`)
            .then(out => out.json())
            .then((result)=>{
                let courses = [];
 
                for (let [key, value] of Object.entries(JSON.parse(JSON.stringify(result)))) {
                    courses.push(value._id);
                }

                courses = courses.sort();
                const courseOptions = _.map(courses, (course, index) => ({
                    key: course,
                    text: course, 
                    value: course
                }));

                this.setState({courseCodes:courseOptions});
            }).catch(()=>{
                console.log("promise failed");
            })
    }

    render(){
        return <>
                    <Dropdown
                        placeholder='Filtered Courses'
                        fluid
                        multiple
                        search
                        selection
                        options={this.state.courseCodes}
                        onChange={this.onChange}/>
                </>
    }
}

export default Filter 