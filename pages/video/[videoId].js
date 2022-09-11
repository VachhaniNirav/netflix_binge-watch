import Head from "next/head"
import { useRouter } from "next/router"
import Modal from 'react-modal'
import clsx from 'classnames'
import { useEffect, useState } from "react"

import NavBar from '../../components/nav/navbar'
import { getYoutubeVideoById } from "../../lib/videos"
import Like from '../../components/icons/like-icon'
import DisLike from '../../components/icons/dislike-icon'
import styles from '../../styles/video.module.css'


Modal.setAppElement('#__next')

export async function getStaticProps(context) {

    const videoId = context.params.videoId
    const videoArr = await getYoutubeVideoById(videoId)

    return {
        props: {
            video: videoArr.length > 0 ? videoArr[0] : {}
        },
        revalidate: 10
    }
}

export async function getStaticPaths() {
    const listOfVideos = ["BmllggGO4pM", "yQEondeGvKo", "hs6alRuY1UU", "D7eFpRf4tac", "mYfJxlgR2jw", "4zH5iYM4wJo", "KCPEHsAViiQ"]

    const paths = listOfVideos.map((videoId) => ({
        params: { videoId },
    }))

    return { paths, fallback: "blocking" }
}

const Video = ({ video }) => {
    const router = useRouter()

    const videoId = router.query.videoId

    const [toggleLike, setToggleLike] = useState(false)
    const [toggleDislike, setToggleDislike] = useState(false)

    const { title, publishTime, description, channelTitle, statistics: { viewCount } = { viewCount: 0 } } = video

    useEffect(() => {
        const stats = async () => {
            const response = await fetch(`/api/stats?videoId=${videoId}`, {
                method: 'GET',
            })
            const data = await response.json()

            if (data.length > 0) {
                const favourited = data[0].favourited
                if (favourited === 1) {
                    setToggleLike(true)
                } else if (favourited === 0) {
                    setToggleDislike(true)
                }
            }
        }
        stats()
    }, [])

    const ratingService = async (favourited) => {
        return await fetch('/api/stats', {
            method: 'POST',
            body: JSON.stringify({
                videoId,
                favourited
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
    }

    const handleToggleDislike = async () => {
        setToggleDislike(!toggleDislike)
        setToggleLike(toggleDislike)

        const val = !toggleDislike
        const response = await ratingService(val ? 0 : 1)
    }

    const handleToggleLike = async () => {
        const val = !toggleLike
        setToggleLike(val)
        setToggleDislike(toggleLike)

        const response = await ratingService(val ? 1 : 0)
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>{title}</title>
                <link rel="icon" href="/netflix-icon.svg" />
            </Head>
            <NavBar />
            <Modal
                className={styles.modal}
                isOpen={true}
                contentLabel="Watch the video"
                onRequestClose={() => router.back()}
                overlayClassName={styles.overlay}
            >
                <iframe
                    id="ytplayer"
                    className={styles.videoPlayer}
                    type="text/html"
                    width="100%"
                    height="360"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=0&origin=http://example.com&controls=0&rel=1`}
                    frameBorder="0"
                ></iframe>

                <div className={styles.likeDislikeBtnWrapper}>
                    <div className={styles.likeBtnWrapper}>
                        <button onClick={handleToggleLike}>
                            <div className={styles.btnWrapper}>
                                <Like selected={toggleLike} />
                            </div>
                        </button>
                    </div>
                    <button onClick={handleToggleDislike}>
                        <div className={styles.btnWrapper}>
                            <DisLike selected={toggleDislike} />
                        </div>
                    </button>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.modalBodyContent}>
                        <div className={styles.col1}>
                            <p className={styles.publishTime}>
                                {publishTime}
                            </p>
                            <p className={styles.title}>
                                {title}
                            </p>
                            <p className={styles.description}>
                                {description}
                            </p>
                        </div>
                        <div className={styles.col2}>
                            <p className={clsx(styles.subText, styles.subTextWrapper)}>
                                <span className={styles.textColor}>
                                    {'Cast:' + ' '}
                                </span>
                                <span className={styles.channelTitle}>
                                    {channelTitle}
                                </span>
                            </p>
                            <p className={clsx(styles.subText, styles.subTextWrapper)}>
                                <span className={styles.textColor}>
                                    {'View Count:' + ' '}
                                </span>
                                <span className={styles.channelTitle}>
                                    {viewCount}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </Modal >
        </div >
    );
}

export default Video