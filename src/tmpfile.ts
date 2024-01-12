const fs = require('fs');


const RANDOM_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const BASE_PATH = '/tmp';


function randomName(length: number): string {
    let result = '';
    for (let i = 0; i < length; i++) {
        // 10 + 26 + 26 = 62 (RANDOM_CHARS.length)
        result += RANDOM_CHARS.charAt(Math.floor(Math.random() * 62))
    }

    return result;
}

export function writeTmpfile(content: string, filenameLength: number = 64): string {
    const name = randomName(filenameLength);
    const path = `${BASE_PATH}/${name}`;
    fs.writeFileSync(path, content);
    // recommended access mode since every user should have their own kubeconfig
    fs.chmodSync(path, 0o600);

    return path;
}

export function deleteTmpfile(name: string): any {
    if (name.startsWith(BASE_PATH)) {
        return fs.unlinkSync(name);
    } else {
        return null;
    }
}
