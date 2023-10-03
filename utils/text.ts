export const getDescription = (text: string[]): string => {
    return text.join(' ').replace(/\s+/g, ' ').trim().substring(0, 30) 
} 

export const getTextAttributes = (text: string) => {
    const lines: string[] = text.split('\n');
    const title: string = lines[0] || '';
    const descriptionLines: string[] = lines.slice(1);
    const description: string = getDescription(descriptionLines);

    return { title, description };
}