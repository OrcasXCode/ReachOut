export class AES {
    

    //The hashKey function in AES will ensure the key is hashed into a valid 256-bit key before being used for AES-GCM encryption or decryption.
    static async hashKey(secret: string): Promise<Uint8Array> {
      const encoder = new TextEncoder();
      const hashedKey = await crypto.subtle.digest('SHA-256', encoder.encode(secret));
      return new Uint8Array(hashedKey); // returns a 256-bit (32-byte) key
    }
  
    // Encrypts data using AES-GCM
    static async encrypt(data: string, secret: string) {
      const key = await this.hashKey(secret); // Hash the secret to get a 256-bit key
      const iv = crypto.getRandomValues(new Uint8Array(12)); // Initialization vector
      const importedKey = await crypto.subtle.importKey(
        "raw",
        key,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
      );
  
      const encryptedData = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        importedKey,
        new TextEncoder().encode(data)
      );
  
      return {
        encrypted: Buffer.from(encryptedData).toString("base64"),
        iv: Buffer.from(iv).toString("base64"),
      };
    }
  
    // Decrypts data using AES-GCM
    static async decrypt(encryptedData: string, iv: string, secret: string) {
      const key = await this.hashKey(secret); // Hash the secret to get a 256-bit key
      const importedKey = await crypto.subtle.importKey(
        "raw",
        key,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
      );
  
      const decryptedData = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: Buffer.from(iv, "base64") },
        importedKey,
        Buffer.from(encryptedData, "base64")
      );
  
      return new TextDecoder().decode(decryptedData);
    }
  }
  