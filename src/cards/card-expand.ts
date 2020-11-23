export enum CardExpand {
    CATEGORY = 'category',
    LIKES = 'likes',
    CREATOR = 'creator',
}

export function getAllowCardExpand(): string[]{
    const allowedCardExpand = [];
    for (const [propertyKey, propertyValue] of Object.entries(CardExpand)) {
        if (!Number.isNaN(Number(propertyKey))) {
            continue;
        }
        allowedCardExpand.push(propertyValue);
    }
    return allowedCardExpand;
}