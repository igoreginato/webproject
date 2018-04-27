const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

const Employee = require('../models/employee')

router.get('/', (req, res, next) => {
  Employee.find()
    .select('first_name last_name _id role identification email')
    .populate('company', 'name')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        employees: docs.map(doc => {
          return {
            name: doc.first_name + " " + doc.last_name,
            role: doc.role,
            identification: doc.identification,
            email: doc.email,
            _id: doc._id,
            company: doc.company,
            request: {
              type: 'DELETE',
              url: 'http://localhost:3000/employees/' + doc._id
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
  Employee.find({email: req.body.email})
  .exec()
  .then(user => {
    if(user.length >= 1) {
      return res.status(409).json({
        message: "Email exists"
      })
    } else {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if(err) {
          return res.status(500).json({
            error: err
          })
        } else {
          // console.log(req.file);
          const employee = new Employee({
            _id: new mongoose.Types.ObjectId(),
            company: req.body.company,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            role: req.body.role,
            identification: req.body.identification,
            email: req.body.email,
            registered: req.body.registered,
            password: hash
          });
          employee
          .save()
          .then(result => {
            console.log(result);
            res.status(201).json({
              message: 'Employee created successfully',
              createdEmployee: {
                name: result.first_name + " " + result.last_name,
                email: result.email,
                registered: result.registered,
                password: result.password,
                _id: result._id,
                company: result.company,
                request: {
                  type: 'GET',
                  url: 'http://localhost:3000/employees/' + result._id
                }
              }
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
          });

        }
      })
    }
  })
});

router.get('/:employeeId', (req, res, next) => {
  const id = req.params.employeeId;
  Employee.findById(id)
    .select(' first_name last_name role _id identification email status registered')
    .populate('company')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          employee: doc,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/employees/' + doc._id
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

router.patch('/:employeeId', (req, res, next) => {
  const id = req.params.employeeId;
  const updateOps = {};
  for (const ops of req.body) {
    if (ops.propName === "password") {
      updateOps[ops.propName] = bcrypt.hashSync(ops.value, 10);;
    } else {
      updateOps[ops.propName] = ops.value;
    };
  };
  Employee.update({_id: id}, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(updateOps);
      res.status(200).json({
        message: 'Employee updated',
        values: updateOps,
        request: {
          type: 'GET',
          url: 'http://localhost:3000/employees/' + id
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

router.delete('/:employeeId', (req, res, next) => {
  const id = req.params.employeeId;
  Employee.remove({_id: id})
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Employee deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/employees/',
          body: {
            company: 'companyId',
            first_name: 'String',
            last_name: 'String',
            role: 'String',
            identification: 'String',
            email: 'String',
            password: 'String'
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
