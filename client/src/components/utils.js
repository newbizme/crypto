

export function formatData(data) {
    data.map((d) => {
        d.date = new Date(d.date);
    })
    return data;
}