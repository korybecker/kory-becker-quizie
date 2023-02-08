import prisma from "@/lib/prisma";
import QuizBlock from "@/components/QuizBlock";
import styles from "@/styles/Home.module.css";

export const getServerSideProps = async ({ params }) => {
    let user = await prisma.user.findUnique({
        where: { id: params.id },
    });
    let quizzes = await prisma.quiz.findMany({
        where: { creatorId: params.id },
        include: {
            creator: {
                select: { name: true },
            },
        },
    });
    user = JSON.stringify(user);
    quizzes = JSON.stringify(quizzes);
    return {
        props: { user, quizzes },
    };
};

export default function Profile({ user, quizzes }) {
    user = JSON.parse(user);
    quizzes = JSON.parse(quizzes);
    return (
        <div className={styles.profilepage}>
            <div className={styles.profileHalf}>
                <h1 style={{ textAlign: "center" }}>
                    {user.name.split(" ")[0]}'s Profile
                </h1>
                <img
                    className={styles.profileImage}
                    src={user.image}
                    alt={`${user.name}'s image`}
                />
            </div>
            <div className={styles.profileHalf}>
                <h1>Quizies</h1>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#636363",
                        padding: "1rem",
                        borderRadius: "1rem",
                        width: "90%",
                    }}
                >
                    {quizzes.map((quiz, i) => {
                        return (
                            <QuizBlock key={i} post={quiz} isProfile={true} />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
