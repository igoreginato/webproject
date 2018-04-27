const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// const multer = require('multer');

// Dealing with file upload
//
// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, './uploads/');
//   },
//   filename: function(req, file, cb) {
//     cb(null, new Date().toISOString() + file.originalname);
//   }
// });
//
// const fileFilter = (req, file, cb) => {
//   // reject file
//   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// }
//
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 5 // 5MB file size limit
//   },
//   fileFilter: fileFilter
// });
// ##########################################################

const Company = require('../models/company')

router.get('/', (req, res, next) => {
  Company.find()
    .select('name _id')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        companies: docs.map(doc => {
          return {
            name: doc.name,
            _id: doc._id,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/companies/' + doc._id
            }
          }
        })
      }
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
});

// router.post('/', upload.single('productImage'), (req, res, next) => {
router.post('/', (req, res, next) => {
  console.log(req.file);
  const company = new Company({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name
  });
  company
    .save()
    .then(result => {
    console.log(result);
    res.status(201).json({
      message: 'Company created successfully',
      createdCompany: {
        name: result.name,
        _id: result._id,
        request: {
          type: 'GET',
          url: 'http://localhost:3000/companies/' + result._id
        }
      }
    });
  })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err})
    });

});

router.get('/:companyId', (req, res, next) => {
  const id = req.params.companyId;
  Company.findById(id)
    .select(' name _id')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          employee: doc,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/companies/' + doc._id
          }
        });
      } else {
        res.status(400).json({message: 'No valid entry found for provided ID'});
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err});
    });
});

router.patch('/:companyId', (req, res, next) => {
  const id = req.params.companyId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Company.update({_id: id}, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(updateOps);
      res.status(200).json({
        message: 'Company updated',
        request: {
          type: 'GET',
          url: 'http://localhost:3000/companies/' + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
});

router.delete('/:companyId', (req, res, next) => {
  const id = req.params.companyId;
  Company.remove({_id: id})
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Company deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/companies/',
          body: {
            name: 'String'
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    });
});

module.exports = router;
