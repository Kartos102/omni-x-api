import { Router } from 'express';
import UsersController from '../controllers/usersController';
import upload from '../utils/multer';

class UsersRouter {
  router = Router();
  usersController = new UsersController();

  constructor() {
    this.intializeRoutes();
  }
  intializeRoutes() {
    this.router.route('/nfts/:address').get(this.usersController.getNFTs);
    this.router.route('/profile/:address').get(this.usersController.getProfile);
    this.router.route('/profile').post(this.usersController.updateProfile);
    this.router.route('/add_banner').post(this.usersController.addBanner);
    this.router.route('/remove_banner').post(this.usersController.removeBanner);
    this.router.route('/add_watchlist').post(this.usersController.addWatchlist);
    this.router.route('/remove_watchlist').post(this.usersController.removeWatchlist);
    this.router.route('/add_hidden_nft').post(this.usersController.addHiddenNFT);
    this.router.route('/remove_hidden_nft').post(this.usersController.removeHiddenNFT);
    this.router.route('/add_following').post(this.usersController.addFollowing);
    this.router.route('/remove_following').post(this.usersController.removeFollowing);
    this.router.route('/getUserNonce/:address').get(this.usersController.getUserNonce);
  }
}
export default new UsersRouter().router;