export const colours = {
    yellow: '#FDDD95',
    red: '#F3A699',
    purple: '#E2A6FF',
    blue: '#8CDDF6',
    green: '#A8EDB7',
} as const;
export type Colour = typeof colours[keyof typeof colours];
