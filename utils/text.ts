const cut = (str: string) => {
    return str.length > 30 ? str.substring(0, 30) + '...' : str;
}

export const getDescription = (text: string[]): string => {
    const desc = text.join(' ').replace(/\s+/g, ' ').trim();

    return cut(desc);
} 

export const getTextAttributes = (text: string) => {
    const lines: string[] = text.split('\n');
    const title: string = cut(lines[0]) || '';
    const descriptionLines: string[] = lines.slice(1);
    const description: string = getDescription(descriptionLines);

    return { title, description };
}