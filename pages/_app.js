import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import Loader from '../components/loader/loader'

import '../styles/globals.css'


function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false)
    }
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router])

  return isLoading ? <Loader /> : <Component {...pageProps} />
}

export default MyApp
