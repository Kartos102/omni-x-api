import { Router } from 'express';
import CollectionsController from '../controllers/collectionsController';

class CollectionsRouter {
  router = Router();
  collectionsController = new CollectionsController();

  constructor() {
    this.intializeRoutes();
  }
  intializeRoutes() {
    this.router.route('/').get(this.collectionsController.getCollection);
    this.router.route('/').post(this.collectionsController.addCollection);
    this.router.route('/stats').get(this.collectionsController.getCollectionStat);
    this.router.route('/chart').get(this.collectionsController.getCollectionChart);

    this.router.route('/nfts').post(this.collectionsController.getNFTs);   // Get NFTs of the collection
    this.router.route('/nfts/updateListPrice').post(this.collectionsController.updateListPrice); // Update the list price
    this.router.route('/nfts/updateSalePrice').post(this.collectionsController.updateSalePrice);  // Update the Sale price
    this.router.route('/nfts/updateChainID').post(this.collectionsController.updateChainID);
    this.router.route('/allNfts').post(this.collectionsController.getAllNFTs);   // Get NFTs of the collection
    this.router.route('/addNFT').post(this.collectionsController.addNFT);//save the minted nft in the database


    this.router.route('/all').get(this.collectionsController.getCollections);  // Get All collections
    this.router.route('/:col_url').get(this.collectionsController.getCollectionInfo); // Get Collection Detail
    this.router.route('/:collection_chain/:collection_address').post(this.collectionsController.getCollectionOwners); // Get Collection Detail
    this.router.route('/:col_url/:token_id').get(this.collectionsController.getNFTInfo); // Get NFT Detail
    this.router.route('/owner/:col_address/:collection_chain_name/:token_id').get(this.collectionsController.getNFTOwner);
  }
}
export default new CollectionsRouter().router;