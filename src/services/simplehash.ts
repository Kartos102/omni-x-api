import * as fetch from 'node-fetch';
const simplehashkey = process.env.API_KEY;

// const timer = (ms) => new Promise((res) => setTimeout(res, ms));

// export const hasUserNFT = async (chain: string, signer: string, collection: string, tokenId) => {
//     // try {
//     //     await timer(10);
//     //     await Moralis.start({ serverUrl, appId, moralisSecret })

//     //     if ( tokenId == null ) {
//     //         const options = { address: collection, chain }
//     //         const nftOwners = await Moralis.Web3API.token.getNFTOwners(options)
//     //         for ( let nftOwner of nftOwners.result ) {
//     //             if ( nftOwner.owner_of == signer ) {
//     //                 return true
//     //             }
//     //         }
//     //     } else if ( tokenId >= 0 ) {
//     //         const options = { address: collection, token_id: tokenId, chain }
//     //         const nftOwners = await Moralis.Web3API.token.getTokenIdOwners(options)
//     //         for ( let nftOwner of nftOwners.result ) {
//     //             if ( nftOwner.owner_of == signer ) {
//     //                 return true
//     //             }
//     //         }
//     //     }
//     //     return false
//     // } catch (err) {
//     //     console.log(err)
//     //     return false
//     // }
// }

export const getUserNFTsOfArbOpt = async (chain: string, address: string) => {
    const sdk = require('api')('@simplehash/v0#4dtoyy44l62ilozm');
    sdk.nftsByOwners({
        chains: chain,
        wallet_addresses: address,
        'x-api-key': simplehashkey
    })
    .then(res => {
        return res;
    })
    .catch(err => console.error(err));
};

// export const getNFTsFromCollection = async (chain: string, address: string, cursor = null) => {
//     // try {
//     //     await timer(10);
//     //     const limit = 30;
//     //     await Moralis.start({ serverUrl, appId, moralisSecret })
//     //     const options = {
//     //         chain,
//     //         address,
//     //         cursor,
//     //         limit
//     //     }
//     //     const nft_result = await Moralis.Web3API.token.getAllTokenIds(options)
//     //     const result = new Array();
//     //     for ( var i = 0; i < nft_result.result.length; i ++ ) {
//     //         const nft = nft_result.result[i];
//     //         if ( nft.metadata == null && nft.token_uri ) {
//     //             const resp = await fetch(nft.token_uri);
//     //             nft.metadata = await resp.text();
//     //         }
//     //         result.push(nft);
//     //     }
//     //     nft_result.result = result
//     //     return nft_result
//     // } catch (err) {
//     //     console.log("moralis getNFTsFromCollection err?", err)
//     //     return {result: []}
//     // }
// }

// export const getNFTOwnerCntFromCollection = async (chain: string, address: string) => {
// 	// try {
//     //     await timer(10);
// 	// 	await Moralis.start({ serverUrl, appId, moralisSecret })
// 	// 	let cursor = null;
// 	// 	let owners = {};
// 	// 	do {
// 	// 		const response = await Moralis.Web3API.token.getNFTOwners({
// 	// 			address,
// 	// 			chain,
// 	// 			cursor,
// 	// 		});
// 	// 		for (const owner of response.result) {
// 	// 			owners[owner.owner_of] = 1;
// 	// 		}
// 	// 		cursor = response.cursor;
// 	// 	} while (cursor != "" && cursor != null);
// 	// 	return Object.keys(owners).length;
// 	// } catch (err) {
// 	// 	console.log("moralis getNFTOwnerCntFromCollection err ?", err)
// 	// 	return 0
// 	// }
// }

// export const getNFTCntFromCollection = async (chain: string, address: string) => {
// 	// try {
//     //     await timer(10);
// 	// 	await Moralis.start({ serverUrl, appId, moralisSecret })
// 	// 	const response = await Moralis.Web3API.token.getAllTokenIds({
// 	// 		address,
// 	// 		chain,
// 	// 	});
// 	// 	return response.total;
// 	// } catch (err) {
// 	// 	console.log("moralis getNFTCntFromCollection err ?", err)
// 	// 	return 0
// 	// }
// }
// export const getTokenMetadata = async (chain: string, address: string, token_id: string) => {
// 	// try {
//     //     await timer(10);
// 	// 	await Moralis.start({ serverUrl, appId, moralisSecret })
// 	// 	const tokenIdMetadata = await Moralis.Web3API.token.getTokenIdMetadata({
// 	// 		chain,
// 	// 		address,
// 	// 		token_id
//     //     });
//     //     if ( tokenIdMetadata.metadata == null && tokenIdMetadata.token_uri ) {
//     //         const resp = await fetch(tokenIdMetadata.token_uri);
//     //         tokenIdMetadata.metadata = await resp.text();
//     //     }

// 	// 	return tokenIdMetadata;
// 	// } catch (err) {
// 	// 	console.log("moralis getTokenMetadata err ?", err)
// 	// 	return {}
// 	// }
// }
// export const getTokenOwners = async (chain: string, address: string, token_id: string) => {
// 	// try {
//     //     await timer(10);
// 	// 	await Moralis.start({ serverUrl, appId, moralisSecret })
// 	// 	const tokenIdOwners = await Moralis.Web3API.token.getTokenIdOwners({
// 	// 		chain,
// 	// 		address,
// 	// 		token_id
//     //     })
//     //     let nftOwnerAddress = ""
//     //     for ( let nftOwner of tokenIdOwners.result ) {
//     //         nftOwnerAddress = nftOwner.owner_of
//     //     }

// 	// 	return nftOwnerAddress;
// 	// } catch (err) {
// 	// 	console.log("moralis getTokenOwners err ?", err)
// 	// 	return {}
// 	// }
// }