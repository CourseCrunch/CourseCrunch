import Head from 'next/head';
import SearchParent from '../../components/SearchParent/SearchParent';

import NavBar from '../../components/NavBar/NavBar';
import '../index.css';

const Index = () => (
    <div>
        <Head>
            <title>Search Instructors</title>
            <link href="https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css" rel="stylesheet" key="test"/>
        </Head>
        <NavBar/>
        <SearchParent/>
    </div>
);

export default Index;
