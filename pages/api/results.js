import prisma from "@/lib/prisma";

export default async (req, res) => {
    const { chosenOptions } = req.body;

    const results = await prisma.answer.findMany({
        where: {
            option: {
                id: {
                    in: chosenOptions,
                },
            },
        },
        include: {
            option: true,
        },
    });

    res.status(200).json({
        results,
    });
};
