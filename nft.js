import tonMnemonic from "tonweb-mnemonic";
import TonWeb from "tonweb";


const mnemonic = 'major egocentric wonder reverse almost graveyard orphan merge begin night unequaled amazing decontamination pot warn ruthless nightmare heartbreaking spread weapon sanction nappy foolish scintillating'; // 24-word passphrase
const walletVersion = 'v4R2'; // v3R2, v4R2, etc.. from tonscan.org
const nftAddresses = [
    'EQADnfRgYSnNgaixgYvgGG0lgToYIhDsSEGhlwtLcl3LTmqa', // comma-separated NFT addresses in ''
    'EQChG0Azn4atp3ZCXqVRAP2gMUdabmLoDi9sRO1V2qGlnK6k'
];
const destinationAddress = 'EQD_5Gn0KWVVr1nXWuNB_ZJlAWjAdI8LNqO_HTNH7ijeW6m6'; // your new address


(async () => {
    const {NftItem} = TonWeb.token.nft;
    const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC'));
    const mnemonicParts = mnemonic.split(' ')
    const keyPair = await tonMnemonic.mnemonicToKeyPair(mnemonicParts);
    const WalletClass = tonweb.wallet.all[walletVersion];
    const wallet = new WalletClass(tonweb.provider, {
        publicKey: keyPair.publicKey,
        wc: 0
    });
    async function transfer(nftAddress) {
        const myAddress = new TonWeb.utils.Address(destinationAddress);
        const nftItem = new NftItem(tonweb.provider, {address: nftAddress});

        const seqno = (await wallet.methods.seqno().call()) || 0;
        console.log({seqno});
        await new Promise(resolve => setTimeout(resolve, 1000));

        const amount = TonWeb.utils.toNano(0.04);

        console.log(
            await wallet.methods.transfer({
                secretKey: keyPair.secretKey,
                toAddress: await nftAddress,
                amount: amount,
                seqno: seqno,
                payload: await nftItem.createTransferBody({
                    newOwnerAddress: myAddress,
                    forwardAmount: TonWeb.utils.toNano(0.02),
                    forwardPayload: new TextEncoder().encode('gift'),
                    responseAddress: myAddress
                }),
                sendMode: 3,
            }).send().catch(e => console.log(e))
        );
    }

    let i = 0;
    nftAddresses.forEach((e) => {
        setTimeout(() => transfer(e), i*24000)
        i++;
    })

})();