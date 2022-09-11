import Head from 'next/head'
import styles from '../styles/Home.module.css'

import NavBar from '../components/nav/navbar'
import Banner from '../components/banner/banner'
import SectionCards from '../components/card/section-cards'

import { getVideos, getPopularVideos, getWatchItAgainVideos } from '../lib/videos'
import { redirectUser } from '../utils/redirectUser'


export async function getServerSideProps(context) {

  const { userId, token } = await redirectUser(context)

  const disneyVideos = await getVideos("disney movies")
  const productivityVideos = await getVideos("productivity lessons")
  const travelVideos = await getVideos("travelling")
  const popularVideos = await getPopularVideos()
  const watchItAgainVideos = await getWatchItAgainVideos(userId, token)

  return { props: { disneyVideos, productivityVideos, travelVideos, popularVideos, watchItAgainVideos } }
}

export default function Home({ disneyVideos, productivityVideos, travelVideos, popularVideos, watchItAgainVideos = [] }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix_Binge-watch</title>
        <meta name="Watch your favourite movies & TV shows online" content="Netflix-Clone_created by nOax" />
        <link rel="icon" href="/netflix-icon.svg" />
      </Head>

      <div className={styles.main}>
        <NavBar />
        <Banner
          videoId='4zH5iYM4wJo'
          title='Clifford the Big Red Dog'
          subTitle='Official Trailer | Paramount Pictures'
          imgUrl='/static/clifford.webp' />


        <div className={styles.sectionWrapper}>
          <SectionCards title='Disney' videos={disneyVideos} size='large' />
          <SectionCards title='Watch it again' videos={watchItAgainVideos} size='small' />
          <SectionCards title='Travel' videos={travelVideos} size='small' />
          <SectionCards title='Productivity' videos={productivityVideos} size='medium' />
          <SectionCards title='Popular' videos={popularVideos} size='small' />
        </div>
      </div>
    </div>
  )
}
