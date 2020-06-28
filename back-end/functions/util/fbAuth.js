const { admin, db } = require('./admin');

// TO AUTHORIZAD TO CREATE A NEW PRODUCT
exports.FBAuth = (req, res, next) => {
  let idToken;
  // with exists some authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    console.error('No token found');
    return res.status(403).json({ error: 'Unauthorized' });
  }
  // getting the information
  admin.auth().verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;
      // console.log(req.user);
      return db.collection('users').where('userId', '==', req.user.uid)
        .limit(1).get();
    })
    .then((doc) => {
      // console.log(doc.docs)
      // // this is to add in decoded toke this informations
      req.user.handle = doc.docs[0].data().handle;
      req.user.imageUrl = doc.docs[0].data().imageUrl;
      return next();
    })
    .catch((err) => {
      console.error('Error while verifying token', err);
      return res.status(403).json(err);
    });
};