/* eslint-disable class-methods-use-this */
import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Custom404 from '../404';


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
                </Head>
                <NavBar isLoggedIn = {false}></NavBar>
                <InstructorHeader name={this.props.name}
                    campus={this.props.campus}
                    img={this.props.img}/>
                <div className="instructorColumn">
                    <RateMyProf name={this.props.name} campus={this.props.campus}></RateMyProf>
                    <CourseEval name={this.props.name} campus={this.props.campus}></CourseEval>
                </div>
            </div>
        );
    }
}

const valid = [
    'utm',
    'utsg',
    'utsc',
    'grad',
];

const Content = () => {
    const router = useRouter();
    if (valid.indexOf(router.query.campus) < 0) return <Custom404/>;
    return (
        <>
            <Instructor campus={router.query.campus}
                name={router.query.fullname}/>
        </>
    );
};

Content.getInitialProps = async function () {
    return { };
};

export default Content;
