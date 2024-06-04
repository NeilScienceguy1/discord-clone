import { db } from "./db";

export const findOrCreateConvo = async (memberId1: string, memberId2: string) => {
    let convo = await findConvo(memberId1, memberId2) || await findConvo(memberId2, memberId1 )

    if (!convo) {
        convo = await createConvo(memberId1, memberId2)
    }

    return convo
}

const findConvo = async (memberId1: string, memberId2: string) => {
    try {
        return await db.conversation.findFirst({
            where:{
                AND:[
                    {memberOneId: memberId1},
                    {memberTwoId: memberId2}
                ]
            },
            include:{
                memberOne:{
                    include:{
                        profile:true
                    }
                },
                memberTwo:{
                    include:{
                        profile:true
                    }
                }
            }
        })
    } catch (e) {
        return null
    }
}

const createConvo = async (memberId1: string, memberId2: string) => {
    try {
        return await db.conversation.create({
            data:{
                memberOneId: memberId1,
                memberTwoId: memberId2
            },
            include:{
                memberOne:{
                    include:{
                        profile:true
                    }
                },
                memberTwo:{
                    include:{
                        profile:true
                    }
                }
            }
        })
    } catch(err) {
        console.log(err)
        return null
    }
}