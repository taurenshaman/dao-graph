import { PlatformBase } from "./PlatformBase";

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