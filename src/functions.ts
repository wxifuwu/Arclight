import { Client, Guild, GuildMember, PermissionFlagsBits, PermissionResolvable, TextChannel } from "discord.js"

export const checkPermissions = (member: GuildMember, permissions: Array<PermissionResolvable>) => {
    let neededPermissions: PermissionResolvable[] = []
    permissions.forEach(permission => {
        if (!member.permissions.has(permission)) neededPermissions.push(permission)
    })
    if (neededPermissions.length === 0) return null
    return neededPermissions.map(p => {
        if (typeof p === "string") return p.split(/(?=[A-Z])/).join(" ")
        else return Object.keys(PermissionFlagsBits).find(k => Object(PermissionFlagsBits)[k] === p)?.split(/(?=[A-Z])/).join(" ")
    })
}

export const sendTimedMessage = (message: string, channel: TextChannel, duration: number) => {
    channel.send(message)
        .then(m => setTimeout(async () => (await channel.messages.fetch(m)).delete(), duration))
    return
}

export const isOwnInvite = async (guild: Guild, code: string) : Promise<boolean> => {
    return await new Promise((resolve) => {
        guild.invites.fetch().then((invites) => {
            for (const invite of invites) {
                if(code === invite[0]) {
                    resolve(true)
                    return
                }
            }
    
            resolve(false);
            return
        })
    })
}

export const generatePin = () => {
    return Math.floor(Math.random() * 9000) + 1000;
}