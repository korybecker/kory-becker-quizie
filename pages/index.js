import styles from "../styles/Home.module.css";
import Link from "next/link";
import { useSession } from "next-auth/react";
export default function Home() {
    const { data: session, status } = useSession();

    return (
        <>
            <div className={styles.container}>
                {status !== "loading" && (
                    <>
                        <h1>Welcome to Quizie</h1>
                        <Link href="/quizies">
                            <h3>Take a Quizie</h3>
                        </Link>
                        {session ? (
                            <Link href="/create">
                                <h3>Create a Quizie</h3>
                            </Link>
                        ) : (
                            <Link href="/api/auth/signin">
                                <h3>Login</h3>
                            </Link>
                        )}
                    </>
                )}
            </div>
        </>
    );
}
