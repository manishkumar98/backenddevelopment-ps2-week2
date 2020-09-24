const express = require('express')
const router = express.Router()
const Alien = require('../models/alien')
const multer=require('multer')
//const path=require('path')
const mongoose = require('mongoose')
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads/')
    },
    filename:function(req,file,cb){
        cb(null,new Date().toISOString()+file.originalname);

    }
});
const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10
  },
  fileFilter: fileFilter
});
//const upload=multer({dest:'uploads'});
//const upload = multer({ storage: storage });

//router.route("/upload")
    /* replace foo-bar with your form field-name */
  //  .post(upload.single("foo-bar"), function(req, res){
    //   [...]
    //})



router.get("/", (req, res, next) => {
  Alien.find()
    .select("name collegeid branch tech sub _id image")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        aliens: docs.map(doc => {
          return {
            name: doc.name,
            collegeid: doc.collegeid,
            branch: doc.branch,
            tech:doc.tech,
            sub:doc.sub,
            _id: doc._id,
            image:doc.image,
            request: {
              type: "GET",
              url: "http://localhost:3000/aliens/" + doc._id
            }
          };
        })
      };
      //   if (docs.length >= 0) {
      res.status(200).json(response);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.post("/", upload.single('image'), (req, res, next) => {
  const alien = new Alien({
    _id: new mongoose.Types.ObjectId(),
           name: req.body.name,
            collegeid: req.body.collegeid,
            branch: req.body.branch,
            tech:req.body.tech,
            sub:req.body.sub,   
            image: req.file.path 
  });
  alien
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created user successfully",
        createdUser: {
            name: result.name,
            collegeid: result.collegeid,
            branch:result.branch,
            tech:result.tech,
            sub:result.sub,

            _id: result._id,
            request: {
                type: 'GET',
                url: "http://localhost:3000/aliens/" + result._id
            }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get("/:userId", (req, res, next) => {
  const id = req.params.userId;
  Alien.findById(id)
    .select("name collegeid branch tech sub _id image")
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
            user: doc,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/aliens'
            }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:userId", (req, res, next) => {
  const id = req.params.userId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  /*updateOps[name]=req.body.name,
  updateOps[collegeid]=req.body.collegeid,
  updateOps[branch]=req.body.branch,
  updateOps[tech]=req.body.tech,
  updateOps[sub]=req.body.sub*/
  Alien.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Data updated',
          request: {
              type: 'GET',
              url: 'http://localhost:3000/aliens/' + id
          }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:userId", (req, res, next) => {
  const id = req.params.userId;
  Alien.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'User deleted',
          request: {
              type: 'POST',
              url: 'http://localhost:3000/aliens',
              body: { name: 'String', collegeid: 'String' }
          }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


module.exports = router
