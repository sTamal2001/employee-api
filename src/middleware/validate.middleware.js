// const validate = (schema) => (req, res, next) => {
//   try {
//     schema.parse(req.body);
//     next();
//   } catch (error) {
//     return res.status(400).json({
//       message: error.error[0].message,
//     });
//   }
// };

// module.exports = validate;

const validate = (schema) => (req, res, next) => {
  try {

    schema.parse(req.body);
    next();

  } catch (error) {

    if (error.issues && error.issues.length > 0) {
      return res.status(400).json({
        errors: error.issues.map(issue => issue.message)
      });
    }

    return res.status(400).json({
      message: "Validation error"
    });

  }
};

module.exports = validate;