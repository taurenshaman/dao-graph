import { PlatformBase } from "./PlatformBase";

export type DAOhausNetworkType = "0x1" | "0x5" | "0x64" | "0xa" | "0x89" | "0xa4b1";

export class DAOhaus extends PlatformBase {
    override parse(originalItems: any) {
        this.items = [];
        if(!originalItems || !Array.isArray(originalItems) || originalItems.length === 0) return;
        originalItems.forEach((originalItem) => {
            this.items.push({
                id: originalItem.id,
                name: originalItem.name,
                avatar: originalItem.avatarImg || `https://robohash.org/${originalItem.id}.png?set=set3`,
                description: originalItem.description || "[Not Set]",
                activeMemberCount: originalItem.activeMemberCount || 0,
                proposalCount: originalItem.proposalCount || 0
            });
        });
    }
}

export class DAOhausUtils {
    static getSupportedNetwork(networkId: string) {
        let n = networkId as DAOhausNetworkType || "0x1";
        return n;
    }
}