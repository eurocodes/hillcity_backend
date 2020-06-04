exports.generateID = () => {
    const token = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    let newEng = "EN-";
    const today = new Date().toDateString();
    const day = today.split(" ")[2];
    const month = today.split(" ")[1];

    for (let i = 0; i < 4; i++) {
        const ranNum = Math.floor(Math.random() * 35);
        newEng += token[ranNum];
    }
    const newString = `${newEng}.${day}.${month}`;
    return newString;
}