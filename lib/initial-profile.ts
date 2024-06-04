import { currentUser, auth } from "@clerk/nextjs/server";
import { db } from "./db";


export const initialProfile = async() => {
    const user = await currentUser()
    if (!user) {
        return auth().redirectToSignIn()
    }

    const profile = await db.profile.findUnique({where: {userId: user.id}})

    if (profile) return profile

    let hasLastName = user.lastName != null
    let name = `${user.firstName}`

    if (hasLastName) name+= ` ${user.lastName}`

    const newProfile = await db.profile.create({data: {
        userId: user.id,
        name: name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress
    }});
    return newProfile
}