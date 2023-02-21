import Link from "next/link";
import styles from "@/styles/Home.module.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { useState } from "react";

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

export default function QuizBlock({ post, isProfile, setSounds }) {
    const datePosted = convertTime(post.createdAt);

    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteQuizie = async (e) => {
        e.preventDefault();

        setIsDeleting(true);
        const res = await fetch("/api/delete", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                quizId: post.id,
            }),
        });

        if (res.ok) {
            setSounds((oldSoundsList) => {
                return oldSoundsList.filter((s) => s.id !== post.id);
            });
            setIsDeleting(false);
            alert("Delete successful!");
        } else {
            setIsDeleting(false);
            console.log(res.statusText);
        }
    };

    return (
        <div className={styles.quizblock}>
            <span
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h3>
                    <Link href={`/quizie/${post.id}`}>{post.title}</Link>
                </h3>
                <div>
                    {isDeleting && <strong>Deleting...</strong>}
                    <IconButton
                        color="error"
                        aria-label="upload picture"
                        component="label"
                        onClick={handleDeleteQuizie}
                        disabled={isDeleting}
                    >
                        <DeleteIcon fontSize="large" />
                    </IconButton>
                </div>
            </span>
            <span style={{ display: "flex", justifyContent: "space-between" }}>
                {!isProfile && (
                    <p>
                        <Link href={`/user/${post.creatorId}`}>
                            {post.creator.name}
                        </Link>
                    </p>
                )}
                <p>{datePosted}</p>
            </span>
        </div>
    );
}
