/* eslint-disable class-methods-use-this */
import React from 'react';
import { useRouter } from 'next/router';
import fetch from 'isomorphic-unfetch';
import Head from 'next/head';

import NavBar from '../../components/NavBar/NavBar';
import InstructorHeader from '../../components/InstructorHeader/InstructorHeader';
import RateMyProf from '../../components/RateMyProf/RateMyProf';
import CourseEval from '../../components/CourseEval/CourseEval';


import '../index.css';
import '../hover.css';

class Instructor extends React.Component {
    render() {
        return (
            <div>
                <Head>
                    <title>{this.props.name} @ {this.props.campus.toUpperCase()}</title>
                    <link href="https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css" rel="stylesheet" key="test"/>
                </Head>
                <NavBar isLoggedIn = {false}></NavBar>
                <InstructorHeader name={this.props.name} campus={this.props.campus} img={this.props.img}></InstructorHeader>
                <div className="instructorColumn">
                    <RateMyProf name={this.props.name} campus={this.props.campus}></RateMyProf>
                    <CourseEval name={this.props.name} campus={this.props.campus}></CourseEval>
                </div>
            </div>
        );
    }
}

const Content = (props) => {
    const router = useRouter();
    return (
        <>
            <Instructor img={props.img}
                campus={router.query.campus}
                name={router.query.fullname}
                evals={props.evals}></Instructor>
        </>
    );
};

Content.getInitialProps = async function(ctx) {
    let imgUrl = null;
    const params = new URLSearchParams({
        instructor: ctx.query.fullname,
    });

    const imgRes = await fetch(`http://localhost:${process.env.EVALSPORT}/instructors/pfp/${ctx.query.campus}?${params.toString()}`);
    if (imgRes.status === 200) imgUrl = await imgRes.json();

    return {
        img: imgUrl,
    };
};

export default Content;
