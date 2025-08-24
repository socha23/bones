export enum FaceType {
    BLANK,
    I1,
    I2,
    I3,
    I4,
    I5,
    I6,
    SWORD,
    SWORD_2,
    SWORD_3,
    SHIELD,
    SHIELD_2,
    SHIELD_3,
    HOLD_SHIELD, 
}

enum _UnimplementedFaceType {
    
    DOUBLE_ATTACK,
    HOLD_ATTACK,

    SHIELD_BASH,
    DOUBLE_SHIELD,

    MANA,
    TWO_MANA,
    THREE_MANA,
    MANA_STRIKE,
    MANA_SHIELD,
    DOUBLE_MANA,
}

const faceDescriptions = {
    [FaceType.BLANK]: 'No effect',
    [FaceType.I1]: 'One',
    [FaceType.I2]: 'Two',
    [FaceType.I3]: 'Three',
    [FaceType.I4]: 'Four',
    [FaceType.I5]: 'Five',
    [FaceType.I6]: 'Six',
    [FaceType.SWORD]: '+1 Attack',
    [FaceType.SWORD_2]: '+2 Attack',
    [FaceType.SWORD_3]: '+3 Attack',
    [FaceType.SHIELD]: '+1 Defence',
    [FaceType.SHIELD_2]: '+2 Defence',
    [FaceType.SHIELD_3]: '+3 Defence',
    [FaceType.HOLD_SHIELD]: 'Defence carries over to next round',
}

export function descriptionForFaceType(t: FaceType): string {
    return faceDescriptions[t]
}