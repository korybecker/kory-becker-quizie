export default function testPage({ id }) {
    return (
        <div>
            <h1>Test</h1>
            <p>{id}</p>
        </div>
    );
}

export async function getServerSideProps({ params }) {
    return {
        props: {
            id: params.id,
        },
    };
}
