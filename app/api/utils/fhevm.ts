import { initFhevm, createInstance, FhevmInstance } from "fhevmjs";

const createFhevmInstance = async (): Promise<FhevmInstance> => {
    await initFhevm();
    const instance = await createInstance({
        network: window.ethereum,
        networkUrl: 'https://rpc.encifher.io/',
        gatewayUrl: 'https://gateway.rpc.encifher.io',
    });
    return instance;
};

export const encryptAmount = async (address: string, amount: number, contractAddress: string) => {
    const instance = await createFhevmInstance();
    const input = instance.createEncryptedInput(contractAddress, address)
    input.add64(amount);
    return input.encrypt();
}