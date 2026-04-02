import prisma from "#prisma"

export const personModel = {
    getPersonByEmail: async (email: string) => {
        return await prisma.person.findUnique({
            where: {email: email}
        })
    }
}