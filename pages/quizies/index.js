import prisma from "@/lib/prisma";
import QuizBlock from "@/components/QuizBlock";
import styles from "@/styles/Home.module.css";

export const getStaticProps = async () => {
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
    allPosts = JSON.parse(allPosts);
    return (
        <>
            <h1 style={{ textAlign: "center" }}>Quizies</h1>
            <div className={styles.container}>
                {allPosts.map((post, i) => {
                    return <QuizBlock key={i} post={post} />;
                })}
            </div>
        </>
    );
}
