import Link from "next/link";
import styles from "@/styles/Home.module.css";

const convertTime = (dateString) => {
    let date = new Date(dateString);
    let currentDate = new Date();

    let timeDiff = Math.abs(currentDate.getTime() - date.getTime());

    let diffMinutes = Math.floor(timeDiff / 1000 / 60);
    let diffHours = Math.floor(diffMinutes / 60);
    let diffDays = Math.floor(diffHours / 24);
    let diffMonths = Math.floor(diffDays / 30);
    let diffYears = Math.floor(diffMonths / 12);

    let timeAgo;
    if (diffMinutes < 1) {
        timeAgo = "Less than a minute ago";
    } else if (diffMinutes < 60) {
        timeAgo = `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
        timeAgo = `${diffHours} hours ago`;
    } else if (diffDays < 30) {
        timeAgo = `${diffDays} days ago`;
    } else if (diffMonths < 12) {
        timeAgo = `${diffMonths} months ago`;
    } else {
        timeAgo = `${diffYears} years ago`;
    }
    return timeAgo;
};

export default function QuizBlock({ post, isProfile }) {
    const datePosted = convertTime(post.createdAt);

    return (
        <div className={styles.quizblock}>
            <h3>
                <Link href={`/quizie/${post.id}`}>{post.title}</Link>
            </h3>
            {!isProfile && (
                <p>
                    <Link href={`/user/${post.creatorId}`}>
                        {post.creator.name}
                    </Link>
                </p>
            )}
            <p>{datePosted}</p>
        </div>
    );
}
