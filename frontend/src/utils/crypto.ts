function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
    }
    return bytes.buffer
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
}

export async function encryptWithPublicKey(plainText: string, publicKeyBase64: string): Promise<string> {
    const keyBuffer = base64ToArrayBuffer(publicKeyBase64)

    const publicKey = await window.crypto.subtle.importKey(
        'spki',
        keyBuffer,
        { name: 'RSA-OAEP', hash: 'SHA-256' },
        false,
        ['encrypt']
    )

    const encodedData = new TextEncoder().encode(plainText)

    const encryptedBuffer = await window.crypto.subtle.encrypt(
        { name: 'RSA-OAEP' },
        publicKey,
        encodedData
    )

    return arrayBufferToBase64(encryptedBuffer)
}