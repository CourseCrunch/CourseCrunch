/* eslint-disable class-methods-use-this */
import React from 'react';
import { useRouter } from 'next/router';
import fetch from 'isomorphic-unfetch';

import NavBar from '../../components/NavBar/NavBar';
import InstructorHeader from '../../components/InstructorHeader/InstructorHeader';
import RateMyProf from '../../components/RateMyProf/RateMyProf';
import CourseEval from '../../components/CourseEval/CourseEval';


import '../index.css';
import '../hover.css';

class Instructor extends React.Component {
    render() {
        console.log(this.props.rmp);
        return (
            <div>
                <NavBar isLoggedIn = {false}></NavBar>
                <InstructorHeader name={this.props.name}></InstructorHeader>
                <div className="instructorColumn">
                    <RateMyProf rmp={this.props.rmp}></RateMyProf>
                    <CourseEval evals={this.props.evals}></CourseEval>
                </div>
            </div>
        );
    }

    componentDidMount() {
        const styleLink = document.createElement('link');
        styleLink.rel = 'stylesheet';
        styleLink.href = 'https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css';
        document.head.appendChild(styleLink);
    }
}

const Content = (props) => {
    const router = useRouter();
    return (
        <>
            <Instructor campus={router.query.campus} name={router.query.fullname} evals={props.evals} rmp={props.rmp}></Instructor>
        </>
    );
};

Content.getInitialProps = async function(ctx) {
    let rmpData = null;
    let evalsData = null;
    const params = new URLSearchParams({
        instructor: ctx.query.fullname,
    });
    const evalRes = await fetch(`http://localhost:${process.env.EVALSPORT}/instructors/eval/${ctx.query.campus}?${params.toString()}`);
    if (evalRes.status) evalsData = await evalRes.json();

    const rmpRes = await fetch(`http://localhost:${process.env.EVALSPORT}/instructors/rmp/${ctx.query.campus}?${params.toString()}`);
    if (rmpRes.status === 200) rmpData = await rmpRes.json();

    return {
        evals: evalsData,
        rmp: rmpData,
    };
};

export default Content;
