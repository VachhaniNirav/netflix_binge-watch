import Head from "next/head"

import NavBar from "../../components/nav/navbar"
import SectionCards from "../../components/card/section-cards"
import { getFavVideos } from "../../lib/videos"
import useRedirectUser from '../../utils/redirectUser'

import styles from '../../styles/mylist.module.css'


export async function getServerSideProps(context) {
    const { userId, token } = await useRedirectUser(context)
    const myListVideos = await getFavVideos(userId, token)

    return {
        props: {
            myListVideos
        }
    }
}

const MyList = ({ myListVideos }) => {
    return (
        <div>
            <Head>
                <title>My list</title>
                <link rel="icon" href="/netflix-icon.svg" />
            </Head>
            <main className={styles.main}>
                <NavBar />
                <div className={styles.sectionWrapper}>
                    <SectionCards
                        title='My List'
                        videos={myListVideos}
                        size='small'
                        shouldWrap
                        shouldScale={false}
                    />
                </div>
            </main>
        </div>
    )
}

export default MyList