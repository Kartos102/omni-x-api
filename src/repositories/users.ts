import users from '../models/users';

class UsersRepository {
  constructor() {}

  getProfile = async (address: String) => {
    const filters = [{ address }];

    const user = await users.findOne({ $and: filters });

    if ( user ) {
      return user;
    } else {
      return {
        address: address,
        username: '',
        bio: '',
        twitter: '',
        website: '',
        greg: '',
        avatar: 'uploads\\default_avatar.png',
        banners: ['uploads\\default_banner.png', 'uploads\\default_banner.png', 'uploads\\default_banner.png']
      };
    }
  }

  updateProfile = async (
    address: string,
    username: string,
    bio: string,
    twitter: string,
    website: string,
    greg: string,
    avatar: string,
    banner_1: string,
    banner_2: string,
    banner_3: string,
  ) => {
    const filters = [{ address }];
    const user = await users.findOne({ $and: filters });

    if ( user ) {
      user.username = username;
      user.bio = bio;
      user.twitter = twitter;
      user.website = website;
      user.greg = greg;
      if ( !user.avatar ) {
        user.avatar = 'uploads/default_avatar.png';
      }
      if ( avatar )
        user.avatar = avatar;
      let banners: Array<any> = user.banners;
      if ( !user.banners ) {
        banners = [];
        banners.push('uploads/default_banner.png');
        banners.push('uploads/default_banner.png');
        banners.push('uploads/default_banner.png');
      }
      if ( banner_1 )
        banners[0] = banner_1;

      if ( banner_2 )
        banners[1] = banner_2;

      if ( banner_3 )
        banners[2] = banner_3;

      user.banners = banners;
      user.save();
      return user;
    } else {
      return await users.create({
        address,
        username,
        bio,
        twitter,
        website,
        greg,
        avatar: avatar ? avatar : 'uploads\\default_avatar.png',
        banners: [banner_1 ? banner_1 : 'uploads\\default_banner.png', banner_2 ? banner_2 : 'uploads\\default_banner.png', banner_3 ? banner_3 : 'uploads\\default_banner.png']
      });
    }
  }

  addBanner = async (address: string, banner: string) => {
    const filters = [{ address }];

    users.find({ $and: filters }).exec((err, user) => {
      if (user.length === 0) {
        return [];
      } else {
        if (user && user[0]) {
          const banners = user[0].banners as any;
          if (banner) banners.push(banner);
          user[0].banners = banners;
          user[0].save();
          return user[0];
        }
      }
    });
  }

  removeBanner = async (address: string, banner: string) => {
    const filters = [{ address }];

    users.find({ $and: filters }).exec((err, user) => {
      if (user.length === 0) {
        return [];
      } else {
        if (user && user[0]) {
          const banners = user[0].banners as any;
          if (banner) {
            let filename = banner.substring(banner.lastIndexOf('/') + 1);
            filename = filename.substring(filename.lastIndexOf('\\') + 1);
            const idx = banners.indexOf('uploads\\' + filename);
            banners.splice(idx, 1);
          }
          user[0].banners = banners;
          user[0].save();
          return user[0];
        }
      }
    });
  }

  addWatchlist = async (address: string, watchlist: string) => {
    const filters = [{ address }];

    users.find({ $and: filters }).exec((err, user) => {
      if (user.length === 0) {
        return [];
      } else {
        if (user && user[0]) {
          const watchlists = user[0].watchlists as any;
          watchlists.push(watchlist);
          user[0].watchlists = watchlists;
          user[0].save();
          return user[0];
        }
      }
    });
  }

  removeWatchlist = async (address: String, watchlist: String) => {
    const filters = [{ address }];

    users.find({ $and: filters }).exec((err, user) => {
      if (user.length === 0) {
        return [];
      } else {
        if (user && user[0]) {
          const watchlists = user[0].watchlists as any;
          const idx = watchlists.indexOf(watchlist);
          watchlists.splice(idx, 1);
          user[0].watchlists = watchlists;
          user[0].save();
          return user[0];
        }
      }
    });
  }

  addHiddenNFT = async (address: String, hiddenNFT: String) => {
    const filters = [{ address }];

    users.find({ $and: filters }).exec((err, user) => {
      if (user.length === 0) {
        return [];
      } else {
        if (user && user[0]) {
          const hiddenNFTs = user[0].hiddenNFTs as any;
          hiddenNFTs.push(hiddenNFT);
          user[0].hiddenNFTs = hiddenNFTs;
          user[0].save();
          return user[0];
        }
      }
    });
  }

  removeHiddenNFT = async (address: String, hiddenNFT: String) => {
    const filters = [{ address }];

    users.find({ $and: filters }).exec((err, user) => {
      if (user.length === 0) {
        return [];
      } else {
        if (user && user[0]) {
          const hiddenNFTs = user[0].hiddenNFTs as any;
          const idx = hiddenNFTs.indexOf(hiddenNFT);
          hiddenNFTs.splice(idx, 1);
          user[0].hiddenNFTs = hiddenNFTs;
          user[0].save();
          return user[0];
        }
      }
    });
  }

  addFollowing = async (address: String, following: String) => {
    const filters = [{ address }];

    users.find({ $and: filters }).exec((err, user) => {
      if (user.length === 0) {
        return [];
      } else {
        if (user && user[0]) {
          const followings = user[0].followings as any;
          followings.push(following);
          user[0].followings = followings;
          user[0].save();
          return user[0];
        }
      }
    });
  }

  removeFollowing = async (address: String, following: String) => {
    const filters = [{ address }];

    users.find({ $and: filters }).exec((err, user) => {
      if (user.length === 0) {
        return [];
      } else {
        if (user && user[0]) {
          const followings = user[0].followings as any;
          const idx = followings.indexOf(following);
          followings.splice(idx, 1);
          user[0].followings = followings;
          user[0].save();
          return user[0];
        }
      }
    });
  }
}

export default new UsersRepository();
