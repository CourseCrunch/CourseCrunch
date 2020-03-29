import Link from 'next/link';
import Head from 'next/head';
import NavBar from '../components/NavBar/NavBar';
import './index.css';

export default function Custom404() {
    return <div>
        <Head>
            <style>{'body { background-color: rgb(0, 132, 255); }'}</style>
        </Head>
        <NavBar/>
        <h1>We couldn't find that</h1>
        <Link href='/'><a className="msg">Let's try that again</a></Link>
    </div>;
}
