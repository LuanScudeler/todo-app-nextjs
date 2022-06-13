export function uuid(template?: string | undefined ) {
    return (template || 'xxxxxxxxxxxx').replace(
        /[x]/g,
        (c) => {
        const r = (Math.random() * 10) | 0;
        const v = c == 'x' ? r : (r & 0x3) | 0x8;

        return v.toString(10);
        }
    );
}