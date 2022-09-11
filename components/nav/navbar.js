import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { magic } from '../../lib/magic-client'

import styles from './navbar.module.css'

const NavBar = () => {
    const [showDropdown, setShowDropdown] = useState(false)
    const [userEmail, setUserEmail] = useState('')
    const [didToken, setDidToken] = useState('')

    const router = useRouter()

    useEffect(() => {
        async function getUserEmail() {
            try {
                const { email } = await magic.user.getMetadata()
                const DIDToken = await magic.user.getIdToken()
                if (email) {
                    setUserEmail(email);
                    setDidToken(DIDToken)
                }
            } catch (err) {
                console.error('Error retrieving user email', err)
            }
        }
        getUserEmail()
    }, [])

    const handleOnClickHome = (e) => {
        e.preventDefault()
        router.push('/')
    }

    const handleOnClickMyList = (e) => {
        e.preventDefault()
        router.push('/browse/my-list')
    }

    const handleShowDropdown = (e) => {
        e.preventDefault()
        setShowDropdown(!showDropdown)
    }

    const handleSignOut = async (e) => {
        e.preventDefault()

        try {
            const response = await fetch("/api/logout", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${didToken}`,
                    "Content-Type": "application/json",
                },
            });

            const res = await response.json();
        } catch (err) {
            console.error('Error logging out', err)
            router.push('/login')
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <Link className={styles.logoLink} href="/">
                    <a>
                        <div className={styles.logoWrapper}>
                            <Image
                                src={'/static/netflix.svg'}
                                alt='netflix logo'
                                width='128px'
                                height='34px'
                            />
                        </div>
                    </a>
                </Link>
                <ul className={styles.navItems}>
                    <li className={styles.navItem} onClick={handleOnClickHome}>
                        Home
                    </li>
                    <li className={styles.navItem2} onClick={handleOnClickMyList}>
                        My List
                    </li>
                </ul>
                <nav className={styles.navContainer}>
                    <div>
                        <button className={styles.usernameBtn}>
                            <p className={styles.username}
                                onClick={handleShowDropdown}>
                                {userEmail}
                            </p>
                            {userEmail && <Image
                                src={'/static/expand_more.svg'}
                                alt='expand more icon'
                                width='24px'
                                height='24px'
                            />}
                        </button>
                        {showDropdown && (
                            <div className={styles.navDropdown}>
                                <div>
                                    <a onClick={handleSignOut} className={styles.linkName}>
                                        SignOut
                                    </a>
                                    <div className={styles.lineWrapper}></div>
                                </div>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </div>
    )
}

export default NavBar