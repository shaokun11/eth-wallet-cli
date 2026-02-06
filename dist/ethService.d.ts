export declare class EthService {
    private provider;
    constructor(rpcUrl?: string);
    getBalance(address: string): Promise<bigint>;
    formatEther(wei: bigint, decimals?: number): string;
    parseEther(ether: string, decimals?: number): bigint;
    getCurrentBlock(): Promise<number>;
    getTransactionCount(address: string): Promise<number>;
    createWallet(): {
        address: string;
        privateKey: string;
        mnemonic: string;
    };
    encryptWallet(password: string): Promise<string>;
}
//# sourceMappingURL=ethService.d.ts.map