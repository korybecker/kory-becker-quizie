import prisma from "@/lib/prisma";
import QuizBlock from "@/components/QuizBlock";
import styles from "@/styles/Home.module.css";
import { useState } from "react";
import { useSession } from "next-auth/react";

export const getServerSideProps = async () => {
    const posts = await prisma.quiz.findMany({
        where: { published: false },
        include: {
            creator: {
                select: { name: true },
            },
        },
    });
    const allPosts = JSON.stringify(posts);
    return {
        props: { allPosts },
    };
};

export default function Quizies({ allPosts }) {
    const [sounds, setSounds] = useState(JSON.parse(allPosts));
    const { data: session, status } = useSession();

    return (
        <>
            <h1 style={{ textAlign: "center" }}>Quizies</h1>
            <div className={styles.container}>
                {sounds
                    .slice(0)
                    .reverse()
                    .map((post, i) => {
                        return (
                            <QuizBlock
                                key={i}
                                post={post}
                                setSounds={setSounds}
                                userId={session ? session.userId : ""}
                            />
                        );
                    })}
            </div>
        </>
    );
}
