import { useRouter } from "next/router";

export default function testPage() {
    const router = useRouter();
    const { pid } = router.query;
    return (
        <div>
            <h1>Test</h1>
            <p>pid: {pid}</p>
        </div>
    );
}
